import { createElement } from "react";

type PhaseTaskPreviewListProps = {
  taskTitles: string[];
  maxVisible?: number;
};

export function PhaseTaskPreviewList({ taskTitles, maxVisible = 5 }: PhaseTaskPreviewListProps) {
  if (taskTitles.length === 0) {
    return createElement(
      "section",
      { className: "phase-task-preview-section" },
      createElement("p", { className: "phase-task-empty" }, "No task definitions in this phase")
    );
  }

  const visibleTitles = taskTitles.slice(0, maxVisible);
  const hiddenCount = Math.max(0, taskTitles.length - visibleTitles.length);

  return createElement(
    "section",
    { className: "phase-task-preview-section" },
    createElement(
      "p",
      null,
      createElement("span", { className: "phase-task-preview-label" }, "Task preview"),
      " ",
      createElement("span", { className: "phase-task-preview-count" }, String(taskTitles.length))
    ),
    createElement(
      "ul",
      null,
      ...visibleTitles.map((title, index) => createElement("li", { key: `${title}-${index}` }, title))
    ),
    hiddenCount > 0 ? createElement("p", null, `...and ${hiddenCount} more`) : null
  );
}
