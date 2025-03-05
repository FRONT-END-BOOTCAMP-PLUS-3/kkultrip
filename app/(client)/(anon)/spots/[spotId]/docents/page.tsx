import styles from "./docentsPage.module.scss";
import DocentContent from "./components/DocentContent";
import { SpotDocentDto } from "@/application/usecases/spot/dto/SpotDocentDto";

const DocentsPage = async (props: { params: Promise<{ spotId: string }> }) => {
    const params = await props.params;
    const data = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/spots/${params.spotId}/docent`
    );
    const docentData: SpotDocentDto[] = await data.json();

    console.log(docentData);

    if (!docentData || docentData.length === 0) {
        return (
            <div className={styles.noData}>
                <p>도슨트가 준비되지 않았습니다.</p>
                <p>관리자에게 도슨트를 요청해주세요!</p>
            </div>
        );
    }

    return (
        <div className={styles.docentsContainer}>
            <h2 className={styles.srOnly}>{docentData[0].spotName} 도슨트</h2>
            <div className={styles.docentWrapper}>
                {docentData.map((docent) => (
                    <DocentContent
                        key={docent.id}
                        title={docent.title}
                        description={docent.description}
                        audioPath={docent.audioPath}
                        docentId={docent.id}
                    />
                ))}
            </div>
        </div>
    );
};

export default DocentsPage;
