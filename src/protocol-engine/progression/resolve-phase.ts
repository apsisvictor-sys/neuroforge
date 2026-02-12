import type { ProtocolPhase, ProtocolTemplate } from "@/domain/entities/protocol";

export function resolvePhaseByDay(protocol: ProtocolTemplate, dayNumber: number): ProtocolPhase {
  const phase = protocol.phases.find(
    (candidate) => dayNumber >= candidate.dayRange.startDay && dayNumber <= candidate.dayRange.endDay
  );

  if (phase) {
    return phase;
  }

  return protocol.phases[protocol.phases.length - 1];
}
