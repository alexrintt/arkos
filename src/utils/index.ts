export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })
    .formatToParts(value)
    .map((e) => e.value)
    .slice(1)
    .join("");
}

export function isValidHexColor(color: string): boolean {
  // Regular expression that matches a valid hex color string
  const hexRegex = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

  // Test if the color string matches the regex
  return hexRegex.test(color);
}

export function when<T, R = void>(
  it: T,
  is: Record<string, () => R>,
  fallback?: () => R
): R {
  for (const key of Object.keys(is)) {
    if (key === it) {
      return is[key]();
    }
  }

  if (fallback) {
    return fallback();
  }

  throw Error(
    `Invalid [when] has no fallback and none match was found: [when(${it})]`
  );
}

export function isUndefined<T>(v: T): boolean {
  return v === undefined || typeof v === "undefined" || v === null;
}

export function isDefined<T>(v: T): boolean {
  return !isUndefined(v);
}
