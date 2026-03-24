import { createElement } from "react";
import { ProtocolPhaseBlock } from "@/components/protocol/ProtocolPhaseBlock";

type ProtocolPhaseListProps = {
  phases: Array<{
    id: string;
    name: string;
    dayRange: {
      startDay: number;
      endDay: number;
    };
    tasks: Array<{
      id: string;
      title: string;
    }>;
    description?: string;
  }>;
  defaultExpandedFirst?: boolean;
};

export function ProtocolPhaseList({ phases, defaultExpandedFirst = false }: ProtocolPhaseListProps) {
  return createElement(
    "section",
    { className: "protocol-detail-phases-section" },
    ...phases.map((phase, index) =>
      createElement(ProtocolPhaseBlock, {
        key: phase.id,
        phase,
        defaultExpanded: defaultExpandedFirst && index === 0
      })
    )
  );
}
