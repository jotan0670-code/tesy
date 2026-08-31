import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { mainAnimation } from './main-animation';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Filter,
  X,
  Grid3x3,
  Clock,
  List as ListIcon,
  CalendarDays,
} from 'lucide-react';

export type EventColor = 'blue' | 'red';

export interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  date: Date;
  color: EventColor;
  category: string;
  tags: string[];
}

export interface EnrolledClassInfo {
  code: string;
  subject: string;
  schedule: string;
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDate(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Checks a schedule string's leading day token (e.g. "TTh", "MWF", "F") against a JS day index. */
function scheduleMeetsOn(schedule: string, dayIndex: number): boolean {
  const dayToken = schedule.split(' ')[0];
  switch (dayIndex) {
    case 0: return dayToken.includes('Su');
    case 1: return dayToken.includes('M');
    case 2: return /T(?!h)/.test(dayToken);
    case 3: return dayToken.includes('W');
    case 4: return dayToken.includes('Th');
    case 5: return dayToken.includes('F');
    case 6: return /S(?!u)/.test(dayToken);
    default: return false;
  }
}

const CALENDAR_TODAY = new Date();

const AVAILABLE_TAGS = ['Exam', 'Quiz', 'Project', 'Deadline', 'Holiday', 'Meeting'];

/** Blue = due dates (deadlines/office dates). Red = assignments/projects tied to a class. */
const initialCalendarEvents: CalendarEvent[] = [
  { id: 1, title: 'Programming Exercise 3 due', description: 'Submit via the class portal before the deadline.', date: addDays(CALENDAR_TODAY, 1), color: 'red', category: 'CS101-A', tags: ['Deadline'] },
  { id: 2, title: 'Problem Set 5 due', description: 'Chapters 4-5 exercises.', date: addDays(CALENDAR_TODAY, 2), color: 'red', category: 'MATH204', tags: ['Deadline'] },
  { id: 3, title: 'Reflection Essay due', description: '750-word reflection on the assigned reading.', date: addDays(CALENDAR_TODAY, 4), color: 'red', category: 'ENG110', tags: ['Deadline'] },
  { id: 4, title: 'Enrollment deadline', description: 'Last day to enroll or adjust class load for the term.', date: addDays(CALENDAR_TODAY, 6), color: 'blue', category: 'General', tags: ['Deadline'] },
  { id: 5, title: 'Midterm week begins', description: 'Midterm examination period for all classes.', date: addDays(CALENDAR_TODAY, 10), color: 'blue', category: 'General', tags: ['Exam'] },
  { id: 6, title: 'Problem Set 4 checkpoint', description: 'Graded checkpoint quiz.', date: addDays(CALENDAR_TODAY, -3), color: 'red', category: 'MATH204', tags: ['Quiz'] },
  { id: 7, title: 'Tuition balance due', description: 'Settle remaining balance at the cashier.', date: addDays(CALENDAR_TODAY, -1), color: 'blue', category: 'General', tags: ['Deadline'] },
];

interface DraftEvent {
  title: string;
  description: string;
  date: string;
  color: EventColor;
  category: string;
  tags: string[];
}

function emptyDraft(dateISO: string): DraftEvent {
  return { title: '', description: '', date: dateISO, color: 'blue', category: 'General', tags: [] };
}

function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function FilterDropdown({
  label,
  options,
  selected,
  onToggle,
  isOpen,
  onOpenChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={() => onOpenChange(!isOpen)}
        className={cn(
          'flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors',
          selected.length > 0 && 'bg-white/25',
        )}
      >
        <Filter className="w-3.5 h-3.5" strokeWidth={1.5} />
        {label}
        {selected.length > 0 && (
          <span className="text-[10px] font-semibold bg-white text-neutral-900 rounded-full w-4 h-4 flex items-center justify-center">
            {selected.length}
          </span>
        )}
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => onOpenChange(false)} />
          <div className="absolute left-0 top-full mt-1.5 w-44 rounded-lg bg-neutral-800 border border-white/10 shadow-xl z-50 py-1.5 max-h-56 overflow-y-auto">
            {options.length === 0 ? (
              <p className="text-xs text-white/40 px-3 py-1.5">Nothing yet.</p>
            ) : (
              options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => onToggle(opt)}
                  className="w-full flex items-center gap-2 text-left text-xs px-3 py-1.5 hover:bg-white/10 transition-colors"
                >
                  <span
                    className={cn(
                      'w-3.5 h-3.5 rounded border border-white/30 flex items-center justify-center shrink-0',
                      selected.includes(opt) && 'bg-white border-white',
                    )}
                  >
                    {selected.includes(opt) && <span className="w-1.5 h-1.5 rounded-sm bg-neutral-900" />}
                  </span>
                  <span className="truncate">{opt}</span>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

function EventPill({
  event,
  onClick,
  draggable,
  onDragStart,
}: {
  event: CalendarEvent;
  onClick: () => void;
  draggable: boolean;
  onDragStart: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="relative">
      <div
        draggable={draggable}
        onDragStart={onDragStart}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          'text-[10px] font-medium px-1.5 py-0.5 rounded truncate cursor-pointer transition-transform',
          event.color === 'blue' ? 'bg-blue-500/80 hover:bg-blue-500' : 'bg-red-500/80 hover:bg-red-500',
          hovered && 'scale-[1.03]',
        )}
      >
        {event.title}
      </div>
      {hovered && (
        <div className="absolute left-0 top-full mt-1 w-56 z-50 rounded-lg bg-neutral-800 border border-white/10 shadow-xl p-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-semibold text-white leading-tight">{event.title}</p>
            <span className={cn('w-2 h-2 rounded-full mt-0.5 shrink-0', event.color === 'blue' ? 'bg-blue-400' : 'bg-red-400')} />
          </div>
          {event.description && <p className="text-[11px] text-white/60 mt-1 line-clamp-3">{event.description}</p>}
          <div className="flex flex-wrap gap-1 mt-2">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/70">{event.category}</span>
            {event.tags.map((t) => (
              <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function CalendarPage({ accountType, enrolledClasses }: { accountType: string; enrolledClasses: EnrolledClassInfo[] }) {
  const canCreate = accountType !== 'Student';

  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'list'>('month');
  const [cursorDate, setCursorDate] = useState(() => new Date(CALENDAR_TODAY.getFullYear(), CALENDAR_TODAY.getMonth(), CALENDAR_TODAY.getDate()));
  const [events, setEvents] = useState<CalendarEvent[]>(initialCalendarEvents);
  const [scheduleTab, setScheduleTab] = useState<'class' | 'today'>('class');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [openFilter, setOpenFilter] = useState<'colors' | 'tags' | 'categories' | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<DraftEvent>(emptyDraft(toISODate(CALENDAR_TODAY)));
  const [draftError, setDraftError] = useState('');
  const [draggedId, setDraggedId] = useState<number | null>(null);

  const categoryOptions = useMemo(() => {
    const set = new Set(events.map((e) => e.category));
    return [...set].sort();
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const hit =
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q));
        if (!hit) return false;
      }
      if (selectedColors.length > 0 && !selectedColors.includes(e.color)) return false;
      if (selectedTags.length > 0 && !e.tags.some((t) => selectedTags.includes(t))) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(e.category)) return false;
      return true;
    });
  }, [events, searchQuery, selectedColors, selectedTags, selectedCategories]);

  const hasActiveFilters = selectedColors.length > 0 || selectedTags.length > 0 || selectedCategories.length > 0 || searchQuery.length > 0;

  const clearFilters = () => {
    setSelectedColors([]);
    setSelectedTags([]);
    setSelectedCategories([]);
    setSearchQuery('');
  };

  const toggleIn = (list: string[], value: string) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const enrolledClassList = enrolledClasses;
  const todayClassList = enrolledClassList.filter((c) => scheduleMeetsOn(c.schedule, CALENDAR_TODAY.getDay()));
  const scheduleList = scheduleTab === 'class' ? enrolledClassList : todayClassList;

  const goPrev = () => {
    if (viewMode === 'month') setCursorDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    else if (viewMode === 'week') setCursorDate((d) => addDays(d, -7));
    else if (viewMode === 'day') setCursorDate((d) => addDays(d, -1));
  };
  const goNext = () => {
    if (viewMode === 'month') setCursorDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    else if (viewMode === 'week') setCursorDate((d) => addDays(d, 7));
    else if (viewMode === 'day') setCursorDate((d) => addDays(d, 1));
  };
  const goToday = () => setCursorDate(new Date(CALENDAR_TODAY.getFullYear(), CALENDAR_TODAY.getMonth(), CALENDAR_TODAY.getDate()));

  const openCreateDialog = (dateISO: string) => {
    if (!canCreate) return;
    setIsCreating(true);
    setEditingId(null);
    setDraft(emptyDraft(dateISO));
    setDraftError('');
    setIsDialogOpen(true);
  };

  const openEditDialog = (event: CalendarEvent) => {
    setIsCreating(false);
    setEditingId(event.id);
    setDraft({
      title: event.title,
      description: event.description,
      date: toISODate(event.date),
      color: event.color,
      category: event.category,
      tags: event.tags,
    });
    setDraftError('');
    setIsDialogOpen(true);
  };

  const closeDialog = () => setIsDialogOpen(false);

  const saveDraft = () => {
    if (!draft.title.trim() || !draft.date) {
      setDraftError('Enter a title and date.');
      return;
    }
    const [y, m, d] = draft.date.split('-').map(Number);
    const eventDate = new Date(y, m - 1, d);
    if (isCreating) {
      setEvents((prev) => [
        ...prev,
        { id: Date.now(), title: draft.title.trim(), description: draft.description.trim(), date: eventDate, color: draft.color, category: draft.category, tags: draft.tags },
      ]);
    } else if (editingId !== null) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editingId
            ? { ...e, title: draft.title.trim(), description: draft.description.trim(), date: eventDate, color: draft.color, category: draft.category, tags: draft.tags }
            : e,
        ),
      );
    }
    setIsDialogOpen(false);
  };

