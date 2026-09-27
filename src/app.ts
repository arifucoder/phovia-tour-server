import type { Request, Response } from "express";
import express from "express";
const app = express();

app.get("/", (req: Request, res: Response) => {
	res.status(201).json({
		message: "Phovia!",
		do: "do something crazy",
	});
});

export default app;
