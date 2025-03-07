import TipForm from "../../components/TipForm";

const EditPage = async (props: {
    params: Promise<{ spotId: string; tipId: string }>;
}) => {
    const params = await props.params;
    const { spotId, tipId } = params;

    return <TipForm isEdit={true} spotId={spotId} tipId={tipId} />;
};

export default EditPage;
