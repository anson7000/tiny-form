import { Submission as PrismaSubmission } from "@/prisma/generated/client";

export type Submission = Omit<PrismaSubmission, "data"> & {
  data: Record<string, string>;
};
