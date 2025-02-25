import styles from "./docentsPage.module.scss";
import DocentContent from "./components/DocentContent";

const data = [
    {
        content: `경주 불국사 대웅전(慶州 佛國寺 大雄殿)은 경상북도 경주시,
                불국사의 대웅전으로 조선시대의 건축물이다. 2011년 12월 30일
                대한민국의 보물 제1744호로 지정되었다. 석가여래 부처님을 모시는
                법당으로, 불국사 경 내 중심이 되는 건물이다. 경주 불국사
                대웅전(慶州 佛國寺 大雄殿)은 경상북도 경주시, 불국사의
                대웅전으로 조선시대의 건축물이다. 2011년 12월 30일 대한민국의
                보물 제1744호로 지정되었다. 석가여래 부처님을 모시는 법당으로,
                  불국사 경 내 중심이 되는 건물이다.`,
    },
    {
        content: `경주 불국사 대웅전(慶州 佛國寺 大雄殿)은 경상북도 경주시,
                불국사의 대웅전으로 조선시대의 건축물이다. 2011년 12월 30일
                대한민국의 보물 제1744호로 지정되었다. 석가여래 부처님을 모시는
                법당으로, 불국사 경 내 중심이 되는 건물이다.`,
    },
];

const DocentsPage = () => {
    return (
        <div className={styles.docentsContainer}>
            <h2 className={styles.srOnly}>불국사 도슨트</h2>
            <div className={styles.docentWrapper}>
                {data.map((item) => (
                    <DocentContent key={item.content} content={item.content} />
                ))}
            </div>
        </div>
    );
};

export default DocentsPage;
