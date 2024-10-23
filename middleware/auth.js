import User from "../schemas/userSchema.js";
import jwt from "jsonwebtoken";

const authware = (req, res, next) => {
  const token = req.cookies.x_auth; // 쿠키에서 토큰을 가져옴

  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.status(401).json({ isAuth: false, error: true });

    req.token = token;
    req.user = user;
    next(); // 다음 미들웨어로 넘김
  });
};

export { authware };