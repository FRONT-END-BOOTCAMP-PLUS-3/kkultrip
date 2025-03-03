"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./signup.module.scss";
import Button from "@/components/button/Button";

const SignUp = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    img: "/images/bee_50x58.png",
    nickname: "",
    email: "",
    password: "",
    password1: "",
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

    const { img, nickname, email, password, password1 } = formData;

    if (password !== password1) {
      setError("비밀번호가 일치하지 않습니다.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ img, nickname, email, password }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "회원가입 실패");
      }

      alert("회원가입 성공! 로그인 페이지로 이동합니다.");
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("회원가입 실패:", err.message);
        setError(err.message);
      } else {
        console.error("회원가입 실패:", err);
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <section className={styles.signupWrapper}>
        <h1>kkultrip 회원가입</h1>
        <form onSubmit={handleSubmit}>
          {/* 추후 프로필 이미지 추가 */}

          <div className={styles.inputBox}>
            <label>닉네임</label>
            <input
              type="text"
              name="nickname"
              placeholder="닉네임"
              value={formData.nickname}
              onChange={handleChange}
              required
            />
          </div>
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
          <div className={styles.inputBox}>
            <label>비밀번호 확인</label>
            <input
              type="password"
              name="password1"
              placeholder="비밀번호 확인"
              value={formData.password1}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.buttonBox}>
            <Button type="submit" isLong={true} color="main">
              {loading ? "가입 중..." : "가입하기"}
            </Button>
          </div>
          <div className={styles.linkBox}>
            <Link href="/login">로그인페이지로 이동</Link>
          </div>
        </form>
      </section>
    </div>
  );
};

export default SignUp;
