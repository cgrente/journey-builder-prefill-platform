export type DependencyType = "direct" | "transitive" | "global" | "all";

const DEPENDENCY_TYPES: readonly DependencyType[] = [
  "direct",
  "transitive",
  "global",
  "all",
];

export function getCurrentUrl(): DependencyType {
  const params = new URLSearchParams(document.location.search);
  const value = params.get("dependencyType");

  if (DEPENDENCY_TYPES.includes(value as DependencyType)) {
    return value as DependencyType;
  }

  return "all";
}