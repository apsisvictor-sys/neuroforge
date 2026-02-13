import type { ProtocolTemplate, UserProtocolEnrollment } from "@/domain/entities/protocol";

export type ProtocolDetailLoadResult =
  | { status: "missing-slug"; template: null; isEnrolledInThisProtocol: false }
  | { status: "not-found"; template: null; isEnrolledInThisProtocol: false }
  | { status: "ok"; template: ProtocolTemplate; isEnrolledInThisProtocol: boolean };

async function defaultGetTemplateBySlug(slug: string): Promise<ProtocolTemplate | null> {
  const { repositories } = await import("../../src/infrastructure/db/repositories/index.ts");
  return repositories.protocol.getTemplateBySlug(slug);
}

async function defaultGetActiveEnrollment(userId: string): Promise<UserProtocolEnrollment | null> {
  const { repositories } = await import("../../src/infrastructure/db/repositories/index.ts");
  return repositories.protocol.getActiveEnrollment(userId);
}

export async function loadProtocolDetailBySlug(
  slug: string | undefined,
  userId: string,
  getTemplateBySlug: (slugValue: string) => Promise<ProtocolTemplate | null> = defaultGetTemplateBySlug,
  getActiveEnrollment: (userIdValue: string) => Promise<UserProtocolEnrollment | null> = defaultGetActiveEnrollment
): Promise<ProtocolDetailLoadResult> {
  if (!slug || !slug.trim()) {
    return { status: "missing-slug", template: null, isEnrolledInThisProtocol: false };
  }

  const template = await getTemplateBySlug(slug.trim());
  if (!template) {
    return { status: "not-found", template: null, isEnrolledInThisProtocol: false };
  }

  const activeEnrollment = await getActiveEnrollment(userId);
  return {
    status: "ok",
    template,
    isEnrolledInThisProtocol: activeEnrollment?.protocolId === template.id
  };
}
