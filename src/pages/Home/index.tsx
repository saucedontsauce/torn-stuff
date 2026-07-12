import { Link } from "react-router-dom";
import { Row, Container, Card } from "react-bootstrap";
import store from "@shared/store.ts";
export default function HomePage({ restricted }: { restricted: boolean }) {
  return (
    <div className="p-4">
      <Container>
        {restricted && (
          <div className="alert alert-dismissible alert-danger">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
            ></button>
            You are currently only seeing a limited part of the site as you do
            not have an api key set, to access the full site enter your key at
            the top.
          </div>
        )}
        <h1>Adams torn related stuff</h1>
        <hr />
        <h3>What is this site?</h3>
        <p>
          A collection of torn related tools and links to other useful tools.
        </p>

        <p>
          All user keys and data are only ever stored locally, once signed in
          you can visit /settings to view stored info.
        </p>
        <hr />
      </Container>
      <Container fluid>
        <Row>
          <Card
            className="bg-dark text-light mb-3 me-3"
            style={{ maxWidth: "20rem" }}
            body
          >
            <h3>
              <Link to="/scripts" className="text-white text-decoration-none">
                Scripts
              </Link>
            </h3>
            <ul>
              <li>Script 1</li>
              <li>Script 2</li>
              <li>Script ...</li>
            </ul>
          </Card>
          {store.apiKey && (
            <Card
              className="bg-dark text-light mb-3 me-3"
              style={{ maxWidth: "20rem" }}
              body
            >
              <h3>
                <Link to="/tools" className="text-white text-decoration-none">
                  Tools
                </Link>
              </h3>
              <ul>
                <li>
                  <Link
                    to="/faction/warreport"
                    className="text-white text-decoration-none"
                  >
                    Faction War Reports
                  </Link>
                </li>
              </ul>
            </Card>
          )}
        </Row>
      </Container>
    </div>
  );
}
