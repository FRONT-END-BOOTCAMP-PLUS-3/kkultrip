import DeleteTipUsecase from "@/application/usecases/spot/tips/DeleteTipUsecase";
import TipRepository from "@/domain/repositories/TipRepository";
import { PgTipRepository } from "@/infrastructure/repositories/PgTipRepository";
import { NextResponse } from "next/server";

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const { id } = params;
    const tipRepository: TipRepository = new PgTipRepository();
    const deleteTipUsecase = new DeleteTipUsecase(tipRepository);
    await deleteTipUsecase.execute(Number(id));

    return NextResponse.json({ message: "Tip deleted" }, { status: 200 });
}
