"use client";
export default function ManageBillingButton() {
  async function go() {
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const { url } = await res.json();
    window.location.href = url;
  }
  return (
    <button onClick={go} className="px-4 py-2 rounded border border-cocorico-red text-cocorico-red">
      Gestionar facturación
    </button>
  );
}
