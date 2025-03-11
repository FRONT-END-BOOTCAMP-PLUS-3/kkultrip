"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Header.module.scss";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import useUserStore from "@/store/useUserStore";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const clearInfo = useUserStore((state) => state.clearInfo);
  const userLat = useUserStore((state) => state.userLat);
  const userLon = useUserStore((state) => state.userLon);

  // 외부 클릭 감지하여 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // 헤더 타입 결정
  let type: "logo" | "back" | "mypage" | "backHome" | null = "logo";
  if (pathname === "/spots") {
    type = "logo"; // 로고헤더
  } else if (pathname.startsWith("/user")) {
    type = "mypage"; // 마이페이지 헤더
  } else if (pathname === "/") {
    type = null;
  } else if (pathname.includes("/create") || pathname.includes("/edit")) {
    type = "back"; // 그냥 뒤로가기 버튼
  } else if (
    pathname.includes("/info") ||
    pathname.includes("/docents") ||
    pathname.includes("/tips") ||
    pathname.includes("/images") ||
    pathname === "/login"
  ) {
    type = "backHome"; // 맵으로 뒤로가기 버튼
  } else {
    type = "back";
  }

  if (type === null) {
    return null;
  }

  const handleLogout = async () => {
    const confirmLogout = confirm("로그아웃하시겠습니까?");
    if (!confirmLogout) {
      return;
    }

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to logout");
      }

      clearInfo();
      document.cookie =
        "prevUrl=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setMenuOpen(false);
      router.push(`/spots?lat=${userLat}&lon=${userLon}`);
    } catch (error) {
      console.log("로그아웃 에러:", error);
    }
  };

  const handleWithdraw = async () => {
    const confirmWithdraw = confirm("회원탈퇴하시겠습니까?");
    if (!confirmWithdraw) {
      return;
    }

    try {
      const response = await fetch("/api/withdraw", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("회원 탈퇴 실패");
      }

      clearInfo();
      document.cookie =
        "prevUrl=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setMenuOpen(false);
      router.push(`/spots?lat=${userLat}&lon=${userLon}`);
    } catch (error) {
      console.log("회원탈퇴 에러:", error);
    }
  };

  return (
    <header className={styles.headerContainer}>
      {(type === "logo" || type === "mypage") && (
        <div className={styles.wrapper}>
          <div
            className={styles.logo}
            onClick={() => router.push(`/spots?lat=${userLat}&lon=${userLon}`)}
          >
            <Image
              width="100"
              height="54"
              src="/images/logo.svg"
              alt="KKULTRIP 로고"
              priority
            />
          </div>
          {type === "logo" ? (
            <div
              className={styles.menu}
              onClick={() =>
                router.push(isLoggedIn ? "/user/my-tips" : "/login")
              }
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
      {(type === "back" || type === "backHome") && (
        <div className={styles.wrapper}>
          {type === "back" ? (
            <div className={styles.back} onClick={() => router.back()}>
              <FaArrowLeft />
            </div>
          ) : (
            <div
              className={styles.back}
              onClick={() =>
                router.push(`/spots?lat=${userLat}&lon=${userLon}`)
              }
            >
              <FaArrowLeft />
            </div>
          )}

          <div
            className={styles.menu}
            onClick={() => router.push(isLoggedIn ? "/user/my-tips" : "/login")}
          >
            {isLoggedIn ? "마이페이지" : "로그인"}
          </div>
        </div>
      )}

      {/* 햄버거 메뉴 열렸을 때 */}
      {menuOpen && (
        <div className={styles.dropdown} ref={menuRef}>
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
