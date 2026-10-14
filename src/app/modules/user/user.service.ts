import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import type { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constant";
import { Role, type IAuthProvider, type IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
	const { email, password, ...rest } = payload;

	const isUserExist = await User.findOne({ email });

	if (isUserExist) {
		throw new AppError(httpStatus.BAD_REQUEST, "User already exist");
	}

	const hashedPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));

	const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string };

	const user = await User.create({
		email,
		auths: [authProvider],
		password: hashedPassword,
		...rest,
	});

	return user;
};

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
	if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
		if (userId !== decodedToken.userId) {
			throw new AppError(401, "You are not authorized");
		}
	}

	const ifUserExist = await User.findById(userId);

	if (!ifUserExist) {
		throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
	}

	if (decodedToken.role === Role.ADMIN && ifUserExist.role === Role.SUPER_ADMIN) {
		throw new AppError(401, "You are not authorized");
	}

	if (payload.role) {
		if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
			throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
		}

		if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
			throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
		}
	}

	if (payload.isActive || payload.isDeleted || payload.isVerified) {
		if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
			throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
		}
	}

	const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });

	return newUpdatedUser;
};

const getAllUsers = async (query: Record<string, string>) => {
	const queryBuilder = new QueryBuilder(User.find(), query);

	const users = queryBuilder.search(userSearchableFields).filter().sort().fields().paginate();
	const [data, meta] = await Promise.all([users.build(), queryBuilder.getMeta()]);
	return {
		data,
		meta,
	};
};

const getMe = async (userId: string) => {
	const user = await User.findById(userId).select("-password");
	return {
		data: user,
	};
};

const getSingleUser = async (id: string) => {
	const user = await User.findById(id).select("-password");
	return {
		data: user,
	};
};

export const UserServices = {
	createUser,
	getAllUsers,
	updateUser,
	getMe,
	getSingleUser,
};
