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

    const today = new Intl.DateTimeFormat("ko-KR", { weekday: "short" }).format(
        new Date()
    );

    // 요일 순서 배열
    const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

    // 오늘 요일을 기준으로 정렬
    const sortedTimes = [...times].sort((a, b) => {
        const todayIndex = weekDays.indexOf(today);
        const aIndex = weekDays.indexOf(a.day);
        const bIndex = weekDays.indexOf(b.day);

        // 오늘 요일을 맨 앞으로
        if (a.day === today) return -1;
        if (b.day === today) return 1;

        // 나머지 요일은 순서대로 정렬
        return (
            ((aIndex - todayIndex + 7) % 7) - ((bIndex - todayIndex + 7) % 7)
        );
    });

    return (
        <>
            <span className={styles.srOnly}>{name} 영업시간</span>
            <section className={styles.timeListContainer}>
                <FaRegClock
                    color="var(--grey-2-color)"
                    className={styles.icon}
                />

                <ul className={styles.timeListWrapper}>
                    {sortedTimes
                        .slice(0, showAllTimes ? sortedTimes.length : 1)
                        .map((time) => (
                            <li key={time.day}>
                                <span
                                    className={
                                        time.day === today ? styles.bold : ""
                                    }
                                >
                                    {time.day}요일
                                </span>
                                <div className={styles.line}></div>
                                <span
                                    className={
                                        time.closeDay
                                            ? styles.red
                                            : time.day === today
                                            ? styles.bold
                                            : ""
                                    }
                                >
                                    {time.closeDay
                                        ? "휴무"
                                        : time.allHours
                                        ? "24시간"
                                        : `${time.open} ~ ${time.close}`}
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
            </section>
        </>
    );
};

export default TimeList;
