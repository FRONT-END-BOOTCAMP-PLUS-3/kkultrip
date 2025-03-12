import CreateReactionUsecase from "@/application/usecases/spot/tips/CreateReactionUsecase";
import DeleteReactionUsecase from "@/application/usecases/spot/tips/DeleteReactionUsecase";
import GetReactionUsecase from "@/application/usecases/spot/tips/GetReactionUsecase";
import { UpdateReactionUsecase } from "@/application/usecases/spot/tips/UpdateReactionUsecase";
import ReactionRepository from "@/domain/repositories/ReactionRepository";
import PgReactionRepository from "@/infrastructure/repositories/PgReactionRepository";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const body = await request.json();
    const { id } = params;

    const { userId, type } = body;
    const reactionRepository: ReactionRepository = new PgReactionRepository();

    const createReactionUsecase = new CreateReactionUsecase(reactionRepository);

    const createdReaction = await createReactionUsecase.execute({
        tipId: Number(id),
        userId,
        type,
    });

    return NextResponse.json(createdReaction, { status: 200 });
}

export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const { id } = params;
    const url = new URL(request.url);
    const accessUserId = url.searchParams.get("accessUserId");

    const reactionRepository: ReactionRepository = new PgReactionRepository();
    const getReactionUsecase = new GetReactionUsecase(reactionRepository);

    const reaction = await getReactionUsecase.execute(
        Number(id),
        accessUserId || ""
    );

    return NextResponse.json({ reaction }, { status: 200 });
}

export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const { id } = params;
    const body = await request.json();
    const { userId, type } = body;

    const reactionRepository: ReactionRepository = new PgReactionRepository();
    const updateReactionUsecase = new UpdateReactionUsecase(reactionRepository);

    await updateReactionUsecase.execute({
        tipId: Number(id),
        userId,
        type,
    });

    return NextResponse.json({ message: "Reaction updated" }, { status: 200 });
}

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const { id } = params;
    const body = await request.json();
    const { userId } = body;

    const reactionRepository: ReactionRepository = new PgReactionRepository();
    const deleteReactionUsecase = new DeleteReactionUsecase(reactionRepository);

    await deleteReactionUsecase.execute(Number(id), userId);

    return NextResponse.json({ message: "Reaction deleted" }, { status: 200 });
}
