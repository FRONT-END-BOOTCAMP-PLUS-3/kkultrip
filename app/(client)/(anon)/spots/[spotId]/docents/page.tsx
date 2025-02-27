import styles from "./docentsPage.module.scss";
import DocentContent from "./components/DocentContent";
import { SpotDocentDto } from "@/application/usecases/spot/dto/SpotDocentDto";

const DocentsPage = async ({ params }: { params: { spotId: string } }) => {
    const data = await fetch(
        `http://localhost:3000/api/spots/${params.spotId}/docent`
    );
    const docentData: SpotDocentDto[] = await data.json();

    console.log(docentData);
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
                    />
                ))}
            </div>
        </div>
    );
};

export default DocentsPage;
