"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./IndexPage.module.scss";

const IndexPage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/spots");
    }, 2000);

    return () => clearTimeout(timer);
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
