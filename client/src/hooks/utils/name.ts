import type { DocumentNode, TypedDocumentNode } from "@apollo/client";

type N = DocumentNode | TypedDocumentNode;

export const getDocumentNodeName = (dn: N): string =>
  (dn.definitions[0] as any).name.value;
