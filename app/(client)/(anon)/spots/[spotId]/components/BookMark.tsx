"use client";

import useUserStore from "@/store/useUserStore";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import styles from "./BookMark.module.scss";

const BookMark = ({
    isBookMarked,
    spotId,
}: {
    isBookMarked: boolean;
    spotId: number;
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const isLoggedIn = useUserStore((state) => state.isLoggedIn);
    const [isBookMark, setIsBookMark] = useState(isBookMarked);
    const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
    const handleBookMark = () => {
        if (!isLoggedIn) {
            document.cookie = `prevUrl=${pathname}; path=/; max-age=600`;
            router.push("/login");
            return;
        }

        setIsBookMark((prev) => !prev);
        if (!isBookMark) {
            fetch(`${apiBaseUrl}/api/spots/${spotId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } else {
            fetch(`${apiBaseUrl}/api/spots/${spotId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }
    };

    return (
        <button className={styles.bookmarkButton} onClick={handleBookMark}>
            {!isLoggedIn ? (
                <FaRegBookmark size={24} color="var(--primary-color)" />
            ) : isBookMark ? (
                <FaBookmark size={24} color="var(--primary-color)" />
            ) : (
                <FaRegBookmark size={24} color="var(--primary-color)" />
            )}
        </button>
    );
};

export default BookMark;
