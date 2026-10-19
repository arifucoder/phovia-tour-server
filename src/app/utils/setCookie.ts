// src/app/utils/setCookie.ts
import type { CookieOptions, Response } from "express";
import { envVars } from "../config/env";

export interface AuthTokens {
	accessToken?: string;
	refreshToken?: string;
}

const isProduction = envVars.NODE_ENV === "production";

// set আর clear — দুই জায়গায় একই option লাগবে, তাই export
export const authCookieOptions: CookieOptions = {
	httpOnly: true,
	secure: true, // local (HTTP) → false, production (HTTPS) → true
	sameSite: isProduction ? "none" : "lax", // আলাদা domain-এ cookie পাঠাতে "none"
};

export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
	if (tokenInfo.accessToken) {
		res.cookie("accessToken", tokenInfo.accessToken, authCookieOptions);
	}

	if (tokenInfo.refreshToken) {
		res.cookie("refreshToken", tokenInfo.refreshToken, authCookieOptions);
	}
};
