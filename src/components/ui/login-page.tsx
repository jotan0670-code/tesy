import type { ElementType } from 'react';
import { GraduationCap, Shield, BookOpen, Building2 } from 'lucide-react';

export interface DemoAccount {
  name: string;
  type: 'Student' | 'Teacher' | 'Office' | 'Admin';
}

const demoAccounts: (DemoAccount & { icon: ElementType; description: string })[] = [
  {
    name: 'MABALA, JEFF AIVAN RECESIO',
    type: 'Student',
    icon: GraduationCap,
    description: 'Student account',
  },
  {
    name: 'Teacher Account',
    type: 'Teacher',
    icon: BookOpen,
    description: 'Teacher account',
  },
  {
    name: 'Office Account',
    type: 'Office',
    icon: Building2,
    description: 'Office staff account',
  },
  {
    name: 'Admin Account',
    type: 'Admin',
    icon: Shield,
    description: 'Administrator account',
  },
];

export default function LoginPage({ onLogin }: { onLogin: (account: DemoAccount) => void }) {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-sm">
            SJ
          </div>
          <h1 className="text-xl font-semibold text-foreground">Sign in</h1>
          <p className="text-sm text-muted-foreground mt-1">Choose a demo account to continue</p>
        </div>

        <div className="flex flex-col gap-2">
          {demoAccounts.map((account) => (
            <button
              key={account.type}
              onClick={() => onLogin({ name: account.name, type: account.type })}
              className="w-full flex items-center gap-3 p-4 bg-card rounded-xl border border-border/50 shadow-sm hover:bg-black/[0.02] dark:hover:bg-white/[0.02] hover:border-border transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <account.icon className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{account.name}</p>
                <p className="text-xs text-muted-foreground">{account.description}</p>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground bg-black/5 dark:bg-white/5 rounded-full px-2 py-1 shrink-0">
                {account.type}
              </span>
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Every demo account currently shares the same pages. Student is the account being worked on first.
        </p>
      </div>
    </div>
  );
}
