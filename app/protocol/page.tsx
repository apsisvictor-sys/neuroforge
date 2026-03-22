import { ProtocolEnrollButton } from "@/components/protocol/ProtocolEnrollButton";
import { ProtocolDescription } from "@/components/protocol/ProtocolDescription";
import { ProtocolDetailHeader } from "@/components/protocol/ProtocolDetailHeader";
import { ProtocolPhaseList } from "@/components/protocol/ProtocolPhaseList";
import { ProtocolSummaryBlock } from "@/components/protocol/ProtocolSummaryBlock";
import { loadProtocolDetail } from "@/application/protocol/load-protocol-detail";
import { requireUserPage } from "@/infrastructure/auth/require-user-page";
import { repositories } from "@/infrastructure/db/repositories";

type ProtocolDetailPageProps = {
  searchParams?: Promise<{ slug?: string | string[] }>;
};

function getSlug(params: { slug?: string | string[] } | undefined): string | undefined {
  const slug = params?.slug;
  if (typeof slug === "string") {
    return slug;
  }

  if (Array.isArray(slug)) {
    return slug[0];
  }

  return undefined;
}

export default async function ProtocolPage({ searchParams }: ProtocolDetailPageProps) {
  const userId = await requireUserPage();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  const result = await loadProtocolDetail(getSlug(resolvedSearchParams), userId, repositories.protocol);

  if (result.status === "missing-slug") {
    return (
      <main>
        <h2>Protocol</h2>
        <p>Please choose a protocol from the catalog.</p>
      </main>
    );
  }

  if (result.status === "not-found") {
    return (
      <main>
        <h2>Protocol</h2>
        <p>Protocol not found</p>
      </main>
    );
  }

  const totalDays = result.template.phases.reduce((maxDays, phase) => {
    return Math.max(maxDays, phase.dayRange.endDay);
  }, 0);

  const phaseCount = result.template.phases.length;

  const taskDefinitionCount = result.template.phases.reduce((count, phase) => {
    return count + phase.tasks.length;
  }, 0);

  return (
    <main>
      <ProtocolDetailHeader title={result.template.name} isEnrolled={result.isEnrolledInThisProtocol} />
      <ProtocolDescription description={result.template.description} />
      {result.template.scientificRationale && (
        <section className="protocol-detail-science-section">
          <h4>Why this works</h4>
          <p>{result.template.scientificRationale}</p>
        </section>
      )}
      {result.template.expectedOutcome && (
        <section className="protocol-detail-outcome-section">
          <h4>Expected outcomes</h4>
          <p>{result.template.expectedOutcome}</p>
        </section>
      )}
      <div className="protocol-detail-meta-row">
        {result.isEnrolledInThisProtocol ? (
          <>
            <p>You are currently enrolled in this protocol. Continue from your <a href="/today">Today</a> page.</p>
            <ProtocolEnrollButton protocolId={result.template.id} disabled />
          </>
        ) : (
          <>
            <p>Ready to start your restoration journey? Enroll to begin Day 1.</p>
            <ProtocolEnrollButton protocolId={result.template.id} />
          </>
        )}
      </div>
      <section className="protocol-detail-summary-section">
        <ProtocolSummaryBlock
          totalDays={totalDays}
          phaseCount={phaseCount}
          taskDefinitionCount={taskDefinitionCount}
        />
      </section>
      <h3 className="protocol-detail-phases-header">Phases</h3>
      <ProtocolPhaseList phases={result.template.phases} defaultExpandedFirst />
    </main>
  );
}
