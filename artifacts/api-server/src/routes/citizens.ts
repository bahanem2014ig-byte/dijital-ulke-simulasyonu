import { Router, type IRouter } from "express";
import { CITIZENS, ERAS, NATION_STATS } from "../data/citizens.js";

const router: IRouter = Router();

router.get("/citizens", (req, res) => {
  const { era, civilization, search } = req.query as Record<string, string>;

  let results = [...CITIZENS];

  if (era) {
    results = results.filter((c) => c.eraSlug === era);
  }

  if (civilization) {
    results = results.filter((c) =>
      c.civilization.toLowerCase().includes(civilization.toLowerCase())
    );
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.archetype.toLowerCase().includes(q) ||
        c.civilization.toLowerCase().includes(q)
    );
  }

  const responseData = results.map(({ systemPrompt: _sp, ...rest }) => rest);
  res.json(responseData);
});

router.get("/citizens/:id", (req, res) => {
  const citizen = CITIZENS.find((c) => c.id === req.params.id);
  if (!citizen) {
    res.status(404).json({ error: "Vatandaş bulunamadı" });
    return;
  }
  const { systemPrompt: _sp, ...rest } = citizen;
  res.json(rest);
});

router.get("/eras", (_req, res) => {
  res.json(ERAS);
});

router.get("/nation-stats", (_req, res) => {
  res.json(NATION_STATS);
});

export default router;
