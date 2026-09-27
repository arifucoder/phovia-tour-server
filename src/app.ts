import type { NextFunction, Request, Response } from "express";
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	res.status(500).json({
		success: false,
		message: err.message || "Something went wrong!",
		err,
	});
});
export default app;
