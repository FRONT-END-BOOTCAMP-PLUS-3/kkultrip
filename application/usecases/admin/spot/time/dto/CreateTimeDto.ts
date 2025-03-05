export interface CreateTimeDto {
  spotId: number;
  day: string;
  open?: string | null;
  close?: string | null;
  all_hours: boolean;
  closeDay: boolean;
}
