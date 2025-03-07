import { prisma } from "@/lib/prisma";
import { TicketRepository } from "@/domain/repositories/TicketRepository";
import { Ticket } from "@prisma/client";

export class PgTicketRepository implements TicketRepository {
  async getTicketBySpotId(spotId: number): Promise<Ticket[]> {
    try {
      return await prisma.ticket.findMany({
        where: {
          spotId,
        },
      });
    } catch (error) {
      console.error("❌ getTicketBySpotId 오류 발생:", error);
      throw new Error("해당 명소의 티켓 정보를 가져오는 데 실패했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async createTicket(ticket: Ticket): Promise<Ticket> {
    try {
      return await prisma.ticket.create({
        data: {
          name: ticket.name,
          price: ticket.price,
          spotId: ticket.spotId,
        },
      });
    } catch (error) {
      console.error("❌ createTicket 오류 발생:", error);
      throw new Error("티켓 생성 중 오류가 발생했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateTicket(
    id: number,
    ticket: Partial<Ticket>
  ): Promise<Ticket | null> {
    try {
      return await prisma.ticket.update({
        where: { id },
        data: ticket,
      });
    } catch (error) {
      console.error("❌ updateTicket 오류 발생:", error);
      throw new Error("티켓 업데이트 중 오류가 발생했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }

  async deleteTicket(id: number): Promise<Ticket | null> {
    try {
      return await prisma.ticket.delete({
        where: { id },
      });
    } catch (error) {
      console.error("❌ deleteTicket 오류 발생:", error);
      throw new Error("티켓 삭제 중 오류가 발생했습니다.");
    } finally {
      await prisma.$disconnect();
    }
  }
}
