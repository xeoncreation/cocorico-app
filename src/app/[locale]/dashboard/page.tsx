import DashboardClient from "@/components/dashboard/DashboardClient";
import { AppBackground } from "@/components/layout/AppBackground";

export default function DashboardPage() {
  return (
    <AppBackground variantOverride="dashboard">
      <DashboardClient />
    </AppBackground>
  );
}
