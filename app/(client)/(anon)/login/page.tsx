"use client";

import Button from "@/components/button/Button";
import useUserStore from "@/store/useUserStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import styles from "./LoginPage.module.scss";

const LoginPage = () => {
  const router = useRouter();
  const { setImg, setNickname, setIsLoggedIn, setId } = useUserStore();
  const userLat = useUserStore((state) => state.userLat);
  const userLon = useUserStore((state) => state.userLon);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { email, password } = formData;

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "로그인 실패");
      }

      const responseData = await response.json();
      // 로그인 성공 시 zustand에 로그인 상태, img, 닉네임 저장
      setIsLoggedIn(true);
      setImg(responseData.img);
      setNickname(responseData.nickname);
      setId(responseData.userId);
      // 로그인을 했을 때 관리자면 관리자페이지로, 아니면 로그인 진입 전 페이지로 이동
      if (responseData.isAdmin) {
        router.push("/admin/spots");
      } else {
        const prevUrl = document.cookie
          .split("; ")
          .find((row) => row.startsWith("prevUrl="))
          ?.split("=")[1];

        if (prevUrl) {
          router.push(decodeURIComponent(prevUrl));
        } else {
          router.push(`/spots?lat=${userLat}&lon=${userLon}`);
        }
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <section className={styles.loginWrapper}>
        <div className={styles.logoBox}>
          <Image
            className={styles.logo}
            src="/images/logo.svg"
            alt="logo"
            width={200}
            height={200}
          />
        </div>
        <h1>로그인</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputBox}>
            <label>이메일</label>
            <input
              type="email"
              name="email"
              placeholder="이메일을 입력해주세요"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.inputBox}>
            <label>비밀번호</label>
            <input
              type="password"
              name="password"
              placeholder="비밀번호를 입력해주세요"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.buttonBox}>
            <Button type="submit" isLong={true} color="main">
              {loading ? <BeatLoader size={12} color="white" /> : "로그인"}
            </Button>
          </div>
          <div className={styles.linkBox}>
            계정이 없으신가요?
            <Link href="/signup">계정 생성</Link>
          </div>
        </form>
      </section>
    </div>
  );
};

export default LoginPage;
