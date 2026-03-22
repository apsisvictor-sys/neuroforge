import type { ProtocolRepository } from "@/domain/repositories/protocol-repository";

export type StreakCalendarDay = {
  dayKey: string;
  completionScore: number;
};

export async function getStreakCalendar(params: {
  userId: string;
  protocolRepository: ProtocolRepository;
}): Promise<StreakCalendarDay[]> {
  const summaries = await params.protocolRepository.getDailyCompletionSummaries(params.userId, 56);
  return summaries.map((s) => ({ dayKey: s.dayKey, completionScore: s.completionScore }));
}
