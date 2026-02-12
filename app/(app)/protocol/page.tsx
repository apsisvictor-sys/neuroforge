import { coreResetContent } from "@/content/protocols/core-reset";
import { requireUserPage } from "@/infrastructure/auth/require-user-page";

export default async function ProtocolPage() {
  await requireUserPage();

  return (
    <main>
      <h2>{coreResetContent.title}</h2>
      <p>{coreResetContent.summary}</p>
      {coreResetContent.sections.map((section) => (
        <section key={section.heading}>
          <h3>{section.heading}</h3>
          <p>{section.body}</p>
        </section>
      ))}
    </main>
  );
}
