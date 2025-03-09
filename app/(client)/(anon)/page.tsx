"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./IndexPage.module.scss";
import { getMyLocation } from "@/utils/getMyLocation";
import useUserStore from "@/store/useUserStore";

const IndexPage = () => {
  const router = useRouter();
  const userLat = useUserStore((state) => state.userLat);
  const userLon = useUserStore((state) => state.userLon);
  const { setUserLat, setUserLon } = useUserStore();

  useEffect(() => {
    getMyLocation()
      .then(({ lat, lon }) => {
        setUserLat(lat);
        setUserLon(lon);
        router.replace(`/spots?lat=${lat}&lon=${lon}`);
      })
      .catch(() => {
        router.replace(`/spots?lat=${userLat}&lon=${userLon}`);
      });
  }, [router, userLat, userLon, setUserLat, setUserLon]);

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
