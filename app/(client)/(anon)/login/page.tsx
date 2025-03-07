"use client";

import Button from "@/components/button/Button";
import Link from "next/link";
import styles from "./LoginPage.module.scss";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();

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

      alert("로그인 성공!");
      const responseData = await response.json();

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
          router.push("/");
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
        <h1>kkultrip 로그인</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputBox}>
            <label>이메일</label>
            <input
              type="email"
              name="email"
              placeholder="이메일"
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
              placeholder="비밀번호"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.buttonBox}>
            <Button type="submit" isLong={true} color="main">
              {loading ? "로그인 중..." : "로그인"}
            </Button>
          </div>
          <div className={styles.linkBox}>
            <Link href="/signup">회원가입페이지로 이동</Link>
          </div>
        </form>
      </section>
    </div>
  );
};

export default LoginPage;
