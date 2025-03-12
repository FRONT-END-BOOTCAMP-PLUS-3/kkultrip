"use client";

import useUserStore from "@/store/useUserStore";
import styles from "./TipButton.module.scss";

const TipButton = ({
    tipId,
    spotId,
    nickName,
}: {
    tipId: number;
    spotId: number;
    nickName: string;
}) => {
    const user = useUserStore();
    const handleDelete = async () => {
        const response = await fetch(`/api/tips/${tipId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ spotId }),
        });
        if (response.ok) {
            alert("삭제되었습니다.");
            window.location.reload();
        } else {
            alert("삭제에 실패했습니다.");
        }
    };
    if (user.nickname === nickName) {
        return (
            <div className={styles.buttonContainer}>
                <a
                    className={styles.editButton}
                    href={`/spots/${spotId}/tips/${tipId}/edit`}
                >
                    수정
                </a>
                <button className={styles.deleteButton} onClick={handleDelete}>
                    삭제
                </button>
            </div>
        );
    }
};

export default TipButton;
