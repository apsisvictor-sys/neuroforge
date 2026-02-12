import { focusBasicsArticle } from "@/content/education/focus-basics";

export default function ContentPage() {
  return (
    <main>
      <h2>Education</h2>
      <article>
        <h3>{focusBasicsArticle.title}</h3>
        {focusBasicsArticle.body.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </article>
    </main>
  );
}
