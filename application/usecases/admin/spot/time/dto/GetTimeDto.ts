export interface GetTimeDto {
  id: number;
  day: string;
  open?: string | null;
  close?: string | null;
  allHours: boolean;
  closeDay: boolean;
}
