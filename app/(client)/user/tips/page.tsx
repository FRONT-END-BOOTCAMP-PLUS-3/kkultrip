"use client";

import { UserTipDto } from "@/application/usecases/user/dto/GetMyTipDto";
import { useEffect, useState } from "react";
import TipBox from "../components/TipBox";
import styles from "./Tips.module.scss";

const Tips = () => {
  const [ReactTipList, setReactTipList] = useState<UserTipDto[]>([]);

  useEffect(() => {
    const fetchReactTips = async () => {
      try {
        const response = await fetch("/api/user/reacted-tips");
        const data = await response.json();

        setReactTipList(data.reactedTipList);
      } catch (error) {
        console.error("Error fetching reacted tips:", error);
      }
    };

    fetchReactTips();
  }, []);

  return (
    <div className={styles.TipsContainer}>
      {ReactTipList.length === 0 ? (
        <p className={styles.noTipText}>반응을 남긴 꿀팁이 없습니다.</p>
      ) : (
        ReactTipList.map((tip) => <TipBox key={tip.id} tip={tip} />)
      )}
    </div>
  );
};

export default Tips;
