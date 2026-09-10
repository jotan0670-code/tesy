import { useState } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Globe2, Users, Plus, Trash2 } from 'lucide-react';
import { mainAnimation } from './main-animation';
import {
  departmentName,
  departments,
  initialOfficeAnnouncements,
  type Announcement,
} from '@/lib/campus-data';

function AudienceChip({ audience }: { audience: Announcement['audience'] }) {
  const isGeneral = audience === 'General';
  return (
    <span
      className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 shrink-0 ${
        isGeneral
          ? 'bg-primary/10 text-primary'
          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
      }`}
    >
      {isGeneral ? <Globe2 className="w-3 h-3" strokeWidth={2} /> : <Users className="w-3 h-3" strokeWidth={2} />}
      {isGeneral ? 'General' : departmentName(audience)}
    </span>
  );
}

/**
 * The office-side composer. `Individual` means one department's students see
 * the post; `General` puts it on every student's Home feed.
 */
export function OfficeAnnouncePage({ officeName }: { officeName: string }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialOfficeAnnouncements);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [kind, setKind] = useState<'General' | 'Individual'>('General');
  const [department, setDepartment] = useState(departments[0].id);
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});

  const resetForm = () => {
    setTitle('');
    setBody('');
    setKind('General');
    setDepartment(departments[0].id);
    setErrors({});
  };

  const publish = () => {
    const nextErrors: { title?: string; body?: string } = {};
    if (!title.trim()) nextErrors.title = 'Enter a title.';
    if (!body.trim()) nextErrors.body = 'Write the announcement body.';
    if (nextErrors.title || nextErrors.body) {
      setErrors(nextErrors);
      return;
    }
    setAnnouncements((all) => [
      {
        id: Date.now(),
        title: title.trim(),
        body: body.trim(),
        office: officeName,
        audience: kind === 'General' ? 'General' : department,
        postedAt: 'Just now',
      },
      ...all,
    ]);
    resetForm();
    setShowForm(false);
  };

  const mine = announcements.filter((a) => a.office === officeName);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={mainAnimation.container}
      className="p-6 md:p-8 flex-1 min-h-0 flex flex-col overflow-hidden"
    >
      <motion.div variants={mainAnimation.item} className="shrink-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h2 className="text-2xl font-semibold text-foreground">Announcements</h2>
          <button
            onClick={() => {
              setShowForm((v) => !v);
              resetForm();
            }}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
          >
            {showForm ? 'Cancel' : <><Plus className="w-3.5 h-3.5" strokeWidth={2} /> Create announcement</>}
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {officeName} · {mine.length} posted by this office
        </p>
      </motion.div>

      {showForm && (
        <div className="w-full bg-card rounded-xl border border-border/50 shadow-sm p-4 mb-4 shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <Megaphone className="w-4 h-4 text-primary" strokeWidth={1.5} />
            <p className="text-sm font-semibold text-foreground">New announcement</p>
          </div>

          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 rounded-lg p-1 w-fit mb-3">
            {(['General', 'Individual'] as const).map((option) => (
              <button
                key={option}
                onClick={() => setKind(option)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  kind === option ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {option === 'General' ? <Globe2 className="w-3.5 h-3.5" strokeWidth={1.5} /> : <Users className="w-3.5 h-3.5" strokeWidth={1.5} />}
                {option}
              </button>
            ))}
          </div>

          {kind === 'Individual' && (
            <div className="mb-3">
              <label className="text-xs font-medium text-muted-foreground">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full mt-1 text-sm bg-background border border-border/50 rounded-lg px-3 py-2 outline-none focus:border-primary/50 transition-colors"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-3">
            <label className="text-xs font-medium text-muted-foreground">Title</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((err) => ({ ...err, title: undefined }));
              }}
              placeholder="e.g. Enrollment extension"
              className="w-full mt-1 text-sm bg-background border border-border/50 rounded-lg px-3 py-2 outline-none focus:border-primary/50 transition-colors"
            />
            {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Body</label>
            <textarea
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                if (errors.body) setErrors((err) => ({ ...err, body: undefined }));
              }}
              rows={4}
              placeholder="What do the students need to know?"
              className="w-full mt-1 text-sm bg-background border border-border/50 rounded-lg px-3 py-2 outline-none focus:border-primary/50 transition-colors resize-none"
            />
            {errors.body && <p className="text-xs text-destructive mt-1">{errors.body}</p>}
          </div>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={publish}
              className="text-xs font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Post announcement
            </button>
            <p className="text-[11px] text-muted-foreground">
              {kind === 'General'
                ? 'Every student sees this on their Home feed.'
                : `Only ${departmentName(department)} students see this.`}
            </p>
          </div>
        </div>
      )}

      <motion.div
        variants={mainAnimation.item}
        className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-2"
      >
        {announcements.map((a) => (
          <div key={a.id} className="w-full bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
            {a.image && <img src={a.image} alt={a.title} className="w-full h-36 object-cover" />}
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground">{a.title}</p>
                    <AudienceChip audience={a.audience} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{a.body}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-muted-foreground">{a.postedAt}</span>
                  {a.office === officeName && (
                    <button
                      onClick={() => setAnnouncements((all) => all.filter((x) => x.id !== a.id))}
                      title="Delete announcement"
                      className="p-1.5 rounded-md text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground mt-3 pt-3 border-t border-border/50">{a.office}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default OfficeAnnouncePage;
