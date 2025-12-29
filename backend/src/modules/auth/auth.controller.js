import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { InvalidCredentialsError } from "./auth.errors.js";
import { loginUser, logoutUser, refreshSession, registerUser } from "./auth.service.js";

export const register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    const user = await registerUser({ email, username, password });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};


export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const {accessToken, refreshToken } = await loginUser({email, password});

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success:true,
      accessToken
    });

  } catch (err) {
    next(err);
  }
}

export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if(!token){
      throw new InvalidCredentialsError();
    }

    const { accessToken, refreshToken } = await refreshSession(token);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      accessToken
    })
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res,next) => {
  try {
    const token = req.cookies?.refreshToken;
    if(!token){
      return res.sendStatus(204);
    }

    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET);
    await logoutUser(payload.sub);

    res.clearCookie("refreshToken");
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}