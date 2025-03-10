"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./IndexPage.module.scss";
import { getMyLocation } from "@/utils/getMyLocation";
import useUserStore from "@/store/useUserStore";

const IndexPage = () => {
  const router = useRouter();
  const completionWord: string = "여행의 달콤함,꿀트립";
  const [loginStatus, setLoginStatus] = useState<string>("");
  const [count, setCount] = useState<number>(0);
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

  useEffect(() => {
    const typingInterval = setInterval(() => {
      setLoginStatus((prevStatusValue) => {
        if (count >= completionWord.length) {
          clearInterval(typingInterval);
          return prevStatusValue;
        }
        const result = prevStatusValue
          ? prevStatusValue + completionWord[count]
          : completionWord[0];
        setCount(count + 1);
        return result;
      });
    }, 100);
    return () => {
      clearInterval(typingInterval);
    };
  }, [count]);

  return (
    <div className={styles.indexContainer}>
      <div className={styles.logoContainer}>
        <Image
          width="234"
          height="127"
          src="/images/logo.svg"
          alt="KKULTRIP 로고"
          priority
        />
        <h1>{loginStatus}</h1>
      </div>
    </div>
  );
};

export default IndexPage;
