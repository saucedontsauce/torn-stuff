import Container from "react-bootstrap/Container";
import type { CompanyId } from "tornapi-typescript";
export default function CompanyHome({ cid }: { cid: CompanyId | null }) {
  return (
    <div className="p-4">
      <Container>
        <h1>Company home</h1>
        <br />
        <p>Company ID: {cid}</p>
      </Container>
    </div>
  );
}
