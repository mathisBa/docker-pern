import { Router, Request, Response, NextFunction } from "express";
import { pool } from "../db";

export interface Visit {
  id: number;
  ip: string;
  browser_id: string;
  visited_at: string;
}

const router = Router();

// --- Create
router.post("/", async (req, res) => {
  const { ip, browserId, visitedAt } = req.body;
  const result = await pool.query<Visit>(
    `INSERT INTO visits (ip, browser_id, visited_at)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [ip, browserId, visitedAt || new Date().toISOString()]
  );
  res.status(201).json(result.rows[0]);
});

// --- Read all
router.get("/", async (_req, res) => {
  const result = await pool.query<Visit>(
    `SELECT * FROM visits ORDER BY visited_at DESC`
  );
  res.json(result.rows);
});

// --- Read one by ID
router.get<{ id: string }>(
  "/:id",
  async (
    req,
    res: Response<Visit | { error: string }>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await pool.query<Visit>(
        `SELECT * FROM visits WHERE id = $1`,
        [id]
      );
      if (result.rowCount === 0) {
        res.status(404).json({ error: "Visite introuvable" });
        return;
      }
      res.json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

// --- Update (seule l'heure)
router.put<{ id: string }, Visit | { error: string }, { visitedAt: string }>(
  "/:id",
  async (
    req,
    res: Response<Visit | { error: string }>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { visitedAt } = req.body;
      const result = await pool.query<Visit>(
        `UPDATE visits
           SET visited_at = $1
           WHERE id = $2
           RETURNING *`,
        [visitedAt, id]
      );
      if (result.rowCount === 0) {
        res.status(404).json({ error: "Visite introuvable" });
        return;
      }
      res.json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

// --- Delete
router.delete<{ id: string }>(
  "/:id",
  async (
    req,
    res: Response<{ message: string }>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await pool.query<Visit>(
        `DELETE FROM visits
           WHERE id = $1
           RETURNING *`,
        [id]
      );
      if (result.rowCount === 0) {
        res.status(404).json({ message: "Visite introuvable" });
        return;
      }
      res.json({ message: "Visite supprimée" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
