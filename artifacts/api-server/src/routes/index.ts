import { Router, type IRouter } from "express";
import healthRouter from "./health";
import citizensRouter from "./citizens";
import openaiRouter from "./openai";
import postsRouter from "./posts";
import topicsRouter from "./topics";

const router: IRouter = Router();

router.use(healthRouter);
router.use(citizensRouter);
router.use("/openai", openaiRouter);
router.use("/posts", postsRouter);
router.use("/topics", topicsRouter);

export default router;
