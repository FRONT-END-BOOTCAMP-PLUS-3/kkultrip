import { CreateBookmarkUsecase } from "@/application/usecases/spot/CreateBookmarkUsecase";
import { DeleteBookmarkUsecase } from "@/application/usecases/spot/DeleteBookmarkUsecase";
import { GetSpotHeaderUsecase } from "@/application/usecases/spot/GetSpotHeaderUsecase";
import { SpotHeaderDto } from "@/application/usecases/spot/dto/SpotHeaderDto";
import BookmarkRepository from "@/domain/repositories/BookmarkRepository";
import SpotRepository from "@/domain/repositories/SpotRepository";
import { PgBookmarkRepository } from "@/infrastructure/repositories/PgBookmarkRepository";
import { PgSpotRepository } from "@/infrastructure/repositories/PgSpotRepository";
import { NextResponse } from "next/server";

export async function GET(req: Request, props: { params: Promise<{ spotId: string }> }) {
    const params = await props.params;
    const { spotId } = params;
    const url = new URL(req.url);
    const accessUserId = url.searchParams.get("accessUserId");
    const spotRepository: SpotRepository = new PgSpotRepository();
    const bookmarkRepository: BookmarkRepository = new PgBookmarkRepository();
    const spotHeaderUsecase = new GetSpotHeaderUsecase(
        spotRepository,
        bookmarkRepository
    );

    const spotHeader: SpotHeaderDto | null = await spotHeaderUsecase.execute(
        Number(spotId),
        accessUserId || ""
    );
    if (!spotHeader) {
        return NextResponse.json({ error: "Spot not found" }, { status: 404 });
    }
    return NextResponse.json(spotHeader);
}

export async function POST(req: Request, props: { params: Promise<{ spotId: string }> }) {
    const params = await props.params;
    const { spotId } = params;
    const { accessUserId } = await req.json();

    const bookmarkRepository: BookmarkRepository = new PgBookmarkRepository();
    const createBookmarkUsecase = new CreateBookmarkUsecase(bookmarkRepository);
    await createBookmarkUsecase.execute(Number(spotId), accessUserId || "");
    return NextResponse.json({ message: "Bookmark created" }, { status: 200 });
}

export async function DELETE(req: Request, props: { params: Promise<{ spotId: string }> }) {
    const params = await props.params;
    const { spotId } = params;
    const { accessUserId } = await req.json();

    const bookmarkRepository: BookmarkRepository = new PgBookmarkRepository();
    const deleteBookmarkUsecase = new DeleteBookmarkUsecase(bookmarkRepository);
    await deleteBookmarkUsecase.execute(Number(spotId), accessUserId || "");
    return NextResponse.json({ message: "Bookmark deleted" }, { status: 200 });
}
