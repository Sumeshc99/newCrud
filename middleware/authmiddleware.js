import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  const id = req.params.id;

  if (!token) {
    return res.status(400).json({ message: "login first" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decodedToken.userId;

    if (id !== decodedToken.userId) {
      return res.status(400).json({ message: "access denied" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
