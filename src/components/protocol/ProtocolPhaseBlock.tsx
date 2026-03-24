import { PhaseDayRangeBadge } from "@/components/protocol/PhaseDayRangeBadge";
import { PhaseTaskPreviewList } from "@/components/protocol/PhaseTaskPreviewList";

type ProtocolPhaseTaskPreview = {
  id: string;
  title: string;
};

type ProtocolPhaseWithOptionalDescription = {
  id: string;
  name: string;
  dayRange: {
    startDay: number;
    endDay: number;
  };
  tasks: ProtocolPhaseTaskPreview[];
  description?: string;
};

type ProtocolPhaseBlockProps = {
  phase: ProtocolPhaseWithOptionalDescription;
  defaultExpanded?: boolean;
};

export function ProtocolPhaseBlock({ phase, defaultExpanded = false }: ProtocolPhaseBlockProps) {
  const description = typeof phase.description === "string" ? phase.description : null;
  const taskCount = phase.tasks.length;
  const dayCount = phase.dayRange.endDay - phase.dayRange.startDay + 1;
  const taskTitles = phase.tasks.map((task) => task.title);

  return (
    <details open={defaultExpanded}>
      <summary>
        <span className="protocol-phase-summary-row">
          <strong>{phase.name}</strong> | <PhaseDayRangeBadge startDay={phase.dayRange.startDay} endDay={phase.dayRange.endDay} />{" "}
          <span className="phase-badge-row">
            <span className="phase-badge phase-badge-days">{dayCount} days</span>
            {" "}
            <span className="phase-badge phase-badge-tasks">{taskCount} tasks</span>
          </span>
        </span>
      </summary>
      {description ? <p>{description}</p> : null}
      <PhaseTaskPreviewList taskTitles={taskTitles} />
    </details>
  );
}
