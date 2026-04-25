function stripTrailingVariant(value: string) {
  return value.replace(/\s*[（(][^()（）]*[）)]\s*$/g, "").replace(/\s+/g, " ").trim();
}

export function formatBeerBrandLabel(value: string) {
  return stripTrailingVariant(value);
}

export function formatBeerStyleLabel(value: string) {
  const normalized = stripTrailingVariant(value);

  if (normalized === "双倍浑浊 IPA") {
    return "双倍浑浊 · IPA";
  }

  return normalized;
}

export function formatBeerMetaLine(input: {
  breweryName: string;
  styleName: string;
  abv?: number | null;
}) {
  const parts = [
    formatBeerBrandLabel(input.breweryName),
    formatBeerStyleLabel(input.styleName),
  ];

  if (input.abv !== null && input.abv !== undefined) {
    parts.push(`ABV ${input.abv}%`);
  }

  return parts.join(" · ");
}
