import Link from "next/link";

type Props = {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
};

export default function LegalLayout({ title, updatedAt, children }: Props) {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <header className="space-y-2 mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-xs text-muted-foreground">
          Última actualización: {updatedAt}
        </p>
        <nav className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <Link href="/es/legal/terms" className="underline-offset-2 hover:underline">
            Términos y Condiciones
          </Link>
          <span>•</span>
          <Link href="/es/legal/privacy" className="underline-offset-2 hover:underline">
            Política de Privacidad
          </Link>
          <span>•</span>
          <Link href="/es/legal/cookies" className="underline-offset-2 hover:underline">
            Política de Cookies
          </Link>
          <span>•</span>
          <Link href="/es/legal/refunds" className="underline-offset-2 hover:underline">
            Política de Reembolsos
          </Link>
        </nav>
      </header>
      <article className="prose prose-sm dark:prose-invert max-w-none prose-headings:scroll-mt-24">
        {children}
      </article>
    </main>
  );
}
