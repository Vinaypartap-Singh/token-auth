import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import z, { ZodError } from "zod";
import { prisma } from "../config/db.config";
import {
  ACCESS_TOKEN_EXP_MS,
  generateAccessAndRefreshToken,
  REFRESH_TOKEN_EXP_MS,
} from "../utils/generateToken";
import {
  LOGIN_VALIDATIONS,
  SIGNUP_VALIDATIONS,
} from "../validations/auth.validations";

export async function signup(req: Request, res: Response) {
  try {
    const body = req.body;
    const payload = SIGNUP_VALIDATIONS.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: {
        username: payload.username,
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists please login" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(payload.password, salt);

    const user = await prisma.user.create({
      data: {
        username: payload.username,
        email: payload.email,
        password: hashedPassword,
      },
      omit: {
        password: true,
      },
    });

    return res.status(201).json({ message: "User Account Created", user });
  } catch (error) {
    if (error instanceof ZodError) {
      const flattenError = z.flattenError(error);
      return res
        .status(400)
        .json({ message: "Please provide correct data", error: flattenError });
    }

    return res
      .status(400)
      .json({ message: "Error while creating account", error });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const body = req.body;
    const payload = LOGIN_VALIDATIONS.parse(body);

    const userExist = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (!userExist) {
      return res.status(400).json({ message: "User not found!" });
    }

    const correctPassword = await bcrypt.compare(
      payload.password,
      userExist.password
    );

    if (!correctPassword) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    const { access_token, refresh_token } = await generateAccessAndRefreshToken(
      userExist.id
    );

    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + ACCESS_TOKEN_EXP_MS), // correct Date object
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + REFRESH_TOKEN_EXP_MS),
    });

    await prisma.user.update({
      where: {
        id: userExist.id,
      },
      data: {
        refreshToken: refresh_token,
      },
    });

    return res
      .status(200)
      .json({ message: "User Login Success", access_token, refresh_token });
  } catch (error) {
    if (error instanceof ZodError) {
      const flattenError = z.flattenError(error);
      return res
        .status(400)
        .json({ message: "Please provide correct data", error: flattenError });
    }

    return res
      .status(400)
      .json({ message: "Error while login account", error });
  }
}

export async function getUserData(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return res.status(200).json({ message: "User Data", user });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error while login account", error });
  }
}
