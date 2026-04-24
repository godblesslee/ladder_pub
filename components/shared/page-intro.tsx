type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <header className="max-w-3xl space-y-3 sm:space-y-4">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {title}
      </h1>
      <p className="text-base leading-7 text-muted sm:text-lg sm:leading-8">
        {description}
      </p>
    </header>
  );
}
