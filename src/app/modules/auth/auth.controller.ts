import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import { AuthServices } from "./auth.service";

const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const loginInfo = await AuthServices.credentialLogin(req.body);

	// res.cookie("accessToken", loginInfo.accessToken, {
	//     httpOnly: true,
	//     secure: false
	// })

	// res.cookie("refreshToken", loginInfo.refreshToken, {
	//     httpOnly: true,
	//     secure: false,
	// })

	setAuthCookie(res, loginInfo);

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
		throw new AppError(httpStatus.BAD_REQUEST, "No refresh token recieved from cookies");
	}
	const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string);

	// res.cookie("accessToken", tokenInfo.accessToken, {
	//     httpOnly: true,
	//     secure: false
	// })

	setAuthCookie(res, tokenInfo);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "New Access Token Retrived Successfully",
		data: tokenInfo,
	});
});

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	res.clearCookie("accessToken", {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
	});
	res.clearCookie("refreshToken", {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
	});

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "User Logged Out Successfully",
		data: null,
	});
});

const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const { oldPassword, newPassword } = req.body;
	const decodedToken = req.user;

	await AuthServices.changePassword(oldPassword, newPassword, decodedToken);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Password changed successfully",
		data: null,
	});
});

export const AuthController = {
	credentialLogin,
	getNewAccessToken,
	logout,
	changePassword,
};
