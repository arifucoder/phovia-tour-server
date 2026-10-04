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

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.params.id;
	// const token = req.headers.authorization
	// const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload

	const verifiedToken = req.user;

	const payload = req.body;
	const user = await UserServices.updateUser(userId as string, payload, verifiedToken);

	// res.status(httpStatus.CREATED).json({
	//     message: "User Created Successfully",
	//     user
	// })

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "User Updated Successfully",
		data: user,
	});
});

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const query = req.query;
	const result = await UserServices.getAllUsers(query as Record<string, string>);

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
	updateUser,
};
