import type { ProtocolRepository } from "@/domain/repositories/protocol-repository";

export async function ensureEnrollment(input: {
  userId: string;
  protocolRepository: ProtocolRepository;
}): Promise<{ protocolId: string; startDate: string }> {
  const existing = await input.protocolRepository.getActiveEnrollment(input.userId);
  if (existing) {
    return { protocolId: existing.protocolId, startDate: existing.startDate };
  }

  const templates = await input.protocolRepository.listTemplates();
  const template = templates[0];

  const enrollment = await input.protocolRepository.enroll(
    input.userId,
    template.id,
    new Date().toISOString()
  );

  return { protocolId: enrollment.protocolId, startDate: enrollment.startDate };
}
