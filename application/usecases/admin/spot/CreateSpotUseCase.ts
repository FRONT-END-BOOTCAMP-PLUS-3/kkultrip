import { Spot, Ticket, Time, Docent } from "@prisma/client";
import { SpotRepository } from "@/domain/repositories/SpotRepository";
import { TicketRepository } from "@/domain/repositories/TicketRepository";
import { CreateSpotDto } from "./dto/CreateSpotDto";
import { TimeRepository } from "@/domain/repositories/TimeRepository";
import { DocentRepository } from "@/domain/repositories/DocentRepository";

export class CreateSpotUseCase {
  constructor(
    private spotRepository: SpotRepository,
    private ticketRepository: TicketRepository,
    private timeRepository: TimeRepository,
    private docentRepository: DocentRepository
  ) {}

  async execute(dto: CreateSpotDto): Promise<{
    spot: Spot;
    tickets: Ticket[];
    times: Time[];
    docents: Docent[];
  }> {
    const newSpot = {
      id: 0,
      name: dto.name,
      address: dto.address,
      lon: dto.lon,
      lat: dto.lat,
      phone: dto.phone ?? null,
      info: dto.info ?? null,
      category: dto.category,
      link: dto.link ?? null,
      img: dto.img,
      avgPrice: 0,
      avgWaitingTime: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const createdSpot: Spot = await this.spotRepository.createSpot(newSpot);

    const tickets: Ticket[] = [];
    if (dto.tickets && dto.tickets.length > 0) {
      for (const ticketDto of dto.tickets) {
        const newTicket = {
          id: 0,
          spotId: createdSpot.id,
          name: ticketDto.name,
          price: ticketDto.price,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const createdTicket = await this.ticketRepository.createTicket(
          newTicket
        );
        tickets.push(createdTicket);
      }
    }

    const times: Time[] = [];
    if (dto.times && dto.times.length > 0) {
      for (const timeDto of dto.times) {
        const newTime = {
          id: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          spotId: createdSpot.id,
          open: timeDto.open || null,
          close: timeDto.close || null,
          day: timeDto.day,
          all_hours: timeDto.all_hours,
          closeDay: timeDto.closeDay,
        };
        const createdTime: Time = await this.timeRepository.createTime(newTime);
        times.push(createdTime);
      }
    }

    const docents: Docent[] = [];
    if (dto.docents && dto.docents.length > 0) {
      for (const docentDto of dto.docents) {
        const newDocent = {
          id: 0,
          spotId: createdSpot.id,
          title: docentDto.title,
          description: docentDto.description,
          audioPath: docentDto.audioPath,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const createdDocent: Docent = await this.docentRepository.createDocent(
          newDocent
        );
        docents.push(createdDocent);
      }
    }

    return {
      spot: createdSpot,
      tickets: tickets,
      times: times,
      docents: docents,
    };
  }
}
