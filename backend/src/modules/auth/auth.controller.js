import { registerUser } from "./auth.service.js";

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
