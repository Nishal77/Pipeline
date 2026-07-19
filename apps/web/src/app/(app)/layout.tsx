import PushAndInstallBanner from "./PushAndInstallBanner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PushAndInstallBanner />
      {children}
    </>
  );
}
