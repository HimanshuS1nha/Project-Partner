import Navbar from "@/components/dashboard/Navbar";
import UpgradePlanDialog from "@/components/dashboard/UpgradePlanDialog";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <UpgradePlanDialog />
    </>
  );
}
