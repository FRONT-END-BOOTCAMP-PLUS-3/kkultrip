"use client";

import { GetMyTipDto } from "@/application/usecases/user/dto/GetMyTipDto";
import Loading from "@/components/loading/Loading";
import { useEffect, useState } from "react";
import TipBox from "../components/TipBox";
import styles from "./MyTipsPage.module.scss";

const MyTips = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userMyTipList, setUserMyTipList] = useState<GetMyTipDto[]>([]);

  useEffect(() => {
    const fetchMyTips = async () => {
      try {
        const response = await fetch("/api/user/my-tips");
        const data = await response.json();

        setUserMyTipList(data.userMyTipList);
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching my tips:", error);
      }
    };

    fetchMyTips();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.myTipsContainer}>
      {userMyTipList.length === 0 ? (
        <p className={styles.noTipText}>작성한 꿀팁이 없습니다.</p>
      ) : (
        userMyTipList.map((tip) => <TipBox key={tip.id} tip={tip} />)
      )}
    </div>
  );
};

export default MyTips;
