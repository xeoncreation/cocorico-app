"use client";

import {useTranslations} from "next-intl";

export default function IntlText({ k, fallback }: { k: string; fallback?: string }) {
  const t = useTranslations();
  try {
    const str = t(k as any);
    return <>{str}</>;
  } catch {
    return <>{fallback ?? k}</>;
  }
}
