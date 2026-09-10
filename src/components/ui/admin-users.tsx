import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Pause, Play, Trash2, Pencil, ShieldCheck, ClipboardList, Users } from 'lucide-react';
import { mainAnimation } from './main-animation';
import { initialManagedAccounts, type ManagedAccount } from '@/lib/campus-data';

export type AdminView = 'accounts' | 'pending' | 'activity';

interface LogEntry {
  id: number;
  text: string;
  time: string;
}

const STATUS_STYLES: Record<ManagedAccount['status'], string> = {
  pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  suspended: 'bg-destructive/10 text-destructive',
};

function StatusChip({ status }: { status: ManagedAccount['status'] }) {
  return (
    <span
      className={`text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 shrink-0 ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

function IconAction({
  title,
  onClick,
  danger,
  children,
}: {
  title: string;
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded-md text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
        danger ? 'hover:text-destructive' : 'hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
}

function EditRow({
  account,
  onCancel,
  onSave,
}: {
  account: ManagedAccount;
  onCancel: () => void;
  onSave: (patch: Pick<ManagedAccount, 'name' | 'email' | 'assignment'>) => void;
}) {
  const [name, setName] = useState(account.name);
  const [email, setEmail] = useState(account.email);
  const [assignment, setAssignment] = useState(account.assignment);

  return (
    <div className="w-full bg-card rounded-xl border border-primary/30 shadow-sm p-4">
      <p className="text-sm font-semibold text-foreground mb-3">Edit account</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Name</label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 text-sm bg-background border border-border/50 rounded-lg px-3 py-2 outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 text-sm bg-background border border-border/50 rounded-lg px-3 py-2 outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            {account.role === 'Teacher' ? 'Department' : 'Office'}
          </label>
          <input
            value={assignment}
            onChange={(e) => setAssignment(e.target.value)}
            className="w-full mt-1 text-sm bg-background border border-border/50 rounded-lg px-3 py-2 outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={onCancel}
          className="text-xs font-medium px-3 py-2 rounded-lg border border-border/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave({ name: name.trim() || account.name, email: email.trim(), assignment: assignment.trim() })}
          className="text-xs font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}

/**
 * Admin's only surface. Teacher and Office accounts land here as `pending` when
 * they register; nothing they do works until an admin approves them.
 */
export function AdminUsersPage({ view }: { view: AdminView }) {
  const [accounts, setAccounts] = useState<ManagedAccount[]>(initialManagedAccounts);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [roleFilter, setRoleFilter] = useState<'All' | ManagedAccount['role']>('All');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const record = (text: string) => setLog((entries) => [{ id: Date.now(), text, time: 'Just now' }, ...entries]);

  const setStatus = (account: ManagedAccount, status: ManagedAccount['status'], verb: string) => {
    setAccounts((all) => all.map((a) => (a.id === account.id ? { ...a, status } : a)));
    record(`${verb} ${account.role.toLowerCase()} account "${account.name}".`);
  };

  const remove = (account: ManagedAccount) => {
    setAccounts((all) => all.filter((a) => a.id !== account.id));
    setConfirmDeleteId(null);
    record(`Deleted ${account.role.toLowerCase()} account "${account.name}".`);
  };

  const pending = accounts.filter((a) => a.status === 'pending');
  const listed =
    view === 'pending' ? pending : roleFilter === 'All' ? accounts : accounts.filter((a) => a.role === roleFilter);

  const heading =
    view === 'pending' ? 'Pending Approval' : view === 'activity' ? 'Activity Log' : 'All Accounts';

  const subtitle =
    view === 'pending'
      ? `${pending.length} account${pending.length === 1 ? '' : 's'} waiting for approval`
      : view === 'activity'
        ? `${log.length} action${log.length === 1 ? '' : 's'} this session`
        : `${accounts.length} teacher and office accounts · ${pending.length} pending`;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={mainAnimation.container}
      className="p-6 md:p-8 flex-1 min-h-0 flex flex-col overflow-hidden"
    >
      <motion.div variants={mainAnimation.item} className="shrink-0">
        <div className="flex items-center gap-4 mb-1">
          <h2 className="text-2xl font-semibold text-foreground">{heading}</h2>
          {view === 'accounts' && (
            <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 rounded-lg p-1">
              {(['All', 'Teacher', 'Office'] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setRoleFilter(option)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    roleFilter === option ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>
      </motion.div>

      <motion.div
        variants={mainAnimation.item}
        className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-2"
      >
        {view === 'activity' ? (
          log.length === 0 ? (
            <div className="flex flex-col items-center text-center gap-2 py-12">
              <ClipboardList className="w-8 h-8 text-muted-foreground/40" strokeWidth={1.5} />
              <p className="text-sm text-muted-foreground">
                No actions yet. Approving, suspending, editing or deleting an account records it here.
              </p>
            </div>
          ) : (
            log.map((entry) => (
              <div key={entry.id} className="w-full bg-card rounded-xl border border-border/50 shadow-sm p-4">
                <p className="text-sm text-foreground">{entry.text}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{entry.time}</p>
              </div>
            ))
          )
        ) : listed.length === 0 ? (
          <div className="flex flex-col items-center text-center gap-2 py-12">
            {view === 'pending' ? (
              <ShieldCheck className="w-8 h-8 text-muted-foreground/40" strokeWidth={1.5} />
            ) : (
              <Users className="w-8 h-8 text-muted-foreground/40" strokeWidth={1.5} />
            )}
            <p className="text-sm text-muted-foreground">
              {view === 'pending' ? 'Nothing waiting for approval.' : 'No accounts match this filter.'}
            </p>
          </div>
        ) : (
          listed.map((account) =>
            editingId === account.id ? (
              <EditRow
                key={account.id}
                account={account}
                onCancel={() => setEditingId(null)}
                onSave={(patch) => {
                  setAccounts((all) => all.map((a) => (a.id === account.id ? { ...a, ...patch } : a)));
                  setEditingId(null);
                  record(`Edited ${account.role.toLowerCase()} account "${patch.name}".`);
                }}
              />
            ) : (
              <div
                key={account.id}
                className="w-full bg-card rounded-xl border border-border/50 shadow-sm p-4 flex gap-3 items-center"
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                  {account.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-foreground truncate">{account.name}</p>
                    <StatusChip status={account.status} />
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground bg-black/5 dark:bg-white/5 rounded-full px-2 py-0.5">
                      {account.role}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {account.email} · {account.assignment}
                  </p>
                </div>

                {confirmDeleteId === account.id ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground">Delete permanently?</span>
                    <button
                      onClick={() => remove(account)}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg bg-destructive text-white hover:opacity-90 transition-opacity"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-0.5 shrink-0">
                    {account.status === 'pending' && (
                      <>
                        <IconAction title="Approve" onClick={() => setStatus(account, 'active', 'Approved')}>
                          <Check className="w-4 h-4" strokeWidth={2} />
                        </IconAction>
                        <IconAction title="Reject" danger onClick={() => setStatus(account, 'suspended', 'Rejected')}>
                          <X className="w-4 h-4" strokeWidth={2} />
                        </IconAction>
                      </>
                    )}
                    {account.status === 'active' && (
                      <IconAction title="Suspend" onClick={() => setStatus(account, 'suspended', 'Suspended')}>
                        <Pause className="w-4 h-4" strokeWidth={1.5} />
                      </IconAction>
                    )}
                    {account.status === 'suspended' && (
                      <IconAction title="Activate" onClick={() => setStatus(account, 'active', 'Activated')}>
                        <Play className="w-4 h-4" strokeWidth={1.5} />
                      </IconAction>
                    )}
                    <IconAction title="Edit" onClick={() => setEditingId(account.id)}>
                      <Pencil className="w-4 h-4" strokeWidth={1.5} />
                    </IconAction>
                    <IconAction title="Delete" danger onClick={() => setConfirmDeleteId(account.id)}>
                      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    </IconAction>
                  </div>
                )}
              </div>
            ),
          )
        )}
      </motion.div>
    </motion.div>
  );
}

export default AdminUsersPage;
