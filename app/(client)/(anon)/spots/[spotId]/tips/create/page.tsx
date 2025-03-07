import TipForm from "../components/TipForm";

const CreatePage = async (props: { params: Promise<{ spotId: string }> }) => {
    const params = await props.params;
    const { spotId } = params;
    return <TipForm isEdit={false} spotId={spotId} />;
};

export default CreatePage;
