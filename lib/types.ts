export const ENTRY_TYPES = [
  "built",
  "fixed",
  "researched",
  "designed",
  "shipped",
  "blocked",
] as const;
export type EntryType = (typeof ENTRY_TYPES)[number];

export const ARTIFACT_KINDS = [
  "github",
  "notion",
  "figma",
  "loom",
  "external",
] as const;
export type ArtifactKind = (typeof ARTIFACT_KINDS)[number];

export type Artifact = {
  kind: ArtifactKind;
  title: string;
  meta: string;
  href?: string;
};
