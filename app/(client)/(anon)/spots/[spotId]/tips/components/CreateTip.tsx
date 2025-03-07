"use client";

import { FaPlus } from "react-icons/fa";
import styles from "./CreateTip.module.scss";

  const CreateTip = ({ spotId }: { spotId: string }) => {
    return (
        <button
            className={styles.createButton}
            onClick={() => {
                window.location.href = `/spots/${spotId}/tips/create`;
            }}
        >
            <FaPlus size={20} color="white" />
        </button>
    );
};

export default CreateTip;
