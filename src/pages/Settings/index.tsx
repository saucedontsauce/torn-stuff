import { Row, Col, Container, Card, Button } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import store from "../../shared/store.ts";
import StorageCard from "./Storage/index";
import KeyCard from "./Key/index";
import {
  useEffect,
  type MouseEventHandler,
  type SubmitEventHandler,
} from "react";
import type { IAccess } from "@/App.tsx";

export default function HomePage({
  access,
  apiKey,
}: {
  access: IAccess | null;
  apiKey: string | null;
}) {
  const handleChangeKey: SubmitEventHandler = (e) => {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.target));
    localStorage.setItem("apiKey", form.key as string);
    window.dispatchEvent(new Event("storage"));
  };

  const handleRemoveKey: MouseEventHandler = (e) => {
    e.preventDefault();
    localStorage.removeItem("apiKey");
    window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {}, []);
  if (!store.apiKey) return <Navigate to="/" />;

  return (
    <div className="p-4">
      <Container>
        <h1>Settings</h1>
        <hr />
        <KeyCard
          apiKey={apiKey}
          access={access}
          handleChangeKey={handleChangeKey}
          handleRemoveKey={handleRemoveKey}
        />
        <hr />
        <StorageCard />
        <hr />
        <Card>
          <Card.Header>Bootswatch Buttons</Card.Header>
          <Card.Body>
            <Container className="d-flex gap-3 flex-wrap">
              <button type="button" className="btn btn-outline-primary">
                Primary
              </button>
              <button type="button" className="btn btn-outline-secondary">
                Secondary
              </button>
              <button type="button" className="btn btn-outline-success">
                Success
              </button>
              <button type="button" className="btn btn-outline-info">
                Info
              </button>
              <button type="button" className="btn btn-outline-warning">
                Warning
              </button>
              <button type="button" className="btn btn-outline-danger">
                Danger
              </button>
              <button type="button" className="btn btn-outline-light">
                Light
              </button>
              <button type="button" className="btn btn-outline-dark">
                Dark
              </button>
            </Container>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
