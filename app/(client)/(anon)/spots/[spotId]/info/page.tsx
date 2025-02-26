import { IoLocation } from "react-icons/io5";
import { BiPhoneCall } from "react-icons/bi";
import { FaRegClock } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosLink } from "react-icons/io";
import { IoMdPerson } from "react-icons/io";
import { FaClock } from "react-icons/fa";
import styles from "./infoPage.module.scss";
import { SpotDetailDto } from "@/application/usecases/spot/dto/SpotDetailDto";
import TicketList from "./components/TicketList";

const InfoPage = async ({ params }: { params: { spotId: string } }) => {
    const data = await fetch(
        `http://localhost:3000/api/spots/${params.spotId}/info`
    );
    const spotData: SpotDetailDto = await data.json();

    console.log(spotData);

    return (
        <div className={styles.infoContainer}>
            <h2 className={styles.srOnly}>{spotData.name} 상세 정보</h2>
            <p className={styles.info}>{spotData.info}</p>

            <ul className={styles.infoList}>
                <li>
                    <IoLocation color="var(--grey-2-color)" size={18} />
                    {spotData.address}
                </li>
                <li>
                    <BiPhoneCall color="var(--grey-2-color)" size={18} />
                    {spotData.phone}
                </li>
                <li>
                    <FaRegClock color="var(--grey-2-color)" size={18} />
                    <div className={styles.detailInfo}>
                        <span className={styles.label}>월요일</span>
                        <div className={styles.line}></div>
                        <span>오전 10시 ~ 오후 5시</span>
                    </div>
                    <button>
                        <IoIosArrowDown color="black" />
                    </button>
                </li>
                <TicketList tickets={spotData.ticketDetail} />
                <li>
                    <IoIosLink color="var(--grey-2-color)" />
                    <a href={spotData.link}>{spotData.link}</a>
                </li>
                <li>
                    <IoMdPerson color="var(--grey-2-color)" />
                    <span className={styles.subText}>1인 평균 비용</span>
                    <span className={styles.primaryBold}>
                        {spotData.avgPrice}원
                    </span>
                </li>
                <li>
                    <FaClock color="var(--grey-2-color)" />
                    <span className={styles.subText}>평균 대기 시간</span>
                    <span className={styles.primaryBold}>
                        {spotData.avgWaitingTime}시간
                    </span>
                </li>
            </ul>
        </div>
    );
};

export default InfoPage;
