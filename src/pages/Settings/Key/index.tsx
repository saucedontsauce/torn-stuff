import type { SubmitEventHandler, MouseEventHandler } from "react";
import type { IAccess } from "@/App";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
export default function KeyCard({
  apiKey,
  access,
  handleChangeKey,
  handleRemoveKey,
}: {
  apiKey: string | null;
  access: IAccess | null;
  handleChangeKey: SubmitEventHandler;
  handleRemoveKey: MouseEventHandler;
}) {
  return (
    <Card className="bg-light text-dark">
      <Card.Header>
        <strong>API Key</strong>
      </Card.Header>

      <Card.Body>
        <table className="table table-sm align-middle mb-4">
          <tbody>
            <tr>
              <th style={{ width: "180px" }}>Status</th>
              <td>
                {apiKey ? (
                  <span className="badge bg-success">Configured</span>
                ) : (
                  <span className="badge bg-danger">Missing</span>
                )}
              </td>
            </tr>

            <tr>
              <th>Access</th>
              <td>{access?.type}</td>
            </tr>

            <tr>
              <th>Current Key</th>
              <td>
                <code>{apiKey || "Not Set"}</code>
              </td>
            </tr>
          </tbody>
        </table>

        <form className="mb-3" onSubmit={handleChangeKey}>
          <label htmlFor="key" className="form-label">
            Replace API Key
          </label>

          <div className="input-group">
            <input
              id="key"
              name="key"
              type="text"
              className="form-control"
              placeholder="Paste API key..."
              defaultValue={apiKey || ""}
            />

            <button className="btn btn-success" type="submit">
              Save
            </button>
          </div>
        </form>

        <div className="d-flex justify-content-end">
          <Button variant="outline-danger" onClick={handleRemoveKey}>
            Clear API Key
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
