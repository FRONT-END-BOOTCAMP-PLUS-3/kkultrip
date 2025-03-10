"use client";

import { FaPlus } from "react-icons/fa";
import styles from "./CreateTip.module.scss";
import useUserStore from "@/store/useUserStore";
import { useRouter } from "next/navigation";

const CreateTip = ({ spotId }: { spotId: string }) => {
    const router = useRouter();
    const isLoggedIn = useUserStore((state) => state.isLoggedIn);

    const handleClick = () => {
        if (isLoggedIn) {
            window.location.href = `/spots/${spotId}/tips/create`;
        } else {
            router.push("/login");
        }
    };

    return (
        <button className={styles.createButton} onClick={handleClick}>
            <FaPlus size={20} color="white" />
        </button>
    );
};

export default CreateTip;
