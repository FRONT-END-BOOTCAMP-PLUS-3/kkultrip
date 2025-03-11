"use client";

import { FaPlus } from "react-icons/fa";
import styles from "./CreateTip.module.scss";

const CreateTip = ({ spotId }: { spotId: string }) => {
  const handleClick = () => {
    window.location.href = `/spots/${spotId}/tips/create`;
  };

  return (
    <button className={styles.createButton} onClick={handleClick}>
      <FaPlus size={20} color="white" />
    </button>
  );
};

export default CreateTip;
