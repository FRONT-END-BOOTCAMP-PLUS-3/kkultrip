export default interface TicketRepository {
  createTicket(spotId: number): Promise<void>;
}
