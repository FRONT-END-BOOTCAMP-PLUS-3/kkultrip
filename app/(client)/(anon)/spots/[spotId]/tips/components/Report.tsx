import { useState } from "react";
import { PiSirenFill } from "react-icons/pi";
import styles from "./Report.module.scss";

const Report = ({ tipId, userId }: { tipId: number; userId: string }) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const accessUserId = "7379a017-90cb-40da-9635-eb7eff4d8e83";
    const handleReportClick = async () => {
        const confirm = window.confirm("신고하시겠습니까?");
        if (!confirm) return;

        if (userId === accessUserId) {
            setErrorMessage("자신의 팁은 신고할 수 없습니다.");
            setTimeout(() => {
                setErrorMessage(null);
            }, 1000);
            return;
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tips/${tipId}/report`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                }),
            }
        );

        if (response.ok) {
            setErrorMessage("신고가 완료되었습니다.");
            setTimeout(() => {
                setErrorMessage(null);
            }, 1000);
        } else {
            setErrorMessage("이미 신고한 팁입니다.");
            setTimeout(() => {
                setErrorMessage(null);
            }, 1000);
        }
    };
    return (
        <>
            <button className={styles.reportButton} onClick={handleReportClick}>
                <PiSirenFill color="var(--red-1-color)" size={16} />
            </button>
            {errorMessage && (
                <div className={styles.errorMessage}>{errorMessage}</div>
            )}
        </>
    );
};

export default Report;
