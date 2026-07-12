import Container from "react-bootstrap/Container";
import type { UserId } from "tornapi-typescript";
export default function UserHome({ uid }: { uid: UserId | null }) {
  return (
    <div className="p-4">
      <Container>
        <h1>User home</h1>
        <br />
        <p>User ID: {uid}</p>
      </Container>
    </div>
  );
}
