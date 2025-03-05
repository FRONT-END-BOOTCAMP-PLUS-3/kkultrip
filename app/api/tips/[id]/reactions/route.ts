import CreateReactionUsecase from "@/application/usecases/spot/CreateReactionUsecase";
import ReactionRepository from "@/domain/repositories/ReactionRepository";
import PgReactionRepository from "@/infrastructure/repositories/PgReactionRepository";
import { NextResponse } from "next/server";

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const body = await request.json();
    const { id } = params;

    const { userId, type } = body;
    const reactionRepository: ReactionRepository = new PgReactionRepository();

    const createReactionUsecase = new CreateReactionUsecase(reactionRepository);

    await createReactionUsecase.execute({
        tipId: Number(id),
        userId,
        type,
    });

    return NextResponse.json({ message: "Reaction created" }, { status: 200 });
}
