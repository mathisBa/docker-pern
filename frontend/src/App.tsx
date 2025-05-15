// src/App.tsx
import { useEffect } from "react";
import { api } from "./api";
import { VisitsList } from "./components/VisitList";

export default function App() {
  useEffect(() => {
    // On prend juste le userAgent comme "browserId"
    const browserId = navigator.userAgent;

    // On met une IP bidon (ou ta machine, si tu veux)
    const ip = "127.0.0.1";

    // Envoi simple de la visite
    api
      .post("/visits", {
        ip,
        browserId,
        visitedAt: new Date().toISOString(),
      })
      .catch((err) => {
        console.error("Erreur en créant la visite :", err);
      });
  }, []);

  return (
    <div className="App">
      <h1>Liste des visites</h1>
      <VisitsList />
    </div>
  );
}
