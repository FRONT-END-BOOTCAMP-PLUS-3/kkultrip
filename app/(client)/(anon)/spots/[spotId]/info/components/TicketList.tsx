"use client";

import { useState } from "react";
import { FaWonSign } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { TicketDetailDto } from "@/application/usecases/spot/dto/TicketDetailDto";
import styles from "./ticketList.module.scss";

const TicketList = ({
    tickets,
    name,
}: {
    tickets: TicketDetailDto[];
    name: string;
}) => {
    const [showAllTickets, setShowAllTickets] = useState(false);

    const handleToggleTickets = () => {
        setShowAllTickets((prevState) => !prevState);
    };

    return (
        <>
            <span className={styles.srOnly}>{name} 티켓 정보</span>
            <p className={styles.ticketListContainer}>
                <FaWonSign
                    color="var(--grey-2-color)"
                    className={styles.icon}
                />

                <ul className={styles.ticketListWrapper}>
                    {tickets
                        .slice(0, showAllTickets ? tickets.length : 1)
                        .map((ticket) => (
                            <li key={ticket.id}>
                                <span className={styles.label}>
                                    {ticket.name}
                                </span>
                                <div className={styles.line}></div>
                                <span className={styles.bold}>
                                    {ticket.price}원
                                </span>
                            </li>
                        ))}
                </ul>

                <button onClick={handleToggleTickets}>
                    {showAllTickets ? (
                        <IoIosArrowUp color="black" />
                    ) : (
                        <IoIosArrowDown color="black" />
                    )}
                </button>
            </p>
        </>
    );
};

export default TicketList;
