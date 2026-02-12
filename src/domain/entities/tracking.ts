export type DailyCheckin = {
  id: string;
  userId: string;
  dayKey: string;
  focus: number;
  calm: number;
  energy: number;
  note: string | null;
  createdAt: string;
};
