import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
export default function ScriptsPage() {
  return (
    <div className="p-4">
      <Container>
        <h2>Scripts</h2>
        <p>
          Nullam quis risus eget <a href="#">urna mollis ornare</a> vel eu leo.
          Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
          ridiculus mus. Nullam id dolor id nibh ultricies vehicula.
        </p>
        <p>
          <small>This line of text is meant to be treated as fine print.</small>
        </p>
        <p>
          The following is <strong>rendered as bold text</strong>.
        </p>
        <p>
          The following is <em>rendered as italicized text</em>.
        </p>
        <p>
          An abbreviation of the word attribute is{" "}
          <abbr title="attribute">attr</abbr>.
        </p>
        <Card className="bg-light">
          <Card.Header>
            <h2>Ranked War Reports</h2>
          </Card.Header>
          <Card.Body>
            <p>
              You can use this tool to generate war reports, you just need to
              enter the total sale value of rewards, faction cut and then it
              will generateyou a report.
            </p>

            <p>
              In the future I will be adding{" "}
              <strong>JSON Exports for all stored data</strong>.
            </p>
            <p></p>
            <Card.Link as={Link} to="/faction/warreport">
              Go To
            </Card.Link>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
