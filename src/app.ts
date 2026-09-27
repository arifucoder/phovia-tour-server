import type { Request, Response } from "express";
import express from "express";
import { router } from "./app/routes";
const app = express();
app.use(express.json());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
	res.status(200).json({
		message: "Welcome to Tour Management System Backend",
	});
});

export default app;
