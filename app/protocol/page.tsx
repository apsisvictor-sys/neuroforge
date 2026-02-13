import { ProtocolPhaseBlock } from "@/components/protocol/ProtocolPhaseBlock";
import { ProtocolEnrollButton } from "@/components/protocol/ProtocolEnrollButton";
import { requireUserPage } from "@/infrastructure/auth/require-user-page";
import { loadProtocolDetailBySlug } from "./page-loader";

type ProtocolDetailPageProps = {
  searchParams?: {
    slug?: string | string[];
  };
};

function getSlug(searchParams: ProtocolDetailPageProps["searchParams"]): string | undefined {
  const slug = searchParams?.slug;
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

  const result = await loadProtocolDetailBySlug(getSlug(searchParams), userId);

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

  return (
    <main>
      <h2>{result.template.name}</h2>
      <p>{result.template.description}</p>
      <p>Total phases: {result.template.phases.length}</p>
      {result.isEnrolledInThisProtocol ? (
        <>
          <p>Already enrolled in this protocol</p>
          <ProtocolEnrollButton protocolId={result.template.id} disabled />
        </>
      ) : (
        <ProtocolEnrollButton protocolId={result.template.id} />
      )}
      {result.template.phases.map((phase) => (
        <ProtocolPhaseBlock key={phase.id} phase={phase} />
      ))}
    </main>
  );
}
