"use client";

import { FaPlus } from "react-icons/fa";
import styles from "./CreateTip.module.scss";
import { useRouter } from "next/navigation";

const CreateTip = ({ spotId }: { spotId: string }) => {
    const router = useRouter();
    return (
        <button
            className={styles.createButton}
            onClick={() => {
                router.push(`/spots/${spotId}/tips/create`);
            }}
        >
            <FaPlus size={20} color="white" />
        </button>
    );
};

export default CreateTip;
