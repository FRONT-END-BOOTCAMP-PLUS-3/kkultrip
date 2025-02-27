"use client";

import TipBox from "../components/TipBox";
import Styles from "./my-tips.module.scss";

const MyTips = () => {
  return (
    <div className={Styles.myTipsContainer}>
      <TipBox />
      <TipBox />
      <TipBox />
    </div>
  );
};

export default MyTips;
