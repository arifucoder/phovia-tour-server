import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { type IAuthProvider, type IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
	const { email, password, ...rest } = payload;

	const isUserExist = await User.findOne({ email });

	if (isUserExist) {
		throw new AppError(httpStatus.BAD_REQUEST, "User already exist");
	}

	const hashedPassword = await bcrypt.hash(password as string, 10);

	const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string };

	const user = await User.create({
		email,
		auths: [authProvider],
		password: hashedPassword,
		...rest,
	});

	return user;
};

const getAllUsers = async () => {
	const users = await User.find({});
	const totalUsers = await User.countDocuments();
	return {
		data: users,
		meta: {
			total: totalUsers,
		},
	};
};
export const UserServices = {
	createUser,
	getAllUsers,
};
