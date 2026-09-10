import { useState, type ElementType } from 'react';
import { GraduationCap, Shield, BookOpen, Building2, ChevronLeft } from 'lucide-react';
import { offices, type Role } from '@/lib/campus-data';

export interface DemoAccount {
  name: string;
  type: Role;
}

interface RoleOption {
  type: Role;
  icon: ElementType;
  description: string;
  accounts: { name: string; detail: string }[];
}

/**
 * Every role signs in as its own account — the identity picked here decides
 * which nav tree and which pages the dashboard renders.
 */
const roleOptions: RoleOption[] = [
  {
    type: 'Student',
    icon: GraduationCap,
    description: 'View announcements, open tickets, join classes',
    accounts: [
      { name: 'MABALA, JEFF AIVAN RECESIO', detail: '2023-00456 · BSIT 2nd Year' },
      { name: 'ALONZO, MARIA CLARA', detail: '2023-00461 · BSIT 2nd Year' },
    ],
  },
  {
    type: 'Teacher',
    icon: BookOpen,
    description: 'Run digital classrooms and set deadlines',
    accounts: [
      { name: 'SANTOS, RONALD B.', detail: 'Faculty · BS Information Technology' },
      { name: 'CRUZ, MARILOU P.', detail: 'Faculty · BS Secondary Education' },
    ],
  },
  {
    type: 'Office',
    icon: Building2,
    description: 'Post announcements and answer student tickets',
    accounts: offices.map((office) => ({ name: office.name, detail: 'Office staff account' })),
  },
  {
    type: 'Admin',
    icon: Shield,
    description: 'Approve, suspend and manage staff accounts',
    accounts: [{ name: 'System Administrator', detail: 'Full user management access' }],
  },
];

export default function LoginPage({ onLogin }: { onLogin: (account: DemoAccount) => void }) {
  const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null);

  return (
    <div className="flex items-center justify-center w-full h-screen bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-sm">
            NC
          </div>
          <h1 className="text-xl font-semibold text-foreground">NotiCampus</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedRole ? `Choose a ${selectedRole.type.toLowerCase()} account` : 'Stay Informed. Stay Engaged.'}
          </p>
        </div>

        {selectedRole ? (
          <>
            <button
              onClick={() => setSelectedRole(null)}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-3"
            >
              <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2} />
              All roles
            </button>
            <div className="flex flex-col gap-2">
              {selectedRole.accounts.map((account) => (
                <button
                  key={account.name}
                  onClick={() => onLogin({ name: account.name, type: selectedRole.type })}
                  className="w-full flex items-center gap-3 p-4 bg-card rounded-xl border border-border/50 shadow-sm hover:bg-black/[0.02] dark:hover:bg-white/[0.02] hover:border-border transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 text-sm font-semibold">
                    {account.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{account.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{account.detail}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2">
            {roleOptions.map((role) => (
              <button
                key={role.type}
                onClick={() => setSelectedRole(role)}
                className="w-full flex items-center gap-3 p-4 bg-card rounded-xl border border-border/50 shadow-sm hover:bg-black/[0.02] dark:hover:bg-white/[0.02] hover:border-border transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <role.icon className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{role.type}</p>
                  <p className="text-xs text-muted-foreground truncate">{role.description}</p>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground bg-black/5 dark:bg-white/5 rounded-full px-2 py-1 shrink-0">
                  {role.accounts.length}
                </span>
              </button>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-6">
          Each role signs in to its own pages. Accounts are demo data — no backend yet.
        </p>
      </div>
    </div>
  );
}
