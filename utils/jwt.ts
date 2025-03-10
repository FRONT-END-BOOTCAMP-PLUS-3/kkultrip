import { SignJWT, jwtVerify } from "jose";

export const createJWT = async (id: string, isAdmin: boolean) => {
  const SECRET_KEY = process.env.JWT_SECRET_KEY!;

  return await new SignJWT({ id, isAdmin })
    .setProtectedHeader({ alg: "HS256" }) // 해싱 알고리즘
    .setExpirationTime("12h")
    .sign(new TextEncoder().encode(SECRET_KEY));
};

export const GetUserInfoByJWT = async (token: string) => {
  const SECRET_KEY = process.env.JWT_SECRET_KEY!;

  try {
    // 토큰 디코딩 및 유효성 검사
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(SECRET_KEY),
      {
        algorithms: ["HS256"], // 🔥 생성할 때 사용한 알고리즘과 동일해야 함
      }
    );
    console.log("=== Token 유효성 검사 ===");
    console.log("Token:", payload);
    console.log("==========================");
    const userId = payload.id;
    const isAdmin = payload.isAdmin;
    return { userId, isAdmin };
  } catch (error) {
    console.log("Invalid token:", error);
    return null;
  }
};
