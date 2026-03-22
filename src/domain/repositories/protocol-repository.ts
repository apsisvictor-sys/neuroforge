import type {
  ProtocolCatalogItem,
  DailyCompletionSummary,
  DailyTaskInstance,
  ProtocolTemplate,
  StreakState,
  UserProtocolEnrollment
} from "@/domain/entities/protocol";

export interface ProtocolRepository {
  listTemplates(): Promise<ProtocolTemplate[]>;
  listTemplateCatalog(): Promise<ProtocolCatalogItem[]>;
  getTemplateById(id: string): Promise<ProtocolTemplate | null>;
  getTemplateBySlug(slug: string): Promise<ProtocolTemplate | null>;
  getActiveEnrollment(userId: string): Promise<UserProtocolEnrollment | null>;
  enroll(userId: string, protocolId: string, startDate: string): Promise<UserProtocolEnrollment>;
  listDailyTasks(userId: string, dayKey: string): Promise<DailyTaskInstance[]>;
  replaceDailyTasks(userId: string, dayKey: string, tasks: DailyTaskInstance[]): Promise<void>;
  toggleTask(taskId: string): Promise<DailyTaskInstance | null>;
  getStreak(userId: string): Promise<StreakState>;
  saveStreak(streak: StreakState): Promise<void>;
  getDailyCompletionSummaries(userId: string, days: number): Promise<DailyCompletionSummary[]>;
}
