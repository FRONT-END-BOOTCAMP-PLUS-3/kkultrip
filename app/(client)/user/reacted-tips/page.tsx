"use client";

import { GetReactedTipDto } from "@/application/usecases/user/dto/GetReactedTipDto";
import { useEffect, useState } from "react";
import TipBox from "../components/TipBox";
import styles from "./ReactedTipsPage.module.scss";

const Tips = () => {
  const [reactTipList, setReactTipList] = useState<GetReactedTipDto[]>([]);

  useEffect(() => {
    const fetchReactTips = async () => {
      try {
        const response = await fetch("/api/user/reacted-tips");
        const data = await response.json();

        setReactTipList(data.reactedTipList);
      } catch (error) {
        console.log("Error fetching reacted tips:", error);
      }
    };

    fetchReactTips();
  }, []);

  return (
    <div className={styles.TipsContainer}>
      {reactTipList.length === 0 ? (
        <p className={styles.noTipText}>반응을 남긴 꿀팁이 없습니다.</p>
      ) : (
        reactTipList.map((tip) => <TipBox key={tip.id} tip={tip} />)
      )}
    </div>
  );
};

export default Tips;
