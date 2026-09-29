import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const loginInfo = await AuthServices.credentialLogin(req.body);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "User Logged In Successfully",
		data: loginInfo,
	});
});

export const AuthController = {
	credentialLogin,
};
