import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Ticket, Check, X } from 'lucide-react';
import { mainAnimation } from './main-animation';
import { departmentName } from '@/lib/campus-data';

export type TicketStatus = 'pending' | 'open' | 'closed';

export interface TicketMessage {
  id: number;
  from: 'student' | 'office';
  text: string;
  time: string;
}

export interface OfficeTicket {
  id: number;
  student: string;
  studentId: string;
  department: string;
  subject: string;
  status: TicketStatus;
  time: string;
  messages: TicketMessage[];
}

const initialTickets: OfficeTicket[] = [
  {
    id: 1,
    student: 'MABALA, JEFF AIVAN RECESIO',
    studentId: '2023-00456',
    department: 'bsit',
    subject: 'Missing grade in Calculus II',
    status: 'pending',
    time: '10 min ago',
    messages: [
      {
        id: 1,
        from: 'student',
        text: 'Good day. My Calculus II grade is still blank on my record. Can you check it?',
        time: '10 min ago',
      },
    ],
  },
  {
    id: 2,
    student: 'ALONZO, MARIA CLARA',
    studentId: '2023-00461',
    department: 'bsit',
    subject: 'Request for certificate of enrollment',
    status: 'open',
    time: '2 hours ago',
    messages: [
      { id: 1, from: 'student', text: 'I need a certificate of enrollment for my scholarship.', time: '2 hours ago' },
      { id: 2, from: 'office', text: 'Approved. Please claim it at the window tomorrow after 10 AM.', time: '1 hour ago' },
    ],
  },
  {
    id: 3,
    student: 'SANTIAGO, PAULO REY',
    studentId: '2022-00112',
    department: 'bsit',
    subject: 'Tuition balance question',
    status: 'closed',
    time: 'Yesterday',
    messages: [
      { id: 1, from: 'student', text: 'How much is my remaining balance?', time: 'Yesterday' },
      { id: 2, from: 'office', text: 'Your balance is ₱2,450. Settle it before the midterm exams.', time: 'Yesterday' },
    ],
  },
];

const STATUS_STYLES: Record<TicketStatus, string> = {
  pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  open: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  closed: 'bg-black/5 dark:bg-white/10 text-muted-foreground',
};

const STATUS_LABELS: Record<TicketStatus, string> = {
  pending: 'Pending approval',
  open: 'Approved',
  closed: 'Closed',
};

function StatusChip({ status }: { status: TicketStatus }) {
  return (
    <span
      className={`text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 shrink-0 ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

/**
 * The other half of the student ticket loop: a student opens a ticket, it lands
 * here as `pending`, and messaging only opens up once this office approves it.
 */
export function OfficeTicketsPage({ officeName }: { officeName: string }) {
  const [tickets, setTickets] = useState<OfficeTicket[]>(initialTickets);
  const [openId, setOpenId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | TicketStatus>('all');
  const [draft, setDraft] = useState('');

  const openTicket = tickets.find((t) => t.id === openId) ?? null;
  const visible = filter === 'all' ? tickets : tickets.filter((t) => t.status === filter);
  const pendingCount = tickets.filter((t) => t.status === 'pending').length;

  const setStatus = (id: number, status: TicketStatus) =>
    setTickets((all) => all.map((t) => (t.id === id ? { ...t, status } : t)));

  const reply = (id: number) => {
    const text = draft.trim();
    if (!text) return;
    setTickets((all) =>
      all.map((t) =>
        t.id === id
          ? { ...t, time: 'Just now', messages: [...t.messages, { id: Date.now(), from: 'office', text, time: 'Just now' }] }
          : t,
      ),
    );
    setDraft('');
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={mainAnimation.container}
      className="p-6 md:p-8 flex-1 min-h-0 flex flex-col overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {openTicket ? (
          <motion.div key="thread" variants={mainAnimation.item} className="flex-1 min-h-0 flex flex-col">
            <div className="flex items-center gap-3 pb-4 border-b border-border/50 shrink-0">
              <button
                onClick={() => {
                  setOpenId(null);
                  setDraft('');
                }}
                className="p-1.5 rounded-md text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                {openTicket.student.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{openTicket.subject}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {openTicket.student} · {openTicket.studentId} · {departmentName(openTicket.department)}
                </p>
              </div>
              <StatusChip status={openTicket.status} />
            </div>

            {openTicket.status === 'pending' && (
              <div className="flex items-center gap-2 py-3 border-b border-border/50 shrink-0">
                <p className="text-xs text-muted-foreground flex-1">
                  The student cannot message this office until the ticket is approved.
                </p>
                <button
                  onClick={() => setStatus(openTicket.id, 'open')}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <Check className="w-3.5 h-3.5" strokeWidth={2} />
                  Approve
                </button>
                <button
                  onClick={() => setStatus(openTicket.id, 'closed')}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={2} />
                  Decline
                </button>
              </div>
            )}

            <div className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-2 py-4">
              {openTicket.messages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.from === 'office' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${
                      m.from === 'office'
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-black/5 dark:bg-white/5 text-foreground rounded-bl-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-0.5 px-1">{m.time}</span>
                </div>
              ))}
            </div>

            {openTicket.status === 'open' && (
              <div className="flex gap-2 pt-3 border-t border-border/50 shrink-0">
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') reply(openTicket.id);
                  }}
                  placeholder={`Reply as ${officeName}…`}
                  className="flex-1 text-sm bg-background border border-border/50 rounded-lg px-3 py-2 outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  onClick={() => reply(openTicket.id)}
                  className="text-xs font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity shrink-0"
                >
                  Send
                </button>
                <button
                  onClick={() => setStatus(openTicket.id, 'closed')}
                  className="text-xs font-medium px-3 py-2 rounded-lg border border-border/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="list" variants={mainAnimation.item} className="flex-1 min-h-0 flex flex-col">
            <div className="flex items-center gap-4 mb-1 shrink-0">
              <h2 className="text-2xl font-semibold text-foreground">Tickets</h2>
              <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 rounded-lg p-1">
                {(['all', 'pending', 'open', 'closed'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => setFilter(option)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                      filter === option ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 shrink-0">
              {officeName} · {pendingCount} waiting for approval
            </p>

            <div className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-2">
              {visible.length === 0 ? (
                <div className="flex flex-col items-center text-center gap-2 py-12">
                  <Ticket className="w-8 h-8 text-muted-foreground/40" strokeWidth={1.5} />
                  <p className="text-sm text-muted-foreground">No {filter === 'all' ? '' : filter} tickets.</p>
                </div>
              ) : (
                visible.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setOpenId(t.id)}
                    className="w-full bg-card rounded-xl border border-border/50 shadow-sm p-4 flex gap-3 items-start cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                      {t.student.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-foreground truncate">{t.student}</span>
                        <span className="text-xs text-muted-foreground shrink-0">{t.time}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-sm text-foreground truncate">{t.subject}</p>
                        <StatusChip status={t.status} />
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {t.messages[t.messages.length - 1]?.text}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default OfficeTicketsPage;
