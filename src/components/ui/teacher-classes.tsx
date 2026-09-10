import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Plus, Copy, Check, Users, ClipboardList, GraduationCap } from 'lucide-react';
import { mainAnimation } from './main-animation';
import {
  departmentName,
  departments,
  initialTeacherClasses,
  type ClassAssignment,
  type TeacherClass,
} from '@/lib/campus-data';

/**
 * Join codes are what a student types into the Add Class form, so they have to
 * be unique across the school. Shape mirrors the seeded codes: SUBJ-SECTION.
 */
function generateJoinCode(subject: string, taken: string[]): string {
  const letters = subject.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 4) || 'CLS';
  for (let attempt = 0; attempt < 50; attempt++) {
    const suffix = Math.floor(100 + Math.random() * 900);
    const code = `${letters}${suffix}`;
    if (!taken.includes(code)) return code;
  }
  return `${letters}${Date.now().toString().slice(-4)}`;
}

function JoinCodeChip({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard?.writeText(code).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      title="Copy join code"
      className="flex items-center gap-1.5 text-[11px] font-mono font-semibold tracking-wider px-2.5 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors shrink-0"
    >
      {code}
      {copied ? <Check className="w-3 h-3" strokeWidth={2} /> : <Copy className="w-3 h-3" strokeWidth={2} />}
    </button>
  );
}

function CreateClassForm({
  taken,
  onCancel,
  onCreate,
}: {
  taken: string[];
  onCancel: () => void;
  onCreate: (cls: TeacherClass) => void;
}) {
  const [subject, setSubject] = useState('');
  const [section, setSection] = useState('');
  const [schedule, setSchedule] = useState('');
  const [room, setRoom] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (!subject.trim()) {
      setError('Enter a subject name.');
      return;
    }
    if (!section.trim()) {
      setError('Enter a section.');
      return;
    }
    onCreate({
      code: generateJoinCode(subject, taken),
      subject: subject.trim(),
      section: section.trim(),
      schedule: schedule.trim() || 'Schedule TBA',
      room: room.trim() || 'Room TBA',
      students: [],
      assignments: [],
    });
  };

  return (
    <div className="w-full bg-card rounded-xl border border-border/50 shadow-sm p-4 mb-4 shrink-0">
      <p className="text-sm font-semibold text-foreground mb-3">New digital classroom</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Subject</label>
          <input
            autoFocus
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              setError('');
            }}
            placeholder="e.g. Web Development"
            className="w-full mt-1 text-sm bg-background border border-border/50 rounded-lg px-3 py-2 outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Section</label>
          <input
            value={section}
            onChange={(e) => {
              setSection(e.target.value);
              setError('');
            }}
            placeholder="e.g. IT-3A"
            className="w-full mt-1 text-sm bg-background border border-border/50 rounded-lg px-3 py-2 outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Schedule</label>
          <input
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            placeholder="e.g. MWF 8:00–9:00 AM"
            className="w-full mt-1 text-sm bg-background border border-border/50 rounded-lg px-3 py-2 outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Room</label>
          <input
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="e.g. Comp Lab 2"
            className="w-full mt-1 text-sm bg-background border border-border/50 rounded-lg px-3 py-2 outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>
      {error && <p className="text-xs text-destructive mt-2">{error}</p>}
      <div className="flex gap-2 mt-3">
        <button
          onClick={onCancel}
          className="text-xs font-medium px-3 py-2 rounded-lg border border-border/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          className="text-xs font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Create class
        </button>
      </div>
      <p className="text-[11px] text-muted-foreground mt-2">
        A join code is generated on create — share it with students so they can add the class.
      </p>
    </div>
  );
}

function AssignmentForm({
  onCancel,
  onCreate,
}: {
  onCancel: () => void;
  onCreate: (assignment: Omit<ClassAssignment, 'id' | 'submitted'>) => void;
}) {
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [due, setDue] = useState('');
  const [points, setPoints] = useState('20');
  const [error, setError] = useState('');

  return (
    <div className="w-full bg-card rounded-xl border border-border/50 shadow-sm p-4 mb-3 shrink-0">
      <p className="text-sm font-semibold text-foreground mb-3">New assignment / activity</p>
      <div className="flex flex-col gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Title</label>
          <input
            autoFocus
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError('');
            }}
            placeholder="e.g. Machine Problem 1"
            className="w-full mt-1 text-sm bg-background border border-border/50 rounded-lg px-3 py-2 outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Instructions</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={3}
            placeholder="What should the students do?"
            className="w-full mt-1 text-sm bg-background border border-border/50 rounded-lg px-3 py-2 outline-none focus:border-primary/50 transition-colors resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Due</label>
            <input
              value={due}
              onChange={(e) => setDue(e.target.value)}
              placeholder="e.g. Friday, 11:59 PM"
              className="w-full mt-1 text-sm bg-background border border-border/50 rounded-lg px-3 py-2 outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Points</label>
            <input
              value={points}
              inputMode="numeric"
              onChange={(e) => setPoints(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full mt-1 text-sm bg-background border border-border/50 rounded-lg px-3 py-2 outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
      </div>
      {error && <p className="text-xs text-destructive mt-2">{error}</p>}
      <div className="flex gap-2 mt-3">
        <button
          onClick={onCancel}
          className="text-xs font-medium px-3 py-2 rounded-lg border border-border/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (!title.trim()) {
              setError('Enter an assignment title.');
              return;
            }
            onCreate({
              title: title.trim(),
              instructions: instructions.trim() || 'No instructions provided.',
              due: due.trim() || 'No due date',
              points: Number(points) || 0,
            });
          }}
          className="text-xs font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Assign
        </button>
      </div>
    </div>
  );
}

