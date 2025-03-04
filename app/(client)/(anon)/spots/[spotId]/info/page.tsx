import { SpotInfoDto } from "@/application/usecases/spot/dto/SpotInfoDto";
import { BiPhoneCall } from "react-icons/bi";
import { FaClock } from "react-icons/fa";
import { IoIosLink, IoMdPerson } from "react-icons/io";
import { IoLocation } from "react-icons/io5";
import TicketList from "./components/TicketList";
import TimeList from "./components/TimeList";
import styles from "./infoPage.module.scss";
import CopyButton from "./components/CopyButton";

const InfoPage = async ({ params }: { params: { spotId: string } }) => {
    const data = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/spots/${params.spotId}/info`
    );
    const spotData: SpotInfoDto = await data.json();

    return (
        <div className={styles.infoContainer}>
            <h2 className={styles.srOnly}>{spotData.name} 상세 정보</h2>
            <p className={styles.info}>{spotData.info}</p>

            <div className={styles.infoList}>
                <span className={styles.srOnly}>{spotData.name} 주소</span>
                <div className={styles.copyWrapper}>
                    <p>
                        <IoLocation color="var(--grey-2-color)" size={18} />
                        {spotData.address}
                    </p>
                    <CopyButton text={spotData.address} />
                </div>
                <span className={styles.srOnly}>{spotData.name} 전화번호</span>
                <div className={styles.copyWrapper}>
                    <p>
                        <BiPhoneCall color="var(--grey-2-color)" size={18} />
                        {spotData.phone}
                    </p>
                    <CopyButton text={spotData.phone} />
                </div>

                <TimeList times={spotData.timeDetail} name={spotData.name} />

                <TicketList
                    tickets={spotData.ticketDetail}
                    name={spotData.name}
                />

                {spotData.link && (
                    <p>
                        <span className={styles.srOnly}>
                            {spotData.name} 링크
                        </span>
                        <IoIosLink color="var(--grey-2-color)" />
                        <a href={spotData.link} className={styles.link}>
                            {spotData.link}
                        </a>
                    </p>
                )}
                <span className={styles.srOnly}>
                    {spotData.name} 1인 평균 비용
                </span>
                <p>
                    <IoMdPerson color="var(--grey-2-color)" size={18} />
                    <span className={styles.subText}>1인 평균 비용</span>
                    <span className={styles.primaryBold}>
                        {spotData.avgPrice.toLocaleString()}원
                    </span>
                </p>
                <span className={styles.srOnly}>
                    {spotData.name} 평균 대기 시간
                </span>
                <p>
                    <FaClock color="var(--grey-2-color)" size={18} />
                    <span className={styles.subText}>평균 대기 시간</span>
                    <span className={styles.primaryBold}>
                        {spotData.avgWaitingTime}분
                    </span>
                </p>
                <span className={styles.srOnly}>주의 사항</span>
                <ul className={styles.subInfo}>
                    <li>
                        상단의 영업 시간 및 티켓 가격은 장소에서 제공된 정보를
                        기준으로 작성되었으며 변동될 수 있습니다.
                    </li>
                    <li>
                        1인 평균 비용과 평균 대기 시간은 평균 값으로
                        계산되었으며 실제와 다를 수 있습니다.
                    </li>
                    {spotData.ticketDetail[0] && (
                        <li>
                            티켓 가격은 {spotData.ticketDetail[0].updatedAt}{" "}
                            기준입니다.
                        </li>
                    )}
                    {spotData.timeDetail[0] && (
                        <li>
                            영업 시간은 {spotData.timeDetail[0].updatedAt}{" "}
                            기준입니다.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default InfoPage;
