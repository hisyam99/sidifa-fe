/** @jsxImportSource react */
import { Suspense, type ReactNode } from "react";
import { qwikify$ } from "@builder.io/qwik-react";

// Qwikified Suspense wrapper for smooth loading transitions
type SuspenseWrapperProps = {
  children?: ReactNode;
  fallback?: ReactNode;
};

function SuspenseWrapper({
  children,
  fallback,
}: Readonly<SuspenseWrapperProps>) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}

// Explicitly type the Qwikified component to accept any children/fallback
export const QSuspense = qwikify$(
  SuspenseWrapper as (props: any) => JSX.Element,
);
