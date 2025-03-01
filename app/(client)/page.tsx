"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./IndexPage.module.scss";

const DEFAULT_LAT = 37.5665; // 서울 기본 위도
const DEFAULT_LON = 126.978; // 서울 기본 경도

const IndexPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("❌ 위치 권한이 없음, 기본 위치로 이동");
      router.replace(`/spots?lat=${DEFAULT_LAT}&lon=${DEFAULT_LON}`);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        router.replace(`/spots?lat=${userLat}&lon=${userLon}`);
      },
      (error) => {
        console.log("위치 정보를 가져올 수 없음, 기본 위치로 이동:", error);
        router.replace(`/spots?lat=${DEFAULT_LAT}&lon=${DEFAULT_LON}`);
      }
    );
  }, [router]);

  return (
    <div className={styles.indexContainer}>
      <Image
        width="234"
        height="127"
        src="/images/logo.svg"
        alt="KKULTRIP 로고"
      />
    </div>
  );
};

export default IndexPage;
