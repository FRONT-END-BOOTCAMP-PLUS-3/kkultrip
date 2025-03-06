"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Header.module.scss";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";

type HeaderProps = {
  isLoggedIn: boolean;
};

const Header = ({ isLoggedIn }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // 헤더 타입 결정
  let type: "default" | "back" | "mypage" | null = "default";
  if (pathname === "/spots") {
    type = "default"; // 로고헤더
  } else if (pathname === "/user/my-tips") {
    type = "mypage"; // 마이페이지 헤더
  } else if (pathname === "/") {
    type = null;
  } else {
    type = "back"; // 기본 헤더
  }

  if (type === null) {
    return null;
  }

  const handleLogout = () => {
    setMenuOpen(false);
  };

  const handleWithdraw = () => {
    alert("탈퇴가 진행됩니다.");
    // 회원 탈퇴 로직 추가
    setMenuOpen(false);
    router.push("/");
  };

  return (
    <header className={styles.headerContainer}>
      {(type === "default" || type === "mypage") && (
        <div className={styles.wrapper}>
          <div className={styles.logo} onClick={() => router.push("/spots")}>
            <Image
              width="100"
              height="54"
              src="/images/logo.svg"
              alt="KKULTRIP 로고"
            />
          </div>
          {type === "default" ? (
            <div
              className={styles.menu}
              onClick={() => router.push("/user/my-tips")}
            >
              {isLoggedIn ? "마이페이지" : "로그인"}
            </div>
          ) : (
            <div
              className={styles.hamburger}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <IoMenu />
            </div>
          )}
        </div>
      )}

      {/* 뒤로가기 헤더 */}
      {type === "back" && (
        <div className={styles.wrapper}>
          <div className={styles.back} onClick={() => router.back()}>
            <FaArrowLeft />
          </div>
          <div
            className={styles.menu}
            onClick={() => router.push("/user/my-tips")}
          >
            {isLoggedIn ? "마이페이지" : "로그인"}
          </div>
        </div>
      )}

      {/* 햄버거 메뉴 열렸을 때 */}
      {menuOpen && (
        <div className={styles.dropdown}>
          <button onClick={handleLogout}>로그아웃</button>
          <button className={styles.danger} onClick={handleWithdraw}>
            탈퇴하기
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
