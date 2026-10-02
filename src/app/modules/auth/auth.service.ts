import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import type { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userTokens";
import { User } from "../user/user.model";

// const credentialLogin = async (payload: Partial<IUser>) => {
// 	const { email, password } = payload;

// 	const isUserExist = await User.findOne({ email });

// 	if (!isUserExist) {
// 		throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
// 	}

// 	const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string);

// 	if (!isPasswordMatched) {
// 		throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
// 	}
// 	// const jwtPayload = {
// 	//     userId: isUserExist._id,
// 	//     email: isUserExist.email,
// 	//     role: isUserExist.role
// 	// }
// 	// const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

// 	// const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)

// 	const userTokens = createUserTokens(isUserExist);

// 	// delete isUserExist.password;

// 	// eslint-disable-next-line @typescript-eslint/no-unused-vars
// 	const { password: pass, ...rest } = isUserExist.toObject();

// 	return {
// 		accessToken: userTokens.accessToken,
// 		refreshToken: userTokens.refreshToken,
// 		user: rest,
// 	};
// };

const getNewAccessToken = async (refreshToken: string) => {
	const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);

	return {
		accessToken: newAccessToken,
	};
};

const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
	const user = await User.findById(decodedToken.userId);

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found");
	}

	// ১. পুরোনো password মিলছে কিনা
	const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user.password as string);

	if (!isOldPasswordMatch) {
		throw new AppError(httpStatus.UNAUTHORIZED, "Old password does not match");
	}

	// ২. নতুন password hash করে save করা
	user.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));

	await user.save();
};

export const AuthServices = {
	// credentialLogin,
	getNewAccessToken,
	changePassword,
};
