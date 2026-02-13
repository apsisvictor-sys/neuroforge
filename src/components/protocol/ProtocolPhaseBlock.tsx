import type { ProtocolPhase } from "@/domain/entities/protocol";

type ProtocolPhaseWithOptionalDescription = ProtocolPhase & {
  description?: string;
};

export function ProtocolPhaseBlock({ phase }: { phase: ProtocolPhaseWithOptionalDescription }) {
  const description = typeof phase.description === "string" ? phase.description : null;

  return (
    <section>
      <h3>{phase.name}</h3>
      <p>
        Days {phase.dayRange.startDay}-{phase.dayRange.endDay}
      </p>
      {description ? <p>{description}</p> : null}
    </section>
  );
}
