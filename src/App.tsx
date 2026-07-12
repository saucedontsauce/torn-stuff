import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import store from "@shared/store.ts";
import RateLimiter from "@shared/calls.ts";

import { Nav } from "./components/Nav.tsx";
import { ToastContainer } from "react-toastify";

import type {
  ApiKeyAccessTypeEnum,
  CompanyId,
  FactionId,
  KeyInfoResponse,
  UserId,
} from "tornapi-typescript";

import {
  NotFoundPage,
  HomePage,
  SettingsPage,
  WarReportPage,
  ScriptsPage,
  ToolsPage,
  CompanyHomePage,
  FactionHomePage,
} from "@pages";

export interface IAccess {
  company: boolean;
  faction: boolean;
  level: number;
  log: object;
  type: ApiKeyAccessTypeEnum;
}

function App() {
  const [apiKey, setApiKey] = useState<string | null>(
    localStorage.getItem("apiKey"),
  );
  const [keyAccess, setKeyAccess] = useState<IAccess | null>(null);
  const [userId, setUserId] = useState<UserId | null>(null);
  const [factionId, setFactionId] = useState<FactionId | null>(null);
  const [companyId, setCompanyId] = useState<CompanyId | null>(null);
  useEffect(() => {
    const listener = () => {
      console.log("Change to local storage!");
      setApiKey(apiKey);
      if (apiKey !== null) {
        RateLimiter.enqueue(
          `https://api.torn.com/v2/key/info?key=${apiKey}`,
          (res) => {
            console.log("res");
            //console.log(res);
            const data = res.data as KeyInfoResponse;
            setUserId(data.info.user.id);
            setFactionId(data.info.user.faction_id);
            setCompanyId(data.info.user.company_id);
            setKeyAccess(data.info.access);
            localStorage.setItem("keyAccess", JSON.stringify(data.info.access));
            console.log(`
              API KEY CHANGE:
              key: ${apiKey}
              id: ${data.info.user.id}
              faction_id: ${data.info.user.faction_id}
              company_id: ${data.info.user.company_id}
              `);
          },
        );
      }
    };
    window.addEventListener("storage", listener);
    listener();
    return () => window.removeEventListener("storage", listener);
  }, []);
  return (
    <div className="d-flex flex-column vh-100">
      <Nav restricted={apiKey ? false : true} />
      <main className="d-flex flex-column flex-grow-1 overflow-y-auto">
        <Routes>
          <Route
            index
            element={<HomePage restricted={apiKey ? false : true} />}
          />
          <Route
            path="/company"
            element={<CompanyHomePage cid={companyId} />}
          />
          <Route
            path="/settings"
            element={
              apiKey ? (
                <SettingsPage apiKey={apiKey} access={keyAccess} />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route path="/scripts" element={<ScriptsPage />} />
          <Route
            path="/tools"
            element={apiKey ? <ToolsPage /> : <Navigate to="/" />}
          />
          <Route path="/faction" element={<FactionHomePage />} />
          <Route
            path="/faction/warreport"
            element={
              apiKey ? (
                <WarReportPage
                  keyAccess={keyAccess}
                  factionId={factionId}
                  restricted={apiKey ? false : true}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
        <footer className="mt-auto bg-dark text-center p-2">footer</footer>
        <ToastContainer />
      </main>
    </div>
  );
}

export default App;
