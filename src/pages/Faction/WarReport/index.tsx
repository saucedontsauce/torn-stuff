import { useEffect, useMemo, useState } from "react";
import { Navigate, Link } from "react-router-dom";

import { Container, Table, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

import type {
  FactionRankedWarDetails,
  FactionRankedWarResponse,
  FactionId,
} from "tornapi-typescript";

import RateLimiter from "@shared/calls.ts";

import type { WarReportSettings, WarReport } from "./types";

import {
  calculatePayouts,
  defaultWarReportSettings,
  getReportTotals,
  sortMembers,
} from "./warCalculator";

import {
  loadWarReport,
  getCachedWarReport,
  saveWarReport,
} from "./warReportService";

import type { IAccess } from "@/App.tsx";

export default function WarReport({
  restricted,
  factionId,
  keyAccess,
}: {
  restricted: boolean;
  factionId: FactionId | null;
  keyAccess: IAccess | null;
}) {
  const [wars, setWars] = useState<FactionRankedWarDetails[]>([]);

  const [selectedWar, setSelectedWar] = useState<number | null>(null);

  const [report, setReport] = useState<WarReport | null>(null);

  const [settings, setSettings] = useState<WarReportSettings>(
    defaultWarReportSettings(),
  );

  const [loading, setLoading] = useState(false);

  /**
   * Load available ranked wars
   */
  useEffect(() => {
    if (keyAccess && keyAccess.level !== 2) return;
    const key = localStorage.getItem("apiKey");

    if (!key) {
      return;
    }

    RateLimiter.enqueue(
      `https://api.torn.com/v2/faction/rankedwars?key=${key}`,
      async (res) => {
        const data = res.data as FactionRankedWarResponse;
        setWars(data.rankedwars);
      },
    );
  }, [keyAccess]);

  /**
   * Load selected war
   */
  async function selectWar(warId: number) {
    if (keyAccess && keyAccess.level !== 2) return;

    const key = localStorage.getItem("apiKey");

    if (!key || !factionId) {
      toast.error("Faction ID missing");

      return;
    }

    setLoading(true);

    try {
      const cached = getCachedWarReport(warId);

      let result = cached;

      if (!result) {
        result = await loadWarReport(warId, factionId, key, settings);

        saveWarReport(result);
      }

      setReport(result);
    } catch (err) {
      console.error(err);

      toast.error("Failed loading war report");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Recalculate whenever settings change
   */
  const calculated = useMemo(() => {
    if (keyAccess && keyAccess.level !== 2) return null;

    if (!report) {
      return null;
    }

    return calculatePayouts(report, settings);
  }, [report, settings, keyAccess]);

  const rows = useMemo(() => {
    if (keyAccess && keyAccess.level !== 2) return [];

    if (!calculated) {
      return [];
    }

    return sortMembers(
      calculated.members,
      settings.sortBy,
      settings.descending,
    );
  }, [calculated, settings, keyAccess]);

  const totals = calculated ? getReportTotals(calculated) : null;
  if (restricted || !factionId) {
    return <Navigate to="/" />;
  }
  return (
    <div className="p-4">
      <Container>
        <h1>War Reports</h1>

        {keyAccess && keyAccess.level !== 2 && (
          <div className="alert alert-dismissible alert-danger">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
            ></button>
            <p>
              You need to have an API key set with at least "
              <strong>Limited Access</strong>" to use this tool.
            </p>
            <p>
              You have one set with <strong>{keyAccess?.type}</strong>
            </p>
            <p>
              <Link to="/settings">Click here to change it</Link>
            </p>
          </div>
        )}
        <hr />
        <h3>Settings</h3>
        <Form.Group className="mb-3">
          <Form.Label>War</Form.Label>

          <Form.Select
            value={selectedWar ?? ""}
            onChange={(e) => {
              const id = Number(e.target.value);

              setSelectedWar(id);

              selectWar(id);
            }}
          >
            <option value="">Select war</option>
            {wars.length === 0 && (
              <option value="">No wars to display, get warring pussy</option>
            )}
            {wars.map((war) => (
              <option key={war.id} value={war.id}>
                {war.factions.map((f) => f.name).join(" vs ")}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Total payout value</Form.Label>

          <Form.Control
            type="number"
            value={settings.totalValue}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                totalValue: Number(e.target.value),
              }))
            }
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Faction cut %</Form.Label>

          <Form.Control
            type="number"
            value={settings.factionCut}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                factionCut: Number(e.target.value),
              }))
            }
          />
        </Form.Group>
        <Form.Check
          type="checkbox"
          label="Pay outside hits"
          checked={settings.includeOutsideHits}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              includeOutsideHits: e.target.checked,
            }))
          }
        />
        {loading && <Spinner className="mt-3" />}
        {totals && (
          <div className="mt-4">
            <h3>Summary</h3>

            <p>Hits: {totals.hits}</p>

            <p>Inside: {totals.inside}</p>

            <p>Outside: {totals.outside}</p>

            <p>Total payout: ${totals.payout.toLocaleString()}</p>
          </div>
        )}
        <hr />
        <h3>Members</h3>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>

              <th>Hits</th>

              <th>Inside</th>

              <th>Outside</th>

              <th>Score</th>

              <th>Payout</th>
            </tr>
          </thead>

          <tbody>
            {rows &&
              rows.map((member) => (
                <tr key={member.id}>
                  <td>{member.name}</td>

                  <td>{member.warHits}</td>

                  <td>{member.insideHits}</td>

                  <td>{member.outsideHits}</td>

                  <td>{member.contributionScore}</td>

                  <td>${member.payout.toLocaleString()}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
}
