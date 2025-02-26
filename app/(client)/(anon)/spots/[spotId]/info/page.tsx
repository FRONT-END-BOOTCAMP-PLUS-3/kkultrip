import { SpotDetailDto } from "@/application/usecases/spot/dto/SpotDetailDto";
import { BiPhoneCall } from "react-icons/bi";
import { FaClock } from "react-icons/fa";
import { IoIosLink, IoMdPerson } from "react-icons/io";
import { IoLocation } from "react-icons/io5";
import TicketList from "./components/TicketList";
import TimeList from "./components/TimeList";
import styles from "./infoPage.module.scss";

const InfoPage = async ({ params }: { params: { spotId: string } }) => {
    const data = await fetch(
        `http://localhost:3000/api/spots/${params.spotId}/info`
    );
    const spotData: SpotDetailDto = await data.json();

    return (
        <div className={styles.infoContainer}>
            <h2 className={styles.srOnly}>{spotData.name} 상세 정보</h2>
            <p className={styles.info}>{spotData.info}</p>

            <div className={styles.infoList}>
                <span className={styles.srOnly}>{spotData.name} 주소</span>
                <p>
                    <IoLocation color="var(--grey-2-color)" size={18} />
                    {spotData.address}
                </p>
                <span className={styles.srOnly}>{spotData.name} 전화번호</span>
                <p>
                    <BiPhoneCall color="var(--grey-2-color)" size={18} />
                    {spotData.phone}
                </p>

                <TimeList times={spotData.timeDetail} name={spotData.name} />

                <TicketList
                    tickets={spotData.ticketDetail}
                    name={spotData.name}
                />
                <span className={styles.srOnly}>{spotData.name} 링크</span>
                <p>
                    <IoIosLink color="var(--grey-2-color)" />
                    <a href={spotData.link}>{spotData.link}</a>
                </p>
                <span className={styles.srOnly}>
                    {spotData.name} 1인 평균 비용
                </span>
                <p>
                    <IoMdPerson color="var(--grey-2-color)" size={18} />
                    <span className={styles.subText}>1인 평균 비용</span>
                    <span className={styles.primaryBold}>
                        {spotData.avgPrice}원
                    </span>
                </p>
                <span className={styles.srOnly}>
                    {spotData.name} 평균 대기 시간
                </span>
                <p>
                    <FaClock color="var(--grey-2-color)" size={18} />
                    <span className={styles.subText}>평균 대기 시간</span>
                    <span className={styles.primaryBold}>
                        {spotData.avgWaitingTime}시간
                    </span>
                </p>
            </div>
        </div>
    );
};

export default InfoPage;
