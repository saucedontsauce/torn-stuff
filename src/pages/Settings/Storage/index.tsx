import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
export default function StorageCard() {
  const [storageItems, setStorageItems] = useState<
    {
      key: string;
      size: number;
    }[]
  >([]);
  function refreshStorage() {
    const items: {
      key: string;
      size: number;
    }[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (!key) continue;

      const value = localStorage.getItem(key) ?? "";

      items.push({
        key,
        size: new Blob([value]).size,
      });
    }

    items.sort((a, b) => b.size - a.size);

    setStorageItems(items);
  }

  useEffect(() => {
    refreshStorage();

    window.addEventListener("storage", refreshStorage);

    return () => window.removeEventListener("storage", refreshStorage);
  }, []);
  const handleDeleteStorage = (key: string) => {
    localStorage.removeItem(key);
    refreshStorage();
  };
  const handleClearStorage = () => {
    if (!window.confirm("Delete ALL locally stored data?")) {
      return;
    }

    localStorage.clear();
    refreshStorage();

    window.dispatchEvent(new Event("storage"));
  };
  const totalStorage = storageItems.reduce((sum, item) => sum + item.size, 0);
  return (
    <Card className="bg-light text-dark">
      <Card.Header>
        <strong>Local Storage</strong>
      </Card.Header>

      <Card.Body>
        <p>
          <strong>Total:</strong> {(totalStorage / 1024).toFixed(2)} KB
        </p>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Key</th>
              <th>Size</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {storageItems.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center">
                  No stored data
                </td>
              </tr>
            )}

            {storageItems.map((item) => (
              <tr key={item.key}>
                <td>
                  <code>{item.key}</code>
                </td>

                <td>{(item.size / 1024).toFixed(2)} KB</td>

                <td>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleDeleteStorage(item.key)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="d-flex justify-content-end">
          <Button variant="danger" onClick={handleClearStorage}>
            Clear All Storage
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
