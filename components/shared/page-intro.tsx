type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <header className="max-w-3xl space-y-4">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {title}
      </h1>
      <p className="text-lg leading-8 text-muted">{description}</p>
    </header>
  );
}
