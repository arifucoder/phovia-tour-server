import { type Request, type Response } from "express";
import httpStatus from "http-status-codes";

const notFound = (req: Request, res: Response) => {
	res.status(httpStatus.NOT_FOUND).json({
		success: false,
		message: "Route Not Found", // message ta shundor dio
	});
};

export default notFound;
