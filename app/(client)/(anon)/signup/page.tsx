"use client";

import Button from "@/components/button/Button";
import Link from "next/link";
import useCheckNickname from "./hooks/useCheckNickname";
import useForm from "./hooks/useForm";
import useSubmitSignup from "./hooks/useSubmitSignup";
import styles from "./SignupPage.module.scss";

const SignupForm = () => {
  const {
    email: { email, emailError, handleChangeEmail },
    nickname: { nickname, handleChangeNickname },
    password: { password, passwordError, handleChangePassword },
    passwordCheck: {
      passwordCheck,
      passwordCheckError,
      handleChangePasswordCheck,
    },
    isFormValid,
  } = useForm();

  const {
    isNicknameAvailable,
    nicknameCheckError,
    nicknameCheckSuccess,
    handleCheckNickname,
    resetNicknameCheckState,
  } = useCheckNickname();

  const { submitSignup, isLoading, submitError } = useSubmitSignup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNicknameAvailable || !isFormValid) return;
    await submitSignup(email, nickname, password);
  };

  const handleCheckNicknameClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    handleCheckNickname(nickname);
  };

  const handleChangeNicknameWithReset = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleChangeNickname(e);
    resetNicknameCheckState();
  };

  return (
    <div className={styles.signupContainer}>
      <section className={styles.signupWrapper}>
        <h1>회원가입</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputBox}>
            <label>이메일</label>
            <input
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={handleChangeEmail}
              required
            />
            {emailError && <p className={styles.error}>{emailError}</p>}
          </div>

          <div className={styles.duplicateTest}>
            <div className={styles.inputBox}>
              <label>닉네임</label>
              <input
                type="text"
                placeholder="닉네임을 입력하세요"
                value={nickname}
                onChange={handleChangeNicknameWithReset}
                required
              />
              {nicknameCheckError && (
                <p className={styles.error}>{nicknameCheckError}</p>
              )}
              {nicknameCheckSuccess && (
                <p className={styles.success}>사용 가능한 닉네임입니다.</p>
              )}
            </div>

            <Button
              type="button"
              isLong={false}
              color="main"
              onClick={handleCheckNicknameClick}
            >
              중복확인
            </Button>
          </div>

          <div className={styles.inputBox}>
            <label>비밀번호</label>
            <input
              type="password"
              placeholder="소문자+숫자 (8자 이상)"
              value={password}
              onChange={handleChangePassword}
              required
            />
            {passwordError && <p className={styles.error}>{passwordError}</p>}
          </div>

          <div className={styles.inputBox}>
            <label>비밀번호 확인</label>
            <input
              type="password"
              placeholder="비밀번호를 한 번 더 입력하세요"
              value={passwordCheck}
              onChange={handleChangePasswordCheck}
              required
            />
            {passwordCheckError && (
              <p className={styles.error}>{passwordCheckError}</p>
            )}
          </div>

          {submitError && <p className={styles.error}>{submitError}</p>}

          <div className={styles.buttonBox}>
            <Button type="submit" isLong={true} color="main">
              {isLoading ? "가입 중..." : "가입하기"}
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

export default SignupForm;
