import { IoLocation } from "react-icons/io5";
import { BiPhoneCall } from "react-icons/bi";
import { FaRegClock } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { FaWonSign } from "react-icons/fa6";
import { IoIosLink } from "react-icons/io";
import { IoMdPerson } from "react-icons/io";
import styles from "./infoPage.module.scss";

const InfoPage = () => {
    return (
        <div className={styles.infoContainer}>
            <h2 className={styles.srOnly}>불국사 상세 정보</h2>
            <p className={styles.info}>경주에 있는 문화유적입니다.</p>

            <ul className={styles.infoList}>
                <li>
                    <IoLocation color="var(--grey-2-color)" size={18} />
                    경상북도 경주시 불국로 385
                </li>
                <li>
                    <BiPhoneCall color="var(--grey-2-color)" size={18} />
                    054-746-9913
                </li>
                <li>
                    <FaRegClock color="var(--grey-2-color)" size={18} />
                    <p className={styles.timeInfo}>
                        <span className={styles.label}>월요일</span>
                        <div className={styles.line}></div>
                        <span>오전 10시 ~ 오후 5시</span>
                    </p>
                    <button>
                        <IoIosArrowDown color="black" />
                    </button>
                </li>
                <li>
                    <FaWonSign color="var(--grey-2-color)" />
                    <p className={styles.priceInfo}>
                        <span className={styles.label}>성인</span>
                        <div className={styles.line}></div>
                        <span className={styles.bold}>10,000원</span>
                    </p>
                    <button>
                        <IoIosArrowDown color="black" />
                    </button>
                </li>
                <li>
                    <IoIosLink color="var(--grey-2-color)" />
                    <a href="http://www.bulguksa.or.kr">
                        http://www.bulguksa.or.kr
                    </a>
                </li>
                <li>
                    <IoMdPerson color="var(--grey-2-color)" />
                    <span className={styles.subText}>1인 평균 비용</span>
                    <span className={styles.primaryBold}>10,000원</span>
                </li>
            </ul>
        </div>
    );
};

export default InfoPage;