function ClassDetail({
  cls,
  onBack,
  onAddAssignment,
}: {
  cls: TeacherClass;
  onBack: () => void;
  onAddAssignment: (assignment: Omit<ClassAssignment, 'id' | 'submitted'>) => void;
}) {
  const [tab, setTab] = useState<'assignments' | 'roster'>('assignments');
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="flex items-center gap-3 pb-4 border-b border-border/50 shrink-0">
        <button
          onClick={onBack}
          className="p-1.5 rounded-md text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{cls.subject}</p>
          <p className="text-xs text-muted-foreground truncate">
            {cls.section} · {cls.schedule} · {cls.room}
          </p>
        </div>
        <JoinCodeChip code={cls.code} />
      </div>

      <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 rounded-lg p-1 my-4 w-fit shrink-0">
        <button
          onClick={() => setTab('assignments')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            tab === 'assignments' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5" strokeWidth={1.5} />
          Assignments ({cls.assignments.length})
        </button>
        <button
          onClick={() => setTab('roster')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            tab === 'roster' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
          Roster ({cls.students.length})
        </button>
      </div>

      {tab === 'assignments' && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 mb-3 rounded-lg border border-border/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors w-fit shrink-0"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2} />
          Assign activity
        </button>
      )}

      {tab === 'assignments' && showForm && (
        <AssignmentForm
          onCancel={() => setShowForm(false)}
          onCreate={(assignment) => {
            onAddAssignment(assignment);
            setShowForm(false);
          }}
        />
      )}

      <div className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-2">
        {tab === 'assignments' ? (
          cls.assignments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No assignments yet. Assign one to get started.</p>
          ) : (
            cls.assignments.map((a) => (
              <div key={a.id} className="w-full bg-card rounded-xl border border-border/50 shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{a.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{a.instructions}</p>
                  </div>
                  <span className="text-[11px] text-muted-foreground shrink-0 text-right">{a.due}</span>
                </div>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/50">
                  <span className="text-[11px] text-muted-foreground">{a.points} pts</span>
                  <span className="text-[11px] text-muted-foreground">
                    {a.submitted}/{cls.students.length} submitted
                  </span>
                </div>
              </div>
            ))
          )
        ) : cls.students.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No students yet. Share the join code <span className="font-mono font-semibold">{cls.code}</span> so they can add
            this class.
          </p>
        ) : (
          cls.students.map((s) => (
            <div
              key={s.id}
              className="w-full bg-card rounded-xl border border-border/50 shadow-sm p-4 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                {s.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {s.id} · {departmentName(s.department)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function TeacherClassesPage() {
  const [classes, setClasses] = useState<TeacherClass[]>(initialTeacherClasses);
  const [openCode, setOpenCode] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const openClass = classes.find((c) => c.code === openCode) ?? null;

  const addAssignment = (code: string, assignment: Omit<ClassAssignment, 'id' | 'submitted'>) => {
    setClasses((all) =>
      all.map((c) =>
        c.code === code
          ? { ...c, assignments: [...c.assignments, { ...assignment, id: Date.now(), submitted: 0 }] }
          : c,
      ),
    );
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
        {openClass ? (
          <motion.div key="detail" variants={mainAnimation.item} className="flex-1 min-h-0 flex flex-col">
            <ClassDetail
              cls={openClass}
              onBack={() => setOpenCode(null)}
              onAddAssignment={(assignment) => addAssignment(openClass.code, assignment)}
            />
          </motion.div>
        ) : (
          <motion.div key="list" variants={mainAnimation.item} className="flex-1 min-h-0 flex flex-col">
            <div className="flex items-start justify-between gap-3 mb-1 shrink-0">
              <h2 className="text-2xl font-semibold text-foreground">My Classes</h2>
              <button
                onClick={() => setShowCreate((v) => !v)}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
              >
                {showCreate ? 'Cancel' : <><Plus className="w-3.5 h-3.5" strokeWidth={2} /> Create class</>}
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4 shrink-0">
              {classes.length} classroom{classes.length === 1 ? '' : 's'} ·{' '}
              {classes.reduce((n, c) => n + c.students.length, 0)} students total
            </p>

            {showCreate && (
              <CreateClassForm
                taken={classes.map((c) => c.code)}
                onCancel={() => setShowCreate(false)}
                onCreate={(cls) => {
                  setClasses((all) => [...all, cls]);
                  setShowCreate(false);
                  setOpenCode(cls.code);
                }}
              />
            )}

            <div className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] grid grid-cols-1 md:grid-cols-2 gap-3 content-start">
              {classes.map((c) => (
                <div
                  key={c.code}
                  onClick={() => setOpenCode(c.code)}
                  className="bg-card rounded-xl border border-border/50 shadow-sm p-4 cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{c.subject}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {c.section} · {c.room}
                      </p>
                    </div>
                    <JoinCodeChip code={c.code} />
                  </div>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/50 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" strokeWidth={1.5} />
                      {c.students.length} students
                    </span>
                    <span className="flex items-center gap-1">
                      <ClipboardList className="w-3 h-3" strokeWidth={1.5} />
                      {c.assignments.length} assignments
                    </span>
                    <span className="ml-auto">{c.schedule}</span>
                  </div>
                </div>
              ))}
              {classes.length === 0 && (
                <div className="col-span-full flex flex-col items-center text-center gap-2 py-12">
                  <GraduationCap className="w-8 h-8 text-muted-foreground/40" strokeWidth={1.5} />
                  <p className="text-sm text-muted-foreground">
                    No classrooms yet. Create one and share its join code with your students.
                  </p>
                </div>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground mt-3 shrink-0">
              Departments available for enrollment: {departments.map((d) => d.short).join(', ')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default TeacherClassesPage;
