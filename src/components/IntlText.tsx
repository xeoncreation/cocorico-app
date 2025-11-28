"use client";

import {useTranslations} from "next-intl";

export default function IntlText({ k, fallback }: { k: string; fallback?: string }) {
  // useTranslations will throw if there is no NextIntl context (for top-level routes
  // that don't use the /[locale] provider). Wrap the hook and use a safe fallback.
  let t: ((k: string) => string) = (s) => s;
  try {
    const tt = useTranslations();
    t = tt;
  } catch {
    t = (s) => s;
  }

  try {
    const str = t(k as any);
    return <>{str}</>;
  } catch {
    return <>{fallback ?? k}</>;
  }
}
