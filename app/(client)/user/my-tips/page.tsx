"use client";

import { useEffect, useState } from "react";
import TipBox from "../components/TipBox";
import Styles from "./MyTips.module.scss";
import { UserTipDto } from "@/application/usecases/user/dto/UserTipDto";

const MyTips = () => {
  const [userMyTipList, setUserMyTipList] = useState<UserTipDto[]>([]);

  useEffect(() => {
    const fetchMyTips = async () => {
      try {
        const response = await fetch("/api/user/my-tips");
        const data = await response.json();

        setUserMyTipList(data.userMyTipList);
      } catch (error) {
        console.error("Error fetching my tips:", error);
      }
    };

    fetchMyTips();
  }, []);

  return (
    <div className={Styles.myTipsContainer}>
      {userMyTipList.length === 0 ? (
        <p className={Styles.noTipText}>작성한 꿀팁이 없습니다.</p>
      ) : (
        userMyTipList.map((tip) => <TipBox key={tip.id} tip={tip} />)
      )}
    </div>
  );
};

export default MyTips;
