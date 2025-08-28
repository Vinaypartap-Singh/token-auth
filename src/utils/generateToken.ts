import jwt from "jsonwebtoken";
import { prisma } from "../config/db.config";

export const AccessToken = process.env.JWT_ACCESS_TOKEN!;
export const RefreshToken = process.env.JWT_REFRESH_TOKEN!;

export const ACCESS_TOKEN_EXP_MS = 60 * 1000;
export const REFRESH_TOKEN_EXP_MS = 7 * 24 * 60 * 60 * 1000;

export async function generateAccessAndRefreshToken(userId: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User Not Found");
  }

  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
  };

  const refreshTokenPayload = {
    id: user.id,
  };

  const access_token = jwt.sign(payload, AccessToken, {
    expiresIn: ACCESS_TOKEN_EXP_MS / 1000,
  });

  const refresh_token = jwt.sign(refreshTokenPayload, RefreshToken, {
    expiresIn: REFRESH_TOKEN_EXP_MS / 1000,
  });

  return { refresh_token, access_token };
}
