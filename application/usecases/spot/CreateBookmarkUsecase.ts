import BookmarkRepository from "@/domain/repositories/BookmarkRepository";

export class CreateBookmarkUsecase {
    constructor(private bookmarkRepository: BookmarkRepository) {}

    async execute(spotId: number, userId: string): Promise<void> {
        await this.bookmarkRepository.createBookmark(spotId, userId);
    }
}