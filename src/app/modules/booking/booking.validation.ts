import { z } from "zod";
import { BOOKING_STATUS } from "./booking.interface";

export const createBookingZodSchema = z.object({
	tour: z.string({ error: "Tour id is required" }),
	guestCount: z
		.number({ error: "Guest count is required" })
		.int({ error: "Guest count must be a whole number" })
		.positive({ error: "Guest count must be at least 1" }),
});

export const updateBookingStatusZodSchema = z.object({
	status: z.enum(Object.values(BOOKING_STATUS) as [string]),
});

export type TCreateBookingPayload = z.infer<typeof createBookingZodSchema>;
