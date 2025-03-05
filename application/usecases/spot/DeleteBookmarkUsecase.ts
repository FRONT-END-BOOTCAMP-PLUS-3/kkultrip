import BookmarkRepository from "@/domain/repositories/BookmarkRepository";

export class DeleteBookmarkUsecase {
    constructor(private bookmarkRepository: BookmarkRepository) {}

    async execute(spotId: number, accessUserId: string) {
        await this.bookmarkRepository.deleteBookmark(spotId, accessUserId);
    }
}
