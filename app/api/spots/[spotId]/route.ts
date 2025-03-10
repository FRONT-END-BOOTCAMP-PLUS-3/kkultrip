import { CreateBookmarkUsecase } from "@/application/usecases/spot/CreateBookmarkUsecase";
import { DeleteBookmarkUsecase } from "@/application/usecases/spot/DeleteBookmarkUsecase";
import { GetSpotHeaderUsecase } from "@/application/usecases/spot/GetSpotHeaderUsecase";
import { SpotHeaderDto } from "@/application/usecases/spot/dto/SpotHeaderDto";
import BookmarkRepository from "@/domain/repositories/BookmarkRepository";
import SpotRepository from "@/domain/repositories/SpotRepository";
import { PgBookmarkRepository } from "@/infrastructure/repositories/PgBookmarkRepository";
import PgSpotRepository from "@/infrastructure/repositories/PgSpotRepository";
import { NextResponse, NextRequest } from "next/server";
import { GetUserInfoByJWT } from "@/utils/jwt";
export async function GET(
    req: NextRequest,
    props: { params: Promise<{ spotId: string }> }
) {
    const params = await props.params;
    const { spotId } = params;

    // 쿠키 헤더에서 토큰 추출
    const cookieHeader = req.headers.get("cookie");
    const token = cookieHeader
        ?.split(";")
        .find((c) => c.trim().startsWith("token="))
        ?.split("=")[1];
    let userId = "";

    if (token) {
        const jwtData = await GetUserInfoByJWT(token);
        if (jwtData) {
            userId = jwtData.userId as string;
        }
    }

    const spotRepository: SpotRepository = new PgSpotRepository();
    const bookmarkRepository: BookmarkRepository = new PgBookmarkRepository();
    const spotHeaderUsecase = new GetSpotHeaderUsecase(
        spotRepository,
        bookmarkRepository
    );

    const spotHeader: SpotHeaderDto | null = await spotHeaderUsecase.execute(
        Number(spotId),
        userId
    );

    if (!spotHeader) {
        return NextResponse.json({ error: "Spot not found" }, { status: 404 });
    }

    return NextResponse.json(spotHeader);
}

export async function POST(
    req: NextRequest,
    props: { params: Promise<{ spotId: string }> }
) {
    const params = await props.params;
    const { spotId } = params;
    const token = req.cookies.get("token")?.value;
    if (!token) {
        return NextResponse.json(
            { message: "토큰정보가 없습니다. 로그인이 필요합니다." },
            { status: 401 }
        );
    }

    const jwtData = await GetUserInfoByJWT(token);
    if (!jwtData) {
        return NextResponse.json(
            { message: "토큰정보가 없습니다. 로그인이 필요합니다." },
            { status: 401 }
        );
    }

    const userId = jwtData.userId as string;
    const bookmarkRepository: BookmarkRepository = new PgBookmarkRepository();
    const createBookmarkUsecase = new CreateBookmarkUsecase(bookmarkRepository);
    await createBookmarkUsecase.execute(Number(spotId), userId || "");

    return NextResponse.json({ message: "Bookmark created" }, { status: 200 });
}

export async function DELETE(
    req: NextRequest,
    props: { params: Promise<{ spotId: string }> }
) {
    const params = await props.params;
    const { spotId } = params;
    const token = req.cookies.get("token")?.value;
    if (!token) {
        return NextResponse.json(
            { message: "토큰정보가 없습니다. 로그인이 필요합니다." },
            { status: 401 }
        );
    }

    const jwtData = await GetUserInfoByJWT(token);
    if (!jwtData) {
        return NextResponse.json(
            { message: "토큰정보가 없습니다. 로그인이 필요합니다." },
            { status: 401 }
        );
    }

    const userId = jwtData.userId as string;
    const bookmarkRepository: BookmarkRepository = new PgBookmarkRepository();
    const deleteBookmarkUsecase = new DeleteBookmarkUsecase(bookmarkRepository);
    await deleteBookmarkUsecase.execute(Number(spotId), userId || "");
    return NextResponse.json({ message: "Bookmark deleted" }, { status: 200 });
}
