"use client";

import Link from "next/link";
import styles from "./TipButton.module.scss";

const TipButton = ({ tipId, spotId }: { tipId: number, spotId: number }) => {
    const handleDelete = async () => {
        const response = await fetch(`/api/tips/${tipId}`, {
            method: "DELETE",
        });
        if (response.ok) {
            alert("삭제되었습니다.");
            window.location.reload();
        } else {
            alert("삭제에 실패했습니다.");
        }
    };
    return (
        <div className={styles.buttonContainer}>
            <Link className={styles.editButton} href={`/spots/${spotId}/tips/${tipId}/edit`}>수정</Link>
            <button className={styles.deleteButton} onClick={handleDelete}>
                삭제
            </button>
        </div>
    );
};

export default TipButton;
