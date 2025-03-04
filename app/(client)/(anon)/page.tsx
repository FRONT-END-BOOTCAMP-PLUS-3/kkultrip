"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./IndexPage.module.scss";
import { getMyLocation } from "@/utils/getMyLocation"; // 위치 정보 유틸

const DEFAULT_LAT = 37.5665;
const DEFAULT_LON = 126.978;

const IndexPage = () => {
  const router = useRouter();

  useEffect(() => {
    getMyLocation()
      .then(({ lat, lon }) => {
        router.replace(`/spots?lat=${lat}&lon=${lon}`);
      })
      .catch(() => {
        router.replace(`/spots?lat=${DEFAULT_LAT}&lon=${DEFAULT_LON}`);
      });
  }, [router]);

  return (
    <div className={styles.indexContainer}>
      <Image
        width="234"
        height="127"
        src="/images/logo.svg"
        alt="KKULTRIP 로고"
        priority
      />
    </div>
  );
};

export default IndexPage;
