import type { User } from "@prisma/client"; // your Prisma User model

declare global {
  namespace Express {
    interface Request {
      user?: Pick<User, "id" | "email" | "username">;
    }
  }
}
