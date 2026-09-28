import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { type IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
	const { email, ...rest } = payload;

	const isUserExist = await User.find({ email });

	if (isUserExist) {
		throw new AppError(httpStatus.BAD_REQUEST, "User already exist");
	}

	const user = await User.create({
		email,
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