  const deleteEvent = () => {
    if (editingId === null) return;
    setEvents((prev) => prev.filter((e) => e.id !== editingId));
    setIsDialogOpen(false);
  };

  const rescheduleTo = (id: number, date: Date) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, date } : e)));
  };

  const categorySelectOptions = useMemo(() => {
    const set = new Set(['General', ...enrolledClasses.map((c) => c.code), draft.category]);
    return [...set].filter(Boolean).sort();
  }, [enrolledClasses, draft.category]);

  const monthStart = new Date(cursorDate.getFullYear(), cursorDate.getMonth(), 1);
  const monthGridStart = addDays(monthStart, -monthStart.getDay());
  const monthGridDays = Array.from({ length: 42 }, (_, i) => addDays(monthGridStart, i));
  const weekStart = addDays(cursorDate, -cursorDate.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const headerLabel =
    viewMode === 'month'
      ? cursorDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : viewMode === 'week'
        ? `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
        : viewMode === 'day'
          ? cursorDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
          : 'All Events';

  const todayBadgeMonth = CALENDAR_TODAY.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

  const sortedListEvents = [...filteredEvents].sort((a, b) => a.date.getTime() - b.date.getTime());
  const listGroups: { label: string; items: CalendarEvent[] }[] = [];
  for (const e of sortedListEvents) {
    const label = e.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const group = listGroups.find((g) => g.label === label);
    if (group) group.items.push(e);
    else listGroups.push({ label, items: [e] });
  }

  return (
    <div className="p-6 md:p-8 flex-1 min-h-0 flex flex-col overflow-hidden">
      <h2 className="text-2xl font-semibold text-foreground mb-4 shrink-0">Calendar</h2>
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 overflow-hidden">
        <div className="min-h-0 flex flex-col gap-3">
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setScheduleTab('class')}
              className={cn(
                'flex-1 text-xs font-semibold uppercase tracking-wide rounded-full px-3 py-2.5 transition-colors',
                scheduleTab === 'class'
                  ? 'bg-foreground text-background'
                  : 'bg-black/5 dark:bg-white/5 text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10',
              )}
            >
              Class Schedule
            </button>
            <button
              onClick={() => setScheduleTab('today')}
              className={cn(
                'flex-1 text-xs font-semibold uppercase tracking-wide rounded-full px-3 py-2.5 transition-colors',
                scheduleTab === 'today'
                  ? 'bg-foreground text-background'
                  : 'bg-black/5 dark:bg-white/5 text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10',
              )}
            >
              Today's Schedule
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <AnimatePresence mode="wait">
              <motion.div
                key={scheduleTab}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={mainAnimation.container}
                className="flex flex-col gap-2.5"
              >
                {scheduleList.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {scheduleTab === 'class' ? 'No enrolled classes yet.' : 'No classes scheduled today.'}
                  </p>
                ) : (
                  scheduleList.map((c) => (
                    <motion.div
                      key={c.code}
                      variants={mainAnimation.item}
                      className="rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 p-4 text-center shrink-0"
                    >
                      <p className="text-sm font-semibold text-foreground">{c.code}</p>
                      <p className="text-xs text-muted-foreground mt-1">{c.subject}</p>
                      <p className="text-xs text-muted-foreground mt-1">{c.schedule}</p>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="min-h-0 flex flex-col rounded-2xl bg-neutral-900 text-white overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 md:p-5 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex flex-col items-center justify-center leading-none shrink-0">
                <span className="text-[9px] font-semibold uppercase text-white/60">{todayBadgeMonth}</span>
                <span className="text-base font-bold">{CALENDAR_TODAY.getDate()}</span>
              </div>
              <p className="text-base font-semibold truncate">{headerLabel}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {viewMode !== 'list' && (
                <>
                  <button onClick={goPrev} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                    <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                  <button onClick={goToday} className="text-sm px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                    Today
                  </button>
                  <button onClick={goNext} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                    <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </>
              )}
              <div className="flex items-center gap-0.5 rounded-lg bg-white/10 p-0.5 ml-1">
                {(
                  [
                    { id: 'month', label: 'Month', icon: Grid3x3 },
                    { id: 'week', label: 'Week', icon: CalendarDays },
                    { id: 'day', label: 'Day', icon: Clock },
                    { id: 'list', label: 'List', icon: ListIcon },
                  ] as const
                ).map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setViewMode(v.id)}
                    className={cn(
                      'flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md transition-colors',
                      viewMode === v.id ? 'bg-white text-neutral-900' : 'text-white/70 hover:bg-white/10',
                    )}
                  >
                    <v.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span className="hidden sm:inline">{v.label}</span>
                  </button>
                ))}
              </div>
              {canCreate && (
                <button
                  onClick={() => openCreateDialog(toISODate(cursorDate))}
                  className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg bg-white text-neutral-900 hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" strokeWidth={2} />
                  New Event
                </button>
              )}
            </div>
          </div>

          <div className="p-3 md:p-4 border-b border-white/10 shrink-0 flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                className="w-full text-sm bg-white/10 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 outline-none focus:border-white/30 transition-colors placeholder:text-white/40"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <FilterDropdown
                label="Colors"
                options={['blue', 'red']}
                selected={selectedColors}
                onToggle={(v) => setSelectedColors((prev) => toggleIn(prev, v))}
                isOpen={openFilter === 'colors'}
                onOpenChange={(open) => setOpenFilter(open ? 'colors' : null)}
              />
              <FilterDropdown
                label="Tags"
                options={AVAILABLE_TAGS}
                selected={selectedTags}
                onToggle={(v) => setSelectedTags((prev) => toggleIn(prev, v))}
                isOpen={openFilter === 'tags'}
                onOpenChange={(open) => setOpenFilter(open ? 'tags' : null)}
              />
              <FilterDropdown
                label="Categories"
                options={categoryOptions}
                selected={selectedCategories}
                onToggle={(v) => setSelectedCategories((prev) => toggleIn(prev, v))}
                isOpen={openFilter === 'categories'}
                onOpenChange={(open) => setOpenFilter(open ? 'categories' : null)}
              />
              {hasActiveFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors px-2 py-1.5">
                  <X className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {viewMode === 'month' && (
              <div className="flex flex-col h-full">
                <div className="grid grid-cols-7 border-b border-white/10 shrink-0">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <div key={d} className="p-2 text-center text-[11px] font-medium text-white/50">
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 grid-rows-6 flex-1 min-h-[420px]">
                  {monthGridDays.map((day, i) => {
                    const dayEvents = filteredEvents.filter((e) => isSameDate(e.date, day));
                    const isCurrentMonth = day.getMonth() === cursorDate.getMonth();
                    const isToday = isSameDate(day, CALENDAR_TODAY);
                    return (
                      <div
                        key={i}
                        onClick={() => openCreateDialog(toISODate(day))}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => draggedId !== null && rescheduleTo(draggedId, day)}
                        className={cn(
                          'border-r border-b border-white/10 p-1.5 flex flex-col gap-1 overflow-hidden',
                          isCurrentMonth ? '' : 'opacity-30',
                          canCreate && 'cursor-pointer hover:bg-white/5',
                        )}
                      >
                        <span
                          className={cn(
                            'text-xs w-6 h-6 flex items-center justify-center rounded-full shrink-0',
                            isToday && 'bg-white text-neutral-900 font-semibold',
                          )}
                        >
                          {day.getDate()}
                        </span>
                        <div className="flex flex-col gap-0.5 min-h-0 overflow-hidden">
                          {dayEvents.slice(0, 3).map((e) => (
                            <EventPill
                              key={e.id}
                              event={e}
                              onClick={() => openEditDialog(e)}
                              draggable={canCreate}
                              onDragStart={() => setDraggedId(e.id)}
                            />
                          ))}
                          {dayEvents.length > 3 && <span className="text-[10px] text-white/40">+{dayEvents.length - 3} more</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {viewMode === 'week' && (
              <div className="grid grid-cols-7 h-full">
                {weekDays.map((day, i) => {
                  const dayEvents = filteredEvents.filter((e) => isSameDate(e.date, day));
                  const isToday = isSameDate(day, CALENDAR_TODAY);
                  return (
                    <div
                      key={i}
                      onClick={() => openCreateDialog(toISODate(day))}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => draggedId !== null && rescheduleTo(draggedId, day)}
                      className={cn('border-r border-white/10 p-2 flex flex-col gap-1.5', canCreate && 'cursor-pointer hover:bg-white/5')}
                    >
                      <div className="text-center shrink-0 mb-1">
                        <p className="text-[11px] text-white/50">{day.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                        <span
                          className={cn(
                            'text-sm w-7 h-7 rounded-full flex items-center justify-center mx-auto',
                            isToday && 'bg-white text-neutral-900 font-semibold',
                          )}
                        >
                          {day.getDate()}
                        </span>
                      </div>
                      {dayEvents.map((e) => (
                        <EventPill key={e.id} event={e} onClick={() => openEditDialog(e)} draggable={canCreate} onDragStart={() => setDraggedId(e.id)} />
                      ))}
                    </div>
                  );
                })}
              </div>
            )}

            {viewMode === 'day' && (
              <div className="p-4 flex flex-col gap-2">
                {filteredEvents.filter((e) => isSameDate(e.date, cursorDate)).length === 0 ? (
                  <p className="text-sm text-white/40">No events on this day.</p>
                ) : (
                  filteredEvents
                    .filter((e) => isSameDate(e.date, cursorDate))
                    .map((e) => (
                      <div
                        key={e.id}
                        onClick={() => openEditDialog(e)}
                        className="rounded-lg bg-white/5 hover:bg-white/10 transition-colors p-3 cursor-pointer flex items-start gap-3"
                      >
                        <span className={cn('w-2.5 h-2.5 rounded-full mt-1 shrink-0', e.color === 'blue' ? 'bg-blue-400' : 'bg-red-400')} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{e.title}</p>
                          {e.description && <p className="text-xs text-white/50 mt-0.5">{e.description}</p>}
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/70">{e.category}</span>
                            {e.tags.map((t) => (
                              <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            )}

            {viewMode === 'list' && (
              <div className="p-4 flex flex-col gap-5">
                {listGroups.length === 0 ? (
                  <p className="text-sm text-white/40">No events found.</p>
                ) : (
                  listGroups.map((group) => (
                    <div key={group.label}>
                      <h3 className="text-xs font-semibold text-white/50 mb-2">{group.label}</h3>
                      <div className="flex flex-col gap-2">
                        {group.items.map((e) => (
                          <div
                            key={e.id}
                            onClick={() => openEditDialog(e)}
                            className="rounded-lg bg-white/5 hover:bg-white/10 transition-colors p-3 cursor-pointer flex items-start gap-3"
                          >
                            <span className={cn('w-2.5 h-2.5 rounded-full mt-1 shrink-0', e.color === 'blue' ? 'bg-blue-400' : 'bg-red-400')} />
                            <div className="min-w-0">
                              <p className="text-sm font-medium">{e.title}</p>
                              {e.description && <p className="text-xs text-white/50 mt-0.5">{e.description}</p>}
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/70">{e.category}</span>
                                {e.tags.map((t) => (
                                  <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[10vh] bg-background/40 backdrop-blur-sm px-4">
          <div className="absolute inset-0" onClick={closeDialog} />
          <div className="relative w-full max-w-md bg-card border border-border/50 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[80vh] overflow-y-auto">
            <div className="p-5 border-b border-border/50">
              <h3 className="text-base font-semibold text-foreground">{isCreating ? 'Create Event' : 'Event Details'}</h3>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Title</label>
                <input
                  autoFocus
                  value={draft.title}
                  onChange={(e) => {
                    setDraft((d) => ({ ...d, title: e.target.value }));
                    if (draftError) setDraftError('');
                  }}
                  placeholder="Event title"
                  className="w-full mt-1.5 text-sm bg-background border border-border/50 rounded-lg px-3 py-2 outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Description</label>
                <textarea
                  value={draft.description}
                  onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                  placeholder="Event description"
                  rows={3}
                  className="w-full mt-1.5 text-sm bg-background border border-border/50 rounded-lg px-3 py-2 outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Date</label>
                  <input
                    type="date"
                    value={draft.date}
                    onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
                    className="w-full mt-1.5 text-sm bg-background border border-border/50 rounded-lg px-3 py-2 outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Category</label>
                  <select
                    value={draft.category}
                    onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                    className="w-full mt-1.5 text-sm bg-background border border-border/50 rounded-lg px-3 py-2 outline-none focus:border-primary/50 transition-colors"
                  >
                    {categorySelectOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Type</label>
                <div className="flex gap-2 mt-1.5">
                  <button
                    onClick={() => setDraft((d) => ({ ...d, color: 'blue' }))}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg border transition-colors',
                      draft.color === 'blue' ? 'bg-blue-500 text-white border-blue-500' : 'border-border/50 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5',
                    )}
                  >
                    <span className="w-2 h-2 rounded-full bg-current" />
                    Due date
                  </button>
                  <button
                    onClick={() => setDraft((d) => ({ ...d, color: 'red' }))}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg border transition-colors',
                      draft.color === 'red' ? 'bg-red-500 text-white border-red-500' : 'border-border/50 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5',
                    )}
                  >
                    <span className="w-2 h-2 rounded-full bg-current" />
                    Assignment/Project
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Tags</label>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {AVAILABLE_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setDraft((d) => ({ ...d, tags: toggleIn(d.tags, tag) }))}
                      className={cn(
                        'text-xs px-2.5 py-1 rounded-full border transition-colors',
                        draft.tags.includes(tag)
                          ? 'bg-foreground text-background border-foreground'
                          : 'border-border/50 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5',
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              {draftError && <p className="text-xs text-destructive">{draftError}</p>}
            </div>
            <div className="p-5 border-t border-border/50 flex items-center justify-between gap-2">
              {!isCreating ? (
                <button onClick={deleteEvent} className="text-xs font-medium px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors">
                  Delete
                </button>
              ) : (
                <span />
              )}
              <div className="flex items-center gap-2">
                <button onClick={closeDialog} className="text-xs font-medium px-3 py-2 rounded-lg border border-border/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button onClick={saveDraft} className="text-xs font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                  {isCreating ? 'Create' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
