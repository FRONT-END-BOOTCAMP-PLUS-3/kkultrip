"use client";

import styles from "./copyButton.module.scss";
import { useState } from "react";

const CopyButton = ({ text }: { text: string }) => {
    const [showMessage, setShowMessage] = useState(false);

    const handleCopyPhone = () => {
        if (navigator.clipboard) {
            navigator.clipboard
                .writeText(text)
                .then(() => {
                    setShowMessage(true);
                    setTimeout(() => setShowMessage(false), 1000);
                })
                .catch((err) => {
                    console.error("복사 실패: ", err);
                });
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand("copy");
                setShowMessage(true);
                setTimeout(() => setShowMessage(false), 1000);
            } catch (err) {
                console.error("복사 실패: ", err);
            }
            document.body.removeChild(textArea);
        }
    };

    return (
        <div className={styles.copyButtonContainer}>
            <button className={styles.copyButton} onClick={handleCopyPhone}>
                복사
            </button>
            {showMessage && (
                <div className={styles.copyMessage}>복사되었습니다!</div>
            )}
        </div>
    );
};

export default CopyButton;
