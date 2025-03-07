import { Spot, Ticket, Time, Docent } from "@prisma/client";
import SpotRepository from "@/domain/repositories/SpotRepository";
import { TicketRepository } from "@/domain/repositories/TicketRepository";
import { TimeRepository } from "@/domain/repositories/TimeRepository";
import { DocentRepository } from "@/domain/repositories/DocentRepository";
import { UpdateSpotDto } from "./dto/UpdateSpotDto";

export class UpdateSpotUseCase {
  constructor(
    private spotRepository: SpotRepository,
    private ticketRepository: TicketRepository,
    private timeRepository: TimeRepository,
    private docentRepository: DocentRepository
  ) {}

  async execute(
    id: number,
    dto: UpdateSpotDto
  ): Promise<{
    spot: Spot | null;
    tickets: Ticket[];
    times: Time[];
    docents: Docent[];
  }> {
    const existingSpot = await this.spotRepository.getSpotById(id);
    if (!existingSpot) {
      throw new Error("Spot not found");
    }

    // Spot 업데이트
    const updatedSpot = {
      id: existingSpot.id,
      name: dto.name ?? existingSpot.name,
      address: dto.address ?? existingSpot.address,
      lon: dto.lon ?? existingSpot.lon,
      lat: dto.lat ?? existingSpot.lat,
      phone: dto.phone ?? existingSpot.phone,
      info: dto.info ?? existingSpot.info,
      category: dto.category ?? existingSpot.category,
      link: dto.link ?? existingSpot.link,
      img: dto.img ?? existingSpot.img,
      avgPrice: dto.avgPrice ?? existingSpot.avgPrice,
      avgWaitingTime: dto.avgWaitingTime ?? existingSpot.avgWaitingTime,
      updatedAt: new Date(),
      createdAt: existingSpot.createdAt,
    };

    const updatedSpotResult = await this.spotRepository.updateSpot(
      id,
      updatedSpot
    );

    // 티켓 업데이트 로직
    const updatedTickets: Ticket[] = [];
    if (dto.tickets && dto.tickets.length > 0) {
      for (const ticketDto of dto.tickets) {
        if (ticketDto.id) {
          // 기존 티켓 업데이트
          const existingTicket = await this.ticketRepository.updateTicket(
            ticketDto.id,
            {
              name: ticketDto.name,
              price: ticketDto.price,
              id: ticketDto.id,
              createdAt: existingSpot.createdAt,
              updatedAt: new Date(),
              spotId: id,
            }
          );
          if (existingTicket) {
            updatedTickets.push(existingTicket);
          }
        } else {
          // 새로운 티켓 생성 (필요하면 추가 가능)
          const newTicket = await this.ticketRepository.createTicket({
            id: 0,
            spotId: id,
            name: ticketDto.name,
            price: ticketDto.price,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          updatedTickets.push(newTicket);
        }
      }
    }

    // 타임 업데이트 로직
    const updatedTimes: Time[] = [];
    if (dto.times && dto.times.length > 0) {
      for (const timeDto of dto.times) {
        if (timeDto.id) {
          // 기존 타임 업데이트
          const existingTime = await this.timeRepository.updateTime(
            timeDto.id,
            {
              spotId: existingSpot.id,
              id: timeDto.id,
              day: timeDto.day,
              open: timeDto.open ?? null,
              close: timeDto.close ?? null,
              allHours: timeDto.all_hours,
              closeDay: timeDto.closeDay,
              createdAt: existingSpot.createdAt,
              updatedAt: new Date(),
            }
          );
          if (existingTime) {
            updatedTimes.push(existingTime);
          }
        }
      }
    }

    // 도슨트 업데이트 로직
    const updatedDocents: Docent[] = [];
    if (dto.docents && dto.docents.length > 0) {
      for (const docentDto of dto.docents) {
        if (docentDto.id) {
          // 기존 도슨트 업데이트
          const existingDocent = await this.docentRepository.updateDocent(
            docentDto.id,
            {
              spotId: existingSpot.id,
              id: docentDto.id,
              title: docentDto.title,
              description: docentDto.description,
              audioPath: docentDto.audioPath,
              createdAt: existingSpot.createdAt,
              updatedAt: new Date(),
            }
          );
          if (existingDocent) {
            updatedDocents.push(existingDocent);
          }
        } else {
          // 새로운 도슨트 생성
          const newDocent = await this.docentRepository.createDocent({
            id: 0,
            spotId: id,
            title: docentDto.title,
            description: docentDto.description,
            audioPath: docentDto.audioPath,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          updatedDocents.push(newDocent);
        }
      }
    }

    return {
      spot: updatedSpotResult,
      tickets: updatedTickets,
      times: updatedTimes,
      docents: updatedDocents,
    };
  }
}
