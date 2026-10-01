import cookieParser from "cookie-parser";
import type { Request, Response } from "express";
import express from "express";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { router } from "./app/routes";

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
	res.status(200).json({
		message: "Welcome to Tour Management System Backend",
	});
});

app.use(globalErrorHandler);
app.use(notFound);
export default app;
