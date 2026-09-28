import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const user = await UserServices.createUser(req.body);
	// res.status(httpStatus.CREATED).json({
	// 	message: "User Created Successfully",
	// 	user,
	// });

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "User Created Successfully",
		data: user,
	});
});

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const result = await UserServices.getAllUsers();
	// res.status(httpStatus.OK).json({
	// 	success: true,
	// 	message: "All Users Retrieved Successfully",
	// 	data: users,
	// });

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "All Users Retrieved Successfully",
		data: result.data,
		meta: result.meta,
	});
});

export const UserControllers = {
	createUser,
	getAllUsers,
};
