import { useEffect, useState } from "react";
import { api } from "../api";
import type { Visit } from "../types";

export function VisitsList() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [editing, setEditing] = useState<number | null>(null);

  useEffect(() => {
    api.get<Visit[]>("/visits").then((res) => setVisits(res.data));
  }, []);

  const deleteVisit = async (id: number) => {
    if (!confirm("Supprimer cette visite ?")) return;
    await api.delete(`/visits/${id}`);
    setVisits((v) => v.filter((x) => x.id !== id));
  };

  const saveVisit = async (id: number, newDate: string) => {
    const res = await api.put<Visit>(`/visits/${id}`, { visitedAt: newDate });
    setVisits((v) => v.map((x) => (x.id === id ? res.data : x)));
    setEditing(null);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>IP</th>
          <th>Browser</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {visits.map((v) => (
          <tr key={v.id}>
            <td>{v.id}</td>
            <td>{v.ip}</td>
            <td>{v.browser_id}</td>
            <td>
              {editing === v.id ? (
                <input
                  type="datetime-local"
                  defaultValue={new Date(v.visited_at)
                    .toISOString()
                    .slice(0, 16)}
                  onBlur={(e) =>
                    saveVisit(
                      v.id,
                      new Date(e.currentTarget.value).toISOString()
                    )
                  }
                />
              ) : (
                new Date(v.visited_at).toLocaleString()
              )}
            </td>
            <td>
              {editing === v.id ? (
                <button onClick={() => setEditing(null)}>Annuler</button>
              ) : (
                <button onClick={() => setEditing(v.id)}>Modifier</button>
              )}
              <button onClick={() => deleteVisit(v.id)}>Supprimer</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
