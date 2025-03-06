import jwt from "jsonwebtoken";

export const createJWT = (id: string, isAdmin: boolean) => {
  const SECRET_KEY = process.env.JWT_SECRET_KEY!;

  const payload = { id, isAdmin };
  const options = { expiresIn: 12 * 60 * 60 }; // 12시간 동안 유효
  const token = jwt.sign(payload, SECRET_KEY, options);
  return token;
};

export const GetUserIdByJWT = (token: string) => {
  const SECRET_KEY = process.env.JWT_SECRET_KEY!;

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as {
      id: string;
      isAdmin: boolean;
    };
    const userId = decoded.id;
    const isAdmin = decoded.isAdmin;
    return { userId, isAdmin };
  } catch {
    return null; // 유효하지 않거나 만료된 토큰
  }
};
