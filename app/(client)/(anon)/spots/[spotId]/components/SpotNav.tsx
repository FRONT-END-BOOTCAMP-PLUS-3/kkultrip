"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./SpotNav.module.scss";

const SpotNav = ({ spotId }: { spotId: string }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const isActive = (path: string, query: string) => {
        const currentQuery = searchParams.toString();
        return pathname === path && currentQuery === query;
    };

    return (
        <ul className={styles.navContainer}>
            <li
                className={
                    isActive(`/spots/${spotId}/info`, "") ? styles.active : ""
                }
            >
                <Link href={`/spots/${spotId}/info`}>홈</Link>
            </li>
            <li
                className={
                    isActive(`/spots/${spotId}/docents`, "") ? styles.active : ""
                }
            >
                <Link href={`/spots/${spotId}/docents`}>도슨트</Link>
            </li>
            <li
                className={
                    isActive(`/spots/${spotId}/tips`, "sort=latest") ||
                    isActive(`/spots/${spotId}/tips`, "sort=reaction")
                        ? styles.active
                        : ""
                }
            >
                <Link href={`/spots/${spotId}/tips?sort=latest`}>꿀팁</Link>
            </li>
            <li
                className={
                    isActive(`/spots/${spotId}/images`, "") ? styles.active : ""
                }
            >
                <Link href={`/spots/${spotId}/images`}>사진</Link>
            </li>
        </ul>
    );
};

export default SpotNav;
