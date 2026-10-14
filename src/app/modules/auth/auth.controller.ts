/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import type { JwtPayload } from "jsonwebtoken";
import passport from "passport";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authCookieOptions, setAuthCookie } from "../../utils/setCookie";
import { createUserTokens } from "../../utils/userTokens";
import { AuthServices } from "./auth.service";

const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	passport.authenticate("local", async (err: any, user: any, info: any) => {
		if (err) {
			if (typeof err === "string") {
				return next(new AppError(httpStatus.UNAUTHORIZED, err));
			}
			return next(err);
		}

		if (!user) {
			return next(new AppError(httpStatus.UNAUTHORIZED, info?.message ?? "Login failed"));
		}

		const userTokens = createUserTokens(user);

		const { ...rest } = user.toObject();

		setAuthCookie(res, userTokens);

		sendResponse(res, {
			success: true,
			statusCode: httpStatus.OK,
			message: "User Logged In Successfully",
			data: {
				accessToken: userTokens.accessToken,
				refreshToken: userTokens.refreshToken,
				user: rest,
			},
		});
	})(req, res, next);
});

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const refreshToken = req.cookies.refreshToken;
	if (!refreshToken) {
		throw new AppError(httpStatus.BAD_REQUEST, "No refresh token recieved from cookies");
	}
	const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string);

	setAuthCookie(res, tokenInfo);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "New Access Token Retrived Successfully",
		data: tokenInfo,
	});
});

const logout = catchAsync(async (req: Request, res: Response) => {
	res.clearCookie("accessToken", authCookieOptions);
	res.clearCookie("refreshToken", authCookieOptions);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "User logged out successfully",
		data: null,
	});
});

const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const { oldPassword, newPassword } = req.body;
	const decodedToken = req.user;

	await AuthServices.changePassword(oldPassword, newPassword, decodedToken as JwtPayload);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Password changed successfully",
		data: null,
	});
});

const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	let redirectTo = req.query.state ? (req.query.state as string) : "";

	if (redirectTo.startsWith("/")) {
		redirectTo = redirectTo.slice(1);
	}

	const user = req.user;

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
	}

	const tokenInfo = createUserTokens(user);

	setAuthCookie(res, tokenInfo);

	res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
});

const setPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const decodedToken = req.user as JwtPayload;
	const { password } = req.body;

	await AuthServices.setPassword(decodedToken.userId, password);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Password Changed Successfully",
		data: null,
	});
});

const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const { email } = req.body;

	await AuthServices.forgotPassword(email);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Email Sent Successfully",
		data: null,
	});
});

const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const decodedToken = req.user;

	await AuthServices.resetPassword(req.body, decodedToken as JwtPayload);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Password Changed Successfully",
		data: null,
	});
});

export const AuthController = {
	credentialLogin,
	getNewAccessToken,
	logout,
	changePassword,
	googleCallbackController,
	setPassword,
	forgotPassword,
	resetPassword,
};
