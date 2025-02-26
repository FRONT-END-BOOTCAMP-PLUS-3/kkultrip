"use client";

import { TimeDetailDto } from "@/application/usecases/spot/dto/TimeDetailDto";
import { useState } from "react";
import { FaRegClock } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import styles from "./timeList.module.scss";

const TimeList = ({
    times,
    name,
}: {
    times: TimeDetailDto[];
    name: string;
}) => {
    const [showAllTimes, setShowAllTimes] = useState(false);

    const handleToggleTimes = () => {
        setShowAllTimes((prevState) => !prevState);
    };

    return (
        <>
            <span className={styles.srOnly}>{name} 영업시간</span>
            <p className={styles.timeListContainer}>
                <FaRegClock
                    color="var(--grey-2-color)"
                    className={styles.icon}
                />

                <ul className={styles.timeListWrapper}>
                    {times
                        .slice(0, showAllTimes ? times.length : 1)
                        .map((time) => (
                            <li key={time.day}>
                                <span className={styles.label}>{time.day}</span>
                                <div className={styles.line}></div>
                                <span className={styles.bold}>
                                    {time.open} ~ {time.close}
                                </span>
                            </li>
                        ))}
                </ul>

                <button onClick={handleToggleTimes}>
                    {showAllTimes ? (
                        <IoIosArrowUp color="black" />
                    ) : (
                        <IoIosArrowDown color="black" />
                    )}
                </button>
            </p>
        </>
    );
};

export default TimeList;

// return (
//     <li>
//         <FaRegClock color="var(--grey-2-color)" size={18} />
//         <div className={styles.detailInfo}>
//             <span className={styles.label}>월요일</span>
//             <div className={styles.line}></div>
//             <span>오전 10시 ~ 오후 5시</span>
//         </div>
//         <button>
//             <IoIosArrowDown color="black" />
//         </button>
//     </li>
// );
