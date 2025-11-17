import ProfileClient from "./profile-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perfil | Cocorico",
  description: "Edita tu información personal, avatar y preferencias.",
};

export default function ProfilePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <ProfileClient />
    </main>
  );
}
