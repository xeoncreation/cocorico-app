"use client";
export default function SubscribeButton() {
  async function go() {
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const { url } = await res.json();
    window.location.href = url;
  }
  return (
    <button onClick={go} className="px-4 py-2 rounded bg-cocorico-red text-white font-semibold">
      Hazte Premium
    </button>
  );
}
