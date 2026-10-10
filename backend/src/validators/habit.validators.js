const { z } = require("zod");
const { isValidDateString } = require("../utils/date");

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid habit ID");

const createHabitSchema = z.object({
  h_name: z
    .string({ required_error: "A valid habit name is required", invalid_type_error: "A valid habit name is required" })
    .trim()
    .min(1, "A valid habit name is required")
    .max(40, "Habit name must be 40 characters or fewer"),
});

const habitIdParams = z.object({ id: objectId });

const yearParams = z.object({
  habitId: objectId,
  year: z
    .string()
    .regex(/^\d{4}$/, "Year must use YYYY format")
    .refine((y) => Number(y) >= 1000 && Number(y) <= 9998, "Year is outside the supported range"),
});

const setEntryParams = z.object({
  habitId: objectId,
  date: z.string().refine(isValidDateString, "Date must be a valid date in YYYY-MM-DD format"),
});

const setEntryBody = z.object({
  status: z
    .number({ required_error: "Status must be 0, 1, or 2", invalid_type_error: "Status must be 0, 1, or 2" })
    .refine((s) => [0, 1, 2].includes(s), "Status must be 0, 1, or 2"),
});

module.exports = { createHabitSchema, habitIdParams, yearParams, setEntryParams, setEntryBody };
