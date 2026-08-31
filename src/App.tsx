import { useState } from "react";
import SidebarNavPreview from "@/components/ui/dashboard-sidebar";
import LoginPage, { type DemoAccount } from "@/components/ui/login-page";

export default function App() {
  const [account, setAccount] = useState<DemoAccount | null>(null);

  if (!account) {
    return <LoginPage onLogin={setAccount} />;
  }

  return (
    <SidebarNavPreview
      accountName={account.name}
      accountType={account.type}
      onLogout={() => setAccount(null)}
    />
  );
}
