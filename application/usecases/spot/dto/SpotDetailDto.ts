import { TicketDetailDto } from "./TicketDetailDto";
import { TimeDetailDto } from "./TimeDetailDto";

export interface SpotDetailDto {
    id: number;
    name: string;
    address: string;
    phone: string;
    info: string;
    category: string;
    link: string;
    avgPrice: number;
    avgWaitingTime: number;
    ticketDetail: TicketDetailDto[];
    timeDetail: TimeDetailDto[];
}
