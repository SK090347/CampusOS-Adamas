"use client";

import { useSearchParams } from "next/navigation";
import { CommandSearch } from "@/components/search/CommandSearch";
import { Suspense } from "react";

function Inner() {
  const sp = useSearchParams();
  return <CommandSearch initialQuery={sp.get("q") || ""} autofocus />;
}

export function HomeSearch() {
  return (
    <Suspense fallback={<CommandSearch />}>
      <Inner />
    </Suspense>
  );
}
