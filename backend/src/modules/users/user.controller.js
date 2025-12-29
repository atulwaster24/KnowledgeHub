import {
  getMyProfile,
  getPublicProfile,
  updateMyProfile,
} from "./user.service.js";

export const me = async (req, res, next) => {
  try {
    const user = await getMyProfile(req.user.id);
    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { bio } = req.body;
    const user = await updateMyProfile(req.user.id, bio);
    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export const publicProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await getPublicProfile(username);
    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};