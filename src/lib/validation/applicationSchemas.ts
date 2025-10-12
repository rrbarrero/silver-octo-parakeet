import { z } from "zod";

import { APPLICATION_STATUSES } from "@/domain/applications";

export const ApplicationStatusEnum = z.enum([...APPLICATION_STATUSES]);

export const applicationCommentSchema = z.object({
  id: z.string(),
  message: z.string(),
  createdAt: z
    .string()
    .datetime()
    .transform((value) => new Date(value)),
});

export const applicationSchema = z.object({
  id: z.string(),
  companyName: z.string(),
  roleTitle: z.string(),
  roleDescription: z.string().nullish().transform((value) => value ?? undefined),
  url: z.string().nullish().transform((value) => value ?? undefined),
  appliedAt: z
    .string()
    .datetime()
    .transform((value) => new Date(value)),
  status: ApplicationStatusEnum,
  comments: z.array(applicationCommentSchema),
});

export type ApplicationDTO = z.infer<typeof applicationSchema>;

export const createApplicationInputSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  roleTitle: z.string().min(1, "Role title is required"),
  roleDescription: z
    .string()
    .max(500, "Role description should be shorter than 500 characters")
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : undefined)),
  url: z
    .string()
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : undefined))
    .pipe(
      z
        .string()
        .url("URL must be valid")
        .optional(),
    ),
  appliedAt: z
    .string()
    .min(1, "Applied date is required")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Applied date must be valid",
    }),
  status: ApplicationStatusEnum,
  initialComment: z
    .string()
    .max(500, "Comment should be shorter than 500 characters")
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : undefined)),
});

export type CreateApplicationInput = z.infer<typeof createApplicationInputSchema>;

export const updateApplicationStatusSchema = z.object({
  status: ApplicationStatusEnum,
});

export type UpdateApplicationStatusInput = z.infer<
  typeof updateApplicationStatusSchema
>;

export const addApplicationCommentSchema = z.object({
  comment: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment should be shorter than 500 characters"),
});

export type AddApplicationCommentInput = z.infer<
  typeof addApplicationCommentSchema
>;
