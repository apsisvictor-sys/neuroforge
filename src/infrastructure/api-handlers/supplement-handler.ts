import type { NextRequest } from "next/server";
import { ok, badRequest, serverError } from "@/lib/api";
import { failure } from "@/infrastructure/api/api-response";
import {
  getPublishedSupplements,
  getSupplementsByCategory,
  getSupplementById,
  getSupplementBySlug,
  getPhaseStack,
  SUPPLEMENTS,
} from "@/data/supplements";
import type { SupplementCategory, SupplementPhase } from "@/domain/entities/supplement";

const VALID_CATEGORIES: SupplementCategory[] = [
  "dopamine_precursor",
  "adaptogen",
  "mitochondrial_support",
  "sleep_support",
  "nervous_system_calming",
];

const VALID_PHASES: SupplementPhase[] = [
  "stabilize",
  "reset",
  "rebuild",
  "optimize",
];

export async function handleSupplementList(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    if (category !== null) {
      if (!VALID_CATEGORIES.includes(category as SupplementCategory)) {
        return badRequest(`Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`);
      }
      const supplements = getSupplementsByCategory(category);
      return ok({ supplements });
    }

    const supplements = getPublishedSupplements();
    return ok({ supplements });
  } catch (error) {
    return serverError(error);
  }
}

export async function handleSupplementDetail(
  _request: NextRequest,
  params: { id: string }
) {
  try {
    const { id } = params;
    const supplement = getSupplementById(id) ?? getSupplementBySlug(id);

    if (!supplement || supplement.status !== "published") {
      return failure("Supplement not found", "NOT_FOUND", 404);
    }

    return ok({ supplement });
  } catch (error) {
    return serverError(error);
  }
}

export async function handleSupplementStack(
  _request: NextRequest,
  params: { phase: string }
) {
  try {
    const { phase } = params;

    if (!VALID_PHASES.includes(phase as SupplementPhase)) {
      return badRequest(`Invalid phase. Must be one of: ${VALID_PHASES.join(", ")}`);
    }

    const stack = getPhaseStack(phase);
    if (!stack) {
      return badRequest("No stack found for phase");
    }

    const supplements = stack.entries
      .map((entry) => ({
        supplement: SUPPLEMENTS.find((s) => s.id === entry.supplementId),
        rationale: entry.rationale,
        priority: entry.priority,
      }))
      .filter((e) => e.supplement?.status === "published");

    return ok({
      stack: {
        phase: stack.phase,
        focus: stack.focus,
        supplements,
      },
    });
  } catch (error) {
    return serverError(error);
  }
}
