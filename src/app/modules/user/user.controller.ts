import type { Request, Response } from "express";
import status from "http-status";
import { User } from "./user.model";

const createUser = async (req: Request, res: Response) => {
	try {
		const { name, email } = req.body;

		const user = await User.create({
			name,
			email,
		});

		res.status(status.CREATED).json({
			message: "User Created Successfully",
			user,
		});
	} catch (err: any) {
		console.log(err);

		res.status(status.BAD_REQUEST).json({
			message: `Something Went Wrong!! ${err.message}`,
			err,
		});
	}
};

export const UserControllers = {
	createUser,
};
