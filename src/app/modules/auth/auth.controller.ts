import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
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

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const refreshToken = req.cookies.refreshToken;
	if (!refreshToken) {
		throw new AppError(httpStatus.BAD_REQUEST, "No refresh token received from cookies");
	}
	const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string);

	// res.cookie("accessToken", tokenInfo.accessToken, {
	//     httpOnly: true,
	//     secure: false
	// })

	// setAuthCookie(res, tokenInfo);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "New Access Token Retrived Successfully",
		data: tokenInfo,
	});
});

export const AuthController = {
	credentialLogin,
	getNewAccessToken,
};
