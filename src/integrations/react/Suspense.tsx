/** @jsxImportSource react */
import { Suspense, type ReactNode } from "react";
import { qwikify$ } from "@builder.io/qwik-react";

// Qwikified Suspense wrapper for smooth loading transitions
type SuspenseWrapperProps = {
  children?: unknown;
  fallback?: unknown;
};

function SuspenseWrapper({
  children,
  fallback,
}: Readonly<SuspenseWrapperProps>) {
  const fallbackNode = fallback as ReactNode;
  const childrenNode = children as ReactNode;
  return <Suspense fallback={fallbackNode}>{childrenNode}</Suspense>;
}

export const QSuspense = qwikify$(
  SuspenseWrapper as unknown as (props: SuspenseWrapperProps) => JSX.Element,
);
