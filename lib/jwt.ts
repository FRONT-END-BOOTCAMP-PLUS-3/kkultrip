import jwt from "jsonwebtoken";

export const createJWT = (id: string) => {
  const SECRET_KEY = process.env.JWT_SECRET_KEY!;

  const payload = { id };
  const options = { expiresIn: 12 * 60 * 60 }; // 12시간 동안 유효
  const token = jwt.sign(payload, SECRET_KEY, options);
  return token;
};

export const GetUserIdByJWT = (token: string) => {
  const SECRET_KEY = process.env.JWT_SECRET_KEY!;

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
    const userId = decoded.id;
    return userId;
  } catch {
    return null; // 유효하지 않거나 만료된 토큰
  }
};
