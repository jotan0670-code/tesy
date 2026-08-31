import React, { useState, useEffect } from 'react';
import {
  Search,
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  LogOut,
  Hash,
  ChevronDown,
  ChevronLeft,
  CalendarClock,
  History,
  ChevronRight,
  Inbox,
  Calendar,
  Activity,
  GraduationCap,
  Terminal,
  Blocks,
  Bell,
  Megaphone,
  Ticket,
  TicketCheck,
  Mail,
  PanelLeftClose,
  PanelLeftOpen,
  Command,
  X,
  Plus,
  UserCircle
} from 'lucide-react';
import { CoverflowCarousel, type CoverflowSlide } from './coverflow-carousel';
import { type iCardItem } from './cards-parallax';
import { Carousel, CarouselControl, type SlideData } from './carousel-3d';
import { CalendarPage } from './calendar-page';
import { ProjectShowcase, projects as showcaseProjects, type Project } from './project-showcase';
import { ProjectDetailView, buildProjectDetail } from './project-detail-view';
import { motion, AnimatePresence } from 'framer-motion';
import { mainAnimation } from './main-animation';

/** Account type shown under the profile name. One of: 'Student' | 'Teacher' | 'Office' | 'Admin'. */
const ACCOUNT_TYPE: 'Student' | 'Teacher' | 'Office' | 'Admin' = 'Student';
const ACCOUNT_NAME = 'MABALA, JEFF AIVAN RECESIO';

interface OfficeGroup {
  id: string;
  name: string;
  image: string;
  posts: iCardItem[];
}

const offices: OfficeGroup[] = [
  {
    id: 'campus-ministry',
    name: 'Campus Ministry Office',
    image: '/ph/380373305_721924509949153_4072438841785184332_n (1).jpg',
    posts: [
      {
        title: 'First Friday Mass',
        description: 'Join us this Friday for the monthly community mass.',
        tag: 'faith',
        src: '/announce/771983724_1077843414900569_3468744417613042016_n.jpg',
        link: '#',
        color: '#1f4d36',
        textColor: '#f5f5f0',
      },
    ],
  },
  {
    id: 'sports',
    name: 'Sports & Intramurals Office',
    image: '/ph/481767636_1071918078283126_1976114256478202182_n.jpg',
    posts: [
      {
        title: 'Intramurals 2022',
        description: 'Games schedule and venue assignments are now posted.',
        tag: 'sports',
        src: '/announce/772361872_1042296375337033_8364753388393949849_n.jpg',
        link: '#',
        color: '#c8442c',
        textColor: '#fff8ee',
      },
    ],
  },
  {
    id: 'registrar',
    name: "Registrar's Office",
    image: '/ph/480461035_1065858045555796_5108185348006453231_n.jpg',
    posts: [
      {
        title: 'Enrollment Open',
        description: 'New and returning students may now enroll for the term.',
        tag: 'academics',
        src: '/announce/773315825_27645509678452165_3890959067758537377_n.jpg',
        link: '#',
        color: '#d9a441',
        textColor: '#2b1c0e',
      },
    ],
  },
  {
    id: 'student-affairs',
    name: 'Student Affairs Office',
    image: '/ph/764817684_1020547177416620_41274359214352043_n.jpg',
    posts: [
      {
        title: 'Foundation Anniversary',
        description: 'Celebrating another year, join the festivities on campus.',
        tag: 'events',
        src: '/announce/774148810_1520582356750027_5902072969027425279_n.jpg',
        link: '#',
        color: '#2f5f8a',
        textColor: '#f5f9ff',
      },
      {
        title: 'Community Outreach',
        description: 'Volunteers gathered for this month\'s outreach program.',
        tag: 'events',
        src: '/announce/774512658_1520479893426940_454836178337933128_n.jpg',
        link: '#',
        color: '#7a3f9d',
        textColor: '#f8f1ff',
      },
    ],
  },
  {
    id: 'admin',
    name: 'Administration Office',
    image: '/ph/484181020_1086760376798896_921946633862466358_n.jpg',
    posts: [
      {
        title: 'Holiday Advisories',
        description: 'There will be NO CLASSES and NO OFFICE TRANSACTIONS at ALL LEVELS on the following dates: Wednesday, August 26 - Muslim Legal Holiday. Monday, August 31 - National Heroes Day. #opusvitalux',
        tag: 'advisory',
        src: '/announce/785993233_1053237037566691_3518901697778432703_n.jpg',
        link: '#',
        color: '#166a6a',
        textColor: '#eefdfd',
      },
    ],
  },
].map((office) => ({
  ...office,
  image: encodeURI(office.image),
  posts: office.posts.map((post) => ({ ...post, src: encodeURI(post.src) })),
}));

const carouselSlides: CoverflowSlide[] = offices.map((office) => ({ src: office.image, alt: office.name }));

/** School-wide feed for the Home page — every office's posts pooled together. */
const generalAnnouncements = offices.flatMap((office) =>
  office.posts.map((post) => ({ ...post, office: office.name })),
);

interface AssignmentDue {
  id: number;
  title: string;
  className: string;
  due: string;
}

const upcomingAssignments: AssignmentDue[] = [
  { id: 1, title: 'Programming Exercise 3', className: 'CS101-A', due: 'Due tomorrow, 11:59 PM' },
  { id: 2, title: 'Problem Set 5', className: 'MATH204', due: 'Due in 2 days' },
  { id: 3, title: 'Reflection Essay', className: 'ENG110', due: 'Due Friday' },
];

interface ActivityEntry {
  id: number;
  text: string;
  time: string;
}

const recentActivity: ActivityEntry[] = [
  { id: 1, text: 'You joined General Biology', time: '10 min ago' },
  { id: 2, text: 'Grade posted for Problem Set 4 in Calculus II', time: '2 hours ago' },
  { id: 3, text: 'Campus Ministry Office replied to your ticket', time: '3 hours ago' },
  { id: 4, text: 'New announcement from Administration Office', time: 'Yesterday' },
];

interface ChatMessage {
  id: number;
  from: 'student' | 'office';
  text: string;
  time: string;
}

interface InboxItem {
  id: number;
  from: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  /** Present only for support-ticket messages, mirroring student-route's ticket status. */
  ticketStatus?: 'pending' | 'closed';
  /**
   * Present only for ticket threads. Local state stand-in for what would be
   * a realtime feed later — same shape, just polled/pushed by hand for now.
   */
  messages?: ChatMessage[];
}

/**
 * Messages only holds real two-way threads (support tickets the student has
 * opened). Nothing seeded — it starts empty until a ticket is submitted.
 */
const initialInboxItems: InboxItem[] = [];

const initialNotificationItems: InboxItem[] = [
  {
    id: 1,
    from: 'Campus Ministry Office',
    subject: 'Your ticket has been received',
    preview: 'Thanks for reaching out. Someone from our office will follow up with you shortly.',
    time: '2 min ago',
    unread: true,
  },
  {
    id: 2,
    from: "Registrar's Office",
    subject: 'Enrollment confirmation',
    preview: 'Your enrollment for this term has been recorded. Check your schedule under Classes.',
    time: '1 hour ago',
    unread: true,
  },
  {
    id: 3,
    from: 'Administration Office',
    subject: 'Holiday advisory reminder',
    preview: 'No classes and no office transactions on Aug 26 and Aug 31. Plan accordingly.',
    time: '3 hours ago',
    unread: true,
  },
  {
    id: 4,
    from: 'Student Affairs Office',
    subject: 'Thank you for volunteering',
    preview: 'Great turnout at this month\'s outreach program. Photos are up on the announcements page.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 5,
    from: 'Sports & Intramurals Office',
    subject: 'Intramurals venue change',
    preview: 'The volleyball matches have been moved to the covered court. See you there.',
    time: '2 days ago',
    unread: false,
  },
  {
    id: 101,
    from: 'Amélie',
    subject: 'Commented in Dashboard 2.0',
    preview: 'Really love this approach. I think this is the best solution for the document sync UX issue.',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: 102,
    from: 'Sienna',
    subject: 'Followed you',
    preview: 'Sienna started following your activity.',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: 103,
    from: 'Ammar',
    subject: 'Invited you to Blog design',
    preview: "You've been invited to collaborate on Blog design.",
    time: '3 hours ago',
    unread: false,
  },
  {
    id: 104,
    from: 'Mathilde',
    subject: 'Shared a file in Dashboard 2.0',
    preview: 'Prototype recording 01.mp4 · MP4 · 14 MB',
    time: '4 hours ago',
    unread: false,
  },
  {
    id: 105,
    from: 'James',
    subject: 'Mentioned you in Project Alpha',
    preview: 'Hey @you, can you review the latest designs when you get a chance?',
    time: '1 day ago',
    unread: false,
  },
  {
    id: 106,
    from: 'Sofia',
    subject: 'Liked your comment in Team Meeting Notes',
    preview: 'Sofia liked your comment.',
    time: '1 day ago',
    unread: false,
  },
];

/**
 * Mirrors the roster shape from the student-route project's
 * classes/joined.php: each joined class carries its own status
 * (enrolled/finished/failed/dropped) independent of the others.
 */
interface JoinedClass {
  code: string;
  subject: string;
  schedule: string;
  teacher: string;
  status: 'enrolled' | 'finished' | 'failed' | 'dropped';
}

const initialJoinedClasses: JoinedClass[] = [
  { code: 'CS101-A', subject: 'Introduction to Programming', schedule: 'MWF 8:00–9:00 AM', teacher: 'Mr. Santos', status: 'enrolled' },
  { code: 'MATH204', subject: 'Calculus II', schedule: 'TTh 10:00–11:30 AM', teacher: 'Ms. Cruz', status: 'enrolled' },
  { code: 'ENG110', subject: 'English Composition', schedule: 'MWF 1:00–2:00 PM', teacher: 'Mrs. Reyes', status: 'enrolled' },
  { code: 'HIST101', subject: 'Philippine History', schedule: 'TTh 9:00–10:30 AM', teacher: 'Mr. Bautista', status: 'finished' },
  { code: 'PE101', subject: 'Physical Education 1', schedule: 'F 2:00–4:00 PM', teacher: 'Mr. Garcia', status: 'finished' },
  { code: 'CHEM101', subject: 'General Chemistry', schedule: 'MWF 10:00–11:00 AM', teacher: 'Ms. Villanueva', status: 'failed' },
  { code: 'ECON101', subject: 'Basic Economics', schedule: 'TTh 1:00–2:30 PM', teacher: 'Mr. Domingo', status: 'dropped' },
];

const CLASS_STATUS_LABELS: Record<JoinedClass['status'], string> = {
  enrolled: 'Enrolled',
  finished: 'Finished',
  failed: 'Failed',
  dropped: 'Dropped',
};

/**
 * Mirrors classes/join.php's lookup table: every class the school offers,
 * whether or not this student has joined it yet. Joining validates the
 * code against this list the same way the API validates against `classes`.
 */
const classCatalog: Omit<JoinedClass, 'status'>[] = [
  ...initialJoinedClasses.map(({ code, subject, schedule, teacher }) => ({ code, subject, schedule, teacher })),
  { code: 'BIO101', subject: 'General Biology', schedule: 'TTh 8:00–9:30 AM', teacher: 'Ms. Fernandez' },
  { code: 'ART101', subject: 'Art Appreciation', schedule: 'F 10:00–12:00 PM', teacher: 'Mr. Torres' },
];

export type NavItemData = {
  id: string;
  title: string;
  icon: React.ElementType;
  badge?: number | string;
  shortcut?: string;
  children?: NavItemData[];
};

export type NavGroupData = {
  heading?: string;
  items: NavItemData[];
};

const mockNavGroups: NavGroupData[] = [
  {
    items: [
      { id: 'search', title: 'Search', icon: Search, shortcut: '⌘K' },
      { id: 'home', title: 'Home', icon: LayoutDashboard },
      { id: 'inbox', title: 'Inbox', icon: Inbox, badge: 12 },
      { id: 'announcement', title: 'Announcement', icon: Megaphone },
      { id: 'analytics', title: 'Analytics', icon: Activity },
    ]
  },
  {
    heading: 'Workspace',
    items: [
      {
        id: 'projects',
        title: 'Projects',
        icon: FolderKanban,
        children: [
          { id: 'p-active', title: 'Active', icon: Hash },
          { id: 'p-archived', title: 'Archived', icon: Hash },
        ]
      },
      { id: 'calendar', title: 'Calendar', icon: Calendar },
      {
        id: 'team',
        title: 'Team',
        icon: Users,
        children: [
          { id: 't-design', title: 'Designers', icon: Hash },
          { id: 't-eng', title: 'Engineering', icon: Hash },
          { id: 't-product', title: 'Product', icon: Hash },
        ]
      },
      {
        id: 'classes',
        title: 'Classes',
        icon: GraduationCap,
        children: [
          { id: 'cl-enrolled', title: 'Enrolled', icon: Hash },
          { id: 'cl-finished', title: 'Finished', icon: Hash },
          { id: 'cl-failed', title: 'Failed', icon: Hash },
          { id: 'cl-dropped', title: 'Dropped', icon: Hash },
        ]
      },
    ]
  },
  {
    heading: 'Developers',
    items: [
      { id: 'api', title: 'API Keys', icon: Terminal },
      { id: 'webhooks', title: 'Webhooks', icon: Blocks },
    ]
  }
];

const mockBottomItems: NavItemData[] = [
  { id: 'settings', title: 'Settings', icon: Settings, shortcut: '⌘,' },
  { id: 'logout', title: 'Log out', icon: LogOut },
];

function WorkspaceSwitcher({ selected, subtitle = ACCOUNT_TYPE, onViewProfile }: { selected?: string, subtitle?: string, onViewProfile?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const current = selected || ACCOUNT_NAME;

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-2 py-2 mb-4 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors select-none group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[6px] bg-primary text-primary-foreground flex items-center justify-center font-semibold text-[13px] shadow-sm">
            {current.charAt(0)}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[13px] font-medium leading-none mb-1 text-foreground truncate max-w-[120px]">{current}</span>
            <span className="text-[11px] text-muted-foreground leading-none">{subtitle}</span>
          </div>
        </div>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
          <ChevronDown className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground/70 transition-colors" strokeWidth={1.5} />
        </motion.span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              key="workspace-dropdown"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={mainAnimation.container}
              className="absolute top-[52px] left-0 w-full bg-card border border-border/50 rounded-lg shadow-xl z-50 py-1 flex flex-col gap-0.5 origin-top"
            >
              <motion.div variants={mainAnimation.item} className="px-3 py-2 mx-1">
                <p className="text-[13px] font-medium text-foreground truncate">{current}</p>
                <p className="text-[11px] text-muted-foreground">{subtitle}</p>
              </motion.div>
              <div className="h-px bg-border/50 my-1 mx-2" />
              <motion.div
                variants={mainAnimation.item}
                onClick={() => { onViewProfile?.(); setIsOpen(false); }}
                className="px-3 py-2 mx-1 text-[13px] text-foreground/80 hover:bg-black/5 dark:hover:bg-white/5 rounded-md cursor-pointer flex items-center gap-2 transition-colors"
              >
                <UserCircle className="w-4 h-4" strokeWidth={1.5} />
                View Profile
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({
  item,
  activeId,
  onSelect,
  level = 0
}: {
  item: NavItemData;
  activeId: string;
  onSelect: (id: string) => void;
  level?: number;
}) {
  const isActive = activeId === item.id;
  const hasChildren = !!item.children;
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else {
      onSelect(item.id);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div
        className={`group flex items-center justify-between px-2.5 py-[7px] rounded-[6px] cursor-pointer transition-all duration-200 select-none
          ${isActive
            ? 'bg-black/5 dark:bg-white/10 text-foreground font-medium'
            : 'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground/90'
          }
        `}
        style={{ paddingLeft: `${level * 12 + 10}px` }}
        onClick={handleClick}
      >
        <div className="flex items-center gap-2.5">
          <item.icon
            className={`w-[16px] h-[16px] transition-colors
              ${isActive ? 'text-foreground' : 'text-muted-foreground/70 group-hover:text-foreground/70'}
            `}
            strokeWidth={1.5}
          />
          <span className="text-[13px] tracking-wide truncate">
            {item.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {item.shortcut && (
             <kbd className="hidden group-hover:inline-flex items-center justify-center h-5 px-1.5 text-[10px] font-medium font-mono text-muted-foreground/60 bg-background/50 border border-border/50 rounded-[4px] shadow-xs">
               {item.shortcut}
             </kbd>
          )}
          {item.badge && (
            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-medium rounded-full bg-primary/10 text-primary">
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <ChevronRight
              className={`w-3.5 h-3.5 text-muted-foreground/50 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
              strokeWidth={2}
            />
          )}
        </div>
      </div>

      {hasChildren && (
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden min-h-0 relative flex flex-col gap-0.5 mt-0.5">
            <div
              className="absolute top-0 bottom-0 border-l border-black/5 dark:border-white/5"
              style={{ left: `${level * 12 + 17.5}px` }}
            />
            {item.children!.map(child => (
              <NavItem
                key={child.id}
                item={child}
                activeId={activeId}
                onSelect={onSelect}
                level={level + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SidebarNav({
  className = '',
  activeId,
  onSelect,
  activeWorkspace,
  workspaceSubtitle,
  onViewProfile,
  groups = mockNavGroups,
}: {
  className?: string,
  activeId?: string,
  onSelect?: (id: string) => void,
  activeWorkspace?: string,
  workspaceSubtitle?: string,
  onViewProfile?: () => void,
  groups?: NavGroupData[],
}) {
  const [internalId, setInternalId] = useState('home');
  const currentId = activeId !== undefined ? activeId : internalId;
  const handleSelect = onSelect || setInternalId;

  return (
    <div className={`flex flex-col w-[260px] h-full bg-card/50 border-r border-border/50 p-3 font-sans ${className}`}>
      <WorkspaceSwitcher selected={activeWorkspace} subtitle={workspaceSubtitle} onViewProfile={onViewProfile} />

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-4 mt-2">
        {groups.map((group, idx) => (
          <div key={idx} className="flex flex-col gap-0.5">
            {group.heading && (
              <span className="px-2.5 mb-1 text-[11px] font-semibold tracking-wider text-muted-foreground/50 uppercase">
                {group.heading}
              </span>
            )}
            {group.items.map(item => (
              <NavItem
                key={item.id}
                item={item}
                activeId={currentId}
                onSelect={handleSelect}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-border/50 flex flex-col gap-0.5">
        {mockBottomItems.map(item => (
          <NavItem
            key={item.id}
            item={item}
            activeId={currentId}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}

const allItems = [...mockNavGroups.flatMap(g => g.items), ...mockBottomItems];
const flattenItems = (items: NavItemData[]): NavItemData[] => {
  return items.reduce((acc, item) => {
    acc.push(item);
    if (item.children) acc.push(...flattenItems(item.children));
    return acc;
  }, [] as NavItemData[]);
};
const flatMockData = flattenItems(allItems);

function SenderAvatar({ from }: { from: string }) {
  const office = offices.find((o) => o.name === from);
  if (office) {
    return (
      <img
        src={office.image}
        alt={from}
        className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-border/50"
      />
    );
  }
  return (
    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
      {from.charAt(0)}
    </div>
  );
}

function InboxRow({
  item,
  isOpen,
  onClick,
}: {
  item: InboxItem;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="w-full bg-card rounded-xl border border-border/50 shadow-sm p-4 flex gap-3 items-start cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
    >
      <SenderAvatar from={item.from} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-sm truncate ${item.unread ? 'font-semibold text-foreground' : 'font-medium text-foreground/80'}`}>
            {item.from}
          </span>
          <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
        </div>
        <p className={`text-sm truncate ${item.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
          {item.subject}
        </p>
        {isOpen && (
          <p className="text-sm text-muted-foreground mt-2 animate-in fade-in duration-150">
            {item.preview}
          </p>
        )}
      </div>
      {item.unread && <div className="size-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />}
    </div>
  );
}

function MessageThreadRow({ item, onClick }: { item: InboxItem; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="w-full bg-card rounded-xl border border-border/50 shadow-sm p-4 flex gap-3 items-start cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
    >
      <SenderAvatar from={item.from} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-sm truncate ${item.unread ? 'font-semibold text-foreground' : 'font-medium text-foreground/80'}`}>
            {item.from}
          </span>
          <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <p className={`text-sm truncate ${item.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
            {item.subject}
          </p>
          {item.ticketStatus && (
            <span
              className={`text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 shrink-0 ${
                item.ticketStatus === 'pending'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'bg-black/5 dark:bg-white/10 text-muted-foreground'
              }`}
            >
              {item.ticketStatus === 'pending' ? 'Pending approval' : 'Closed'}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{item.preview}</p>
      </div>
      {item.unread && <div className="size-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />}
    </div>
  );
}

function ChatView({
  item,
  draft,
  onDraftChange,
  onSend,
  onCloseTicket,
  onBack,
}: {
  item: InboxItem;
  draft: string;
  onDraftChange: (text: string) => void;
  onSend: () => void;
  onCloseTicket: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="flex items-center gap-3 pb-4 border-b border-border/50 shrink-0">
        <button
          onClick={onBack}
          className="p-1.5 rounded-md text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
        </button>
        <SenderAvatar from={item.from} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{item.from}</p>
          <p className="text-xs text-muted-foreground truncate">{item.subject}</p>
        </div>
        {item.ticketStatus && (
          <span
            className={`text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 shrink-0 ${
              item.ticketStatus === 'pending'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                : 'bg-black/5 dark:bg-white/10 text-muted-foreground'
            }`}
          >
            {item.ticketStatus === 'pending' ? 'Pending approval' : 'Closed'}
          </span>
        )}
        {item.ticketStatus === 'pending' && (
          <button
            onClick={onCloseTicket}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
          >
            Close Ticket
          </button>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-2 py-4">
        {item.messages && item.messages.length > 0 ? (
          item.messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.from === 'student' ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${
                  m.from === 'student'
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-black/5 dark:bg-white/5 text-foreground rounded-bl-sm'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-muted-foreground mt-0.5 px-1">{m.time}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground m-auto">{item.preview}</p>
        )}
      </div>

      {item.ticketStatus === 'pending' && (
        <div className="flex gap-2 pt-3 border-t border-border/50 shrink-0">
          <input
            autoFocus
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSend();
            }}
            placeholder="Type a message…"
            className="flex-1 text-sm bg-background border border-border/50 rounded-lg px-3 py-2 outline-none focus:border-primary/50 transition-colors"
          />
          <button
            onClick={onSend}
            className="text-xs font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity shrink-0"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}

function AutoSlideAnnouncements({ posts }: { posts: typeof generalAnnouncements }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % posts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [posts.length]);

  const post = posts[index];
  if (!post) return null;

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-muted">
      <div
        className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {posts.map((p, i) => (
          <img key={i} src={p.src} alt={p.title} className="w-full h-full object-cover shrink-0" />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div key={`text-${index}`} className="absolute inset-x-0 bottom-0 p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-white/70">{post.office}</p>
        <h3 className="text-xl font-semibold text-white mt-1">{post.title}</h3>
        <p className="text-sm text-white/80 mt-1 max-w-lg">{post.description}</p>
      </div>
      <div className="absolute top-4 right-4 flex gap-1.5">
        {posts.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

interface ProfileDetail {
  studentId?: string;
  course?: string;
  yearLevel?: string;
  section?: string;
  email: string;
  contact: string;
  address: string;
  status: string;
}

const PROFILE_DETAILS: Record<string, ProfileDetail> = {
  Student: {
    studentId: '2023-00456',
    course: 'BS Information Technology',
    yearLevel: '2nd Year',
    section: 'IT-2B',
    email: 'jeffaivan.mabala@sjcs.edu.ph',
    contact: '+63 912 345 6789',
    address: 'Sindangan, Zamboanga del Norte',
    status: 'Enrolled',
  },
  Teacher: {
    email: 'teacher@sjcs.edu.ph',
    contact: '+63 900 000 0000',
    address: 'Sindangan, Zamboanga del Norte',
    status: 'Active Faculty',
  },
  Office: {
    email: 'office@sjcs.edu.ph',
    contact: '+63 900 000 0001',
    address: 'Sindangan, Zamboanga del Norte',
    status: 'Active Staff',
  },
  Admin: {
    email: 'admin@sjcs.edu.ph',
    contact: '+63 900 000 0002',
    address: 'Sindangan, Zamboanga del Norte',
    status: 'Administrator',
  },
};

function ProfileField({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground mt-0.5">{value}</dd>
    </div>
  );
}

function ProfilePage({
  accountName,
  accountType,
  onClose,
}: {
  accountName: string;
  accountType: string;
  onClose: () => void;
}) {
  const details = PROFILE_DETAILS[accountType] ?? PROFILE_DETAILS.Student;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-sm px-4">
      <div className="absolute inset-0" onClick={onClose} />
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={mainAnimation.container}
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-card border border-border/50 rounded-xl shadow-2xl"
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-md text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" strokeWidth={1.5} />
        </motion.button>

        <div className="p-6">
          <motion.div variants={mainAnimation.item} className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-semibold text-2xl shadow-sm shrink-0">
              {accountName.charAt(0)}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-foreground truncate">{accountName}</h2>
              <span className="inline-block mt-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary bg-primary/10 rounded-full px-2.5 py-1">
                {accountType}
              </span>
            </div>
          </motion.div>

          <motion.div variants={mainAnimation.item} className="flex flex-col gap-5">
            {accountType === 'Student' && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Academic Information</h3>
                <dl className="grid grid-cols-2 gap-4">
                  <ProfileField label="Student ID" value={details.studentId} />
                  <ProfileField label="Course" value={details.course} />
                  <ProfileField label="Year Level" value={details.yearLevel} />
                  <ProfileField label="Section" value={details.section} />
                  <ProfileField label="Status" value={details.status} />
                </dl>
              </div>
            )}

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Contact Information</h3>
              <dl className="grid grid-cols-2 gap-4">
                <ProfileField label="Email" value={details.email} />
                <ProfileField label="Contact Number" value={details.contact} />
                <ProfileField label="Address" value={details.address} />
              </dl>
            </div>

            {accountType !== 'Student' && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Account Information</h3>
                <dl className="grid grid-cols-2 gap-4">
                  <ProfileField label="Role" value={accountType} />
                  <ProfileField label="Status" value={details.status} />
                </dl>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default function SidebarNavPreview({
  accountName = ACCOUNT_NAME,
  accountType = ACCOUNT_TYPE,
  onLogout,
}: {
  accountName?: string;
  accountType?: string;
  onLogout?: () => void;
} = {}) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeId, setActiveId] = useState('home');
  const activeWorkspace = accountName;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [officeIndex, setOfficeIndex] = useState(0);
  const [ticketPanelView, setTicketPanelView] = useState<'idle' | 'form' | 'submitted'>('idle');
  const [ticketTopic, setTicketTopic] = useState('');
  const [ticketQuestion, setTicketQuestion] = useState('');
  const [ticketErrors, setTicketErrors] = useState<{ topic?: string; question?: string }>({});
  const [chatDrafts, setChatDrafts] = useState<Record<number, string>>({});
  const [openChatId, setOpenChatId] = useState<number | null>(null);

  const sendChatMessage = (itemId: number) => {
    const text = (chatDrafts[itemId] ?? '').trim();
    if (!text) return;
    setInboxItems((items) =>
      items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              preview: text,
              time: 'Just now',
              messages: [...(item.messages ?? []), { id: Date.now(), from: 'student', text, time: 'Just now' }],
            }
          : item,
      ),
    );
    setChatDrafts((drafts) => ({ ...drafts, [itemId]: '' }));
  };

  const handleSubmitTicket = () => {
    const topic = ticketTopic.trim();
    const question = ticketQuestion.trim();
    const errors: { topic?: string; question?: string } = {};
    if (!topic) errors.topic = 'Enter a subject/topic.';
    if (!question) errors.question = 'Describe your question or concern.';
    if (errors.topic || errors.question) {
      setTicketErrors(errors);
      return;
    }
    setInboxItems((items) => [
      {
        id: Date.now(),
        from: activeOffice.name,
        subject: topic,
        preview: question,
        time: 'Just now',
        unread: true,
        ticketStatus: 'pending',
        messages: [{ id: Date.now(), from: 'student', text: question, time: 'Just now' }],
      },
      ...items,
    ]);
    setTicketTopic('');
    setTicketQuestion('');
    setTicketErrors({});
    setTicketPanelView('submitted');
  };
  const [inboxItems, setInboxItems] = useState<InboxItem[]>(initialInboxItems);
  const [inboxView, setInboxView] = useState<'messages' | 'notifications'>('messages');
  const [notificationItems, setNotificationItems] = useState<InboxItem[]>(initialNotificationItems);
  const [selectedNotificationId, setSelectedNotificationId] = useState<number | null>(null);
  const [joinedClasses, setJoinedClasses] = useState<JoinedClass[]>(initialJoinedClasses);
  const [showAddClassForm, setShowAddClassForm] = useState(false);
  const [classCodeInput, setClassCodeInput] = useState('');
  const [classCodeError, setClassCodeError] = useState('');

  const handleJoinClass = () => {
    const value = classCodeInput.trim();
    if (!value) {
      setClassCodeError('Enter a class code.');
      return;
    }
    const norm = value.toLowerCase();
    const match = classCatalog.find((c) => c.code.toLowerCase() === norm);
    if (!match) {
      setClassCodeError('Invalid Code');
      return;
    }
    if (joinedClasses.some((c) => c.code === match.code)) {
      setClassCodeError(`You're already in ${match.subject}`);
      return;
    }
    setJoinedClasses((classes) => [...classes, { ...match, status: 'enrolled' }]);
    setClassCodeInput('');
    setClassCodeError('');
    setShowAddClassForm(false);
  };

  const [carouselIndex, setCarouselIndex] = useState(0);

  const activeOffice = offices[officeIndex] ?? offices[0];
  const activePost = activeOffice.posts[carouselIndex] ?? activeOffice.posts[0];
  const officePostSlides: SlideData[] = activeOffice.posts.map((p) => ({ title: p.title, button: 'View details', src: p.src }));
  /** Each office keeps a single open thread — resubmitting continues it instead of forking a new one. */
  const officeTicket = inboxItems.find((i) => i.from === activeOffice.name && i.ticketStatus);
  const officeTicketPending = officeTicket?.ticketStatus === 'pending';

  const unreadCount = inboxItems.filter((item) => item.unread).length;
  const navGroupsWithLiveBadge: NavGroupData[] = mockNavGroups.map((group) => ({
    ...group,
    items: group.items.map((item) => (item.id === 'inbox' ? { ...item, badge: unreadCount || undefined } : item)),
  }));

  const activeItem = flatMockData.find(i => i.id === activeId);
  const activeTitle = activeItem ? activeItem.title : 'Dashboard';

  const handleSelect = (id: string) => {
    setShowProfile(false);
    if (id === 'search') {
      setIsSearchOpen(true);
      return;
    }
    if (id === 'logout') {
      onLogout?.();
      return;
    }
    setActiveId(id);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-background p-2">


      <div className="relative w-full h-full max-w-[98vw] bg-card rounded-xl border border-border/50 flex overflow-hidden shadow-sm ring-1 ring-black/5 dark:ring-white/5">


        <div
          className={`h-full transition-all duration-300 ease-in-out shrink-0 overflow-hidden bg-card/50 border-r border-border/50 ${
            isOpen ? 'w-[260px] opacity-100' : 'w-0 opacity-0 border-none'
          }`}
        >

          <SidebarNav
            className="w-[260px] border-none bg-transparent"
            activeId={activeId}
            onSelect={handleSelect}
            activeWorkspace={activeWorkspace}
            workspaceSubtitle={accountType}
            onViewProfile={() => setShowProfile(true)}
            groups={navGroupsWithLiveBadge}
          />
        </div>


        <div className="flex-1 bg-black/[0.02] dark:bg-white/[0.02] flex flex-col min-w-0 transition-all duration-300 relative">


           <div className="h-14 border-b border-border/50 flex items-center px-4 justify-between bg-card shrink-0">
             <div className="flex items-center gap-3">
               <button
                 onClick={() => setIsOpen(!isOpen)}
                 className="p-1.5 rounded-md text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground transition-colors"
               >
                 {isOpen ? <PanelLeftClose className="w-[18px] h-[18px]" strokeWidth={1.5} /> : <PanelLeftOpen className="w-[18px] h-[18px]" strokeWidth={1.5} />}
               </button>
               <div className="flex items-center gap-2 text-sm text-muted-foreground">
                 <span className="truncate">{activeWorkspace}</span>
                 <span>/</span>
                 <span className="font-medium text-foreground truncate">{activeTitle}</span>
               </div>
             </div>

             <div className="flex items-center gap-3">
               <div className="w-64 h-8 bg-black/5 dark:bg-white/5 rounded-md hidden md:block" />
               <motion.button
                 whileTap={{ scale: 0.9 }}
                 animate={isNotificationsOpen ? { rotate: [0, -12, 12, -6, 6, 0] } : {}}
                 transition={{ duration: 0.4 }}
                 onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                 className="relative p-1.5 rounded-md text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground transition-colors"
               >
                 <Bell className="w-[18px] h-[18px]" strokeWidth={1.5} />
                 <span className="absolute top-1 right-1 size-1.5 rounded-full bg-emerald-500" />
               </motion.button>
               <div className="w-8 h-8 bg-primary/10 rounded-full border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                 {accountName.charAt(0)}
               </div>
             </div>
           </div>

           <AnimatePresence>
           {isNotificationsOpen && (
             <>
               <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
               <motion.div
                 key="notifications-panel"
                 initial="hidden"
                 animate="visible"
                 exit="hidden"
                 variants={mainAnimation.container}
                 className="absolute top-16 right-4 md:right-6 z-50 w-80 max-h-[70vh] flex flex-col bg-card border border-border/50 rounded-xl shadow-2xl origin-top-right overflow-hidden"
               >
                 <motion.div variants={mainAnimation.item} className="px-4 py-3 border-b border-border/50 shrink-0">
                   <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                 </motion.div>
                 <motion.div variants={mainAnimation.item} className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-2 p-3">
                   {notificationItems.length === 0 ? (
                     <p className="text-sm text-muted-foreground text-center py-6">No notifications yet.</p>
                   ) : (
                     notificationItems.map((item) => (
                       <InboxRow
                         key={item.id}
                         item={item}
                         isOpen={false}
                         onClick={() => {
                           setActiveId('inbox');
                           setInboxView('notifications');
                           setSelectedNotificationId(item.id);
                           if (item.unread) {
                             setNotificationItems((items) => items.map((i) => (i.id === item.id ? { ...i, unread: false } : i)));
                           }
                           setIsNotificationsOpen(false);
                         }}
                       />
                     ))
                   )}
                 </motion.div>
                 <motion.button
                   variants={mainAnimation.item}
                   onClick={() => {
                     setActiveId('inbox');
                     setInboxView('notifications');
                     setIsNotificationsOpen(false);
                   }}
                   className="shrink-0 text-center text-xs font-medium text-primary py-2.5 border-t border-border/50 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                 >
                   View all in Inbox
                 </motion.button>
               </motion.div>
             </>
           )}
           </AnimatePresence>


           <AnimatePresence mode="wait">
           {activeId === 'announcement' ? (
             <motion.div
               key="announcement"
               initial="hidden"
               animate="visible"
               exit="hidden"
               variants={mainAnimation.container}
               className="pt-2 pb-6 px-6 md:pt-3 md:pb-8 md:px-8 flex-1 min-h-0 flex flex-col overflow-hidden"
             >
               <motion.div variants={mainAnimation.item} className="shrink-0">
                 <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">Offices Carousel</h3>
                 <CoverflowCarousel
                   slides={carouselSlides}
                   showNavigation
                   showPagination
                   rotate={14}
                   depth={0.15}
                   gap={0.16}
                   cardWidth="clamp(110px, 13vw, 170px)"
                   className="-mt-4 -mb-8"
                   onSelect={(index) => {
                     setOfficeIndex(index);
                     setCarouselIndex(0);
                     setTicketPanelView('idle');
                     setTicketTopic('');
                     setTicketQuestion('');
                     setTicketErrors({});
                   }}
                 />
               </motion.div>

               <motion.div variants={mainAnimation.item} className="flex gap-6 flex-1 min-h-0">
                 <div className="w-[420px] shrink-0 flex flex-col min-h-0">
                   <h2 className="text-2xl font-semibold text-foreground shrink-0">Announcements</h2>
                   <p className="text-xs text-muted-foreground mb-4 shrink-0">{activeOffice.name}</p>

                   <div className="w-full bg-card rounded-2xl border border-border/50 shadow-sm p-6 flex flex-col items-start justify-center text-left shrink-0">
                     <p className="text-base md:text-lg font-semibold text-foreground">
                       {activePost?.title}
                     </p>
                     <p className="text-sm text-muted-foreground mt-1">
                       {activePost?.description}
                     </p>
                   </div>

                   <div className="flex justify-center mt-4 shrink-0">
                     <CarouselControl
                       type="previous"
                       title="Go to previous slide"
                       handleClick={() => setCarouselIndex((i) => (i - 1 < 0 ? activeOffice.posts.length - 1 : i - 1))}
                     />
                     <CarouselControl
                       type="next"
                       title="Go to next slide"
                       handleClick={() => setCarouselIndex((i) => (i + 1) % activeOffice.posts.length)}
                     />
                   </div>
                 </div>

                 <div className="flex-1 min-w-0 min-h-0 overflow-hidden flex items-start justify-center py-4">
                   <div className="scale-[0.8] origin-top">
                     <Carousel key={activeOffice.id} slides={officePostSlides} current={carouselIndex} onCurrentChange={setCarouselIndex} hideControls />
                   </div>
                 </div>

                 <div className="w-72 shrink-0 hidden lg:flex flex-col bg-card rounded-2xl border border-border/50 p-6">
                   {ticketPanelView === 'submitted' ? (
                     <div className="flex flex-col items-center text-center gap-3 m-auto">
                       <TicketCheck className="w-8 h-8 text-emerald-500" strokeWidth={1.5} />
                       <div>
                         <p className="text-sm font-semibold text-foreground">Ticket submitted</p>
                         <p className="text-xs text-muted-foreground mt-1">Pending approval — check your inbox for updates.</p>
                       </div>
                       <button
                         onClick={() => handleSelect('inbox')}
                         className="mt-2 px-4 py-2 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                       >
                         Go to Inbox
                       </button>
                     </div>
                   ) : ticketPanelView === 'form' ? (
                     <div className="flex flex-col gap-3">
                       <div className="flex items-center gap-2">
                         <Ticket className="w-5 h-5 text-muted-foreground shrink-0" strokeWidth={1.5} />
                         <p className="text-sm font-semibold text-foreground">New ticket</p>
                       </div>
                       <p className="text-xs text-muted-foreground -mt-2">{activeOffice.name}</p>

                       <div>
                         <label className="text-xs font-medium text-muted-foreground">Subject (Topic)</label>
                         <input
                           value={ticketTopic}
                           onChange={(e) => {
                             setTicketTopic(e.target.value);
                             if (ticketErrors.topic) setTicketErrors((err) => ({ ...err, topic: undefined }));
                           }}
                           placeholder="e.g. Enrollment issue"
                           className="w-full mt-1 text-sm bg-background border border-border/50 rounded-lg px-3 py-2 outline-none focus:border-primary/50 transition-colors"
                         />
                         {ticketErrors.topic && <p className="text-xs text-destructive mt-1">{ticketErrors.topic}</p>}
                       </div>

                       <div>
                         <label className="text-xs font-medium text-muted-foreground">Question / Concern</label>
                         <textarea
                           value={ticketQuestion}
                           onChange={(e) => {
                             setTicketQuestion(e.target.value);
                             if (ticketErrors.question) setTicketErrors((err) => ({ ...err, question: undefined }));
                           }}
                           placeholder="Describe your question or concern"
                           rows={4}
                           className="w-full mt-1 text-sm bg-background border border-border/50 rounded-lg px-3 py-2 outline-none focus:border-primary/50 transition-colors resize-none"
                         />
                         {ticketErrors.question && <p className="text-xs text-destructive mt-1">{ticketErrors.question}</p>}
                       </div>

                       <div className="flex gap-2 mt-1">
                         <button
                           onClick={() => {
                             setTicketPanelView('idle');
                             setTicketTopic('');
                             setTicketQuestion('');
                             setTicketErrors({});
                           }}
                           className="flex-1 text-xs font-medium px-3 py-2 rounded-lg border border-border/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                         >
                           Cancel
                         </button>
                         <button
                           onClick={handleSubmitTicket}
                           className="flex-1 text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                         >
                           Submit
                         </button>
                       </div>
                     </div>
                   ) : officeTicketPending && officeTicket ? (
                     <div className="flex flex-col items-center text-center gap-3 m-auto">
                       <Ticket className="w-8 h-8 text-amber-500" strokeWidth={1.5} />
                       <div>
                         <p className="text-sm font-semibold text-foreground">Ticket in progress</p>
                         <p className="text-xs text-muted-foreground mt-1">You already have an open ticket with {activeOffice.name}.</p>
                       </div>
                       <button
                         onClick={() => {
                           setInboxView('messages');
                           setOpenChatId(officeTicket.id);
                           handleSelect('inbox');
                         }}
                         className="mt-2 px-4 py-2 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                       >
                         View Ticket
                       </button>
                     </div>
                   ) : (
                     <div className="flex flex-col items-center text-center gap-3 m-auto">
                       <Ticket className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
                       <div>
                         <p className="text-sm font-semibold text-foreground">Need help?</p>
                         <p className="text-xs text-muted-foreground mt-1">Open a support ticket for this office.</p>
                       </div>
                       <button
                         onClick={() => setTicketPanelView('form')}
                         className="mt-2 px-4 py-2 text-xs font-medium rounded-lg border border-border/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                       >
                         Open Ticket
                       </button>
                     </div>
                   )}
                 </div>
               </motion.div>
             </motion.div>
           ) : activeId === 'inbox' ? (
             <motion.div
               key="inbox"
               initial="hidden"
               animate="visible"
               exit="hidden"
               variants={mainAnimation.container}
               className="p-6 md:p-8 flex-1 min-h-0 flex flex-col overflow-hidden"
             >
               {inboxView === 'messages' && openChatId !== null && inboxItems.some((i) => i.id === openChatId) ? (
                 <ChatView
                   item={inboxItems.find((i) => i.id === openChatId)!}
                   draft={chatDrafts[openChatId] ?? ''}
                   onDraftChange={(text) => setChatDrafts((drafts) => ({ ...drafts, [openChatId]: text }))}
                   onSend={() => sendChatMessage(openChatId)}
                   onCloseTicket={() => {
                     setInboxItems((items) => items.map((i) => (i.id === openChatId ? { ...i, ticketStatus: 'closed' } : i)));
                   }}
                   onBack={() => setOpenChatId(null)}
                 />
               ) : (
                 <>
                   <motion.div variants={mainAnimation.item} className="flex items-center justify-between mb-6 shrink-0">
                     <div className="flex items-center gap-4">
                       <h2 className="text-2xl font-semibold text-foreground">Inbox</h2>
                       <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 rounded-lg p-1">
                         <button
                           onClick={() => setInboxView('messages')}
                           className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                             inboxView === 'messages' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                           }`}
                         >
                           <Mail className="w-3.5 h-3.5" strokeWidth={1.5} />
                           Messages
                         </button>
                         <button
                           onClick={() => setInboxView('notifications')}
                           className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                             inboxView === 'notifications' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                           }`}
                         >
                           <Bell className="w-3.5 h-3.5" strokeWidth={1.5} />
                           Notifications
                         </button>
                       </div>
                     </div>
                     {inboxView === 'messages'
                       ? inboxItems.some((item) => item.unread) && (
                           <button
                             onClick={() => setInboxItems((items) => items.map((item) => ({ ...item, unread: false })))}
                             className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                           >
                             Mark all as read
                           </button>
                         )
                       : notificationItems.some((item) => item.unread) && (
                           <button
                             onClick={() => setNotificationItems((items) => items.map((item) => ({ ...item, unread: false })))}
                             className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                           >
                             Mark all as read
                           </button>
                         )}
                   </motion.div>

                   <motion.div variants={mainAnimation.item} className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-2">
                     <AnimatePresence mode="wait">
                       {inboxView === 'messages' ? (
                         <motion.div
                           key="messages"
                           initial="hidden"
                           animate="visible"
                           exit="hidden"
                           variants={mainAnimation.container}
                           className="flex flex-col gap-2"
                         >
                           {inboxItems.length === 0 ? (
                             <p className="text-sm text-muted-foreground m-auto">
                               No messages yet. Open a ticket from the Announcement page to start one.
                             </p>
                           ) : (
                             inboxItems.map((item) => (
                               <motion.div key={item.id} variants={mainAnimation.item}>
                                 <MessageThreadRow
                                   item={item}
                                   onClick={() => {
                                     setOpenChatId(item.id);
                                     if (item.unread) {
                                       setInboxItems((items) => items.map((i) => (i.id === item.id ? { ...i, unread: false } : i)));
                                     }
                                   }}
                                 />
                               </motion.div>
                             ))
                           )}
                         </motion.div>
                       ) : (
                         <motion.div
                           key="notifications"
                           initial="hidden"
                           animate="visible"
                           exit="hidden"
                           variants={mainAnimation.container}
                           className="flex flex-col gap-2"
                         >
                           {notificationItems.map((item) => (
                             <motion.div key={item.id} variants={mainAnimation.item}>
                               <InboxRow
                                 item={item}
                                 isOpen={selectedNotificationId === item.id}
                                 onClick={() => {
                                   setSelectedNotificationId(selectedNotificationId === item.id ? null : item.id);
                                   if (item.unread) {
                                     setNotificationItems((items) => items.map((i) => (i.id === item.id ? { ...i, unread: false } : i)));
                                   }
                                 }}
                               />
                             </motion.div>
                           ))}
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </motion.div>
                 </>
               )}
             </motion.div>
           ) : activeId.startsWith('cl-') ? (
             (() => {
               const status = activeId.slice(3) as JoinedClass['status'];
               const classesForStatus = joinedClasses.filter((c) => c.status === status);
               return (
                 <motion.div
                   key={activeId}
                   initial="hidden"
                   animate="visible"
                   exit="hidden"
                   variants={mainAnimation.container}
                   className="p-6 md:p-8 flex-1 min-h-0 flex flex-col overflow-hidden"
                 >
                   <motion.div variants={mainAnimation.item} className="shrink-0">
                     <div className="flex items-start justify-between gap-3 mb-1">
                       <h2 className="text-2xl font-semibold text-foreground">
                         {CLASS_STATUS_LABELS[status]} Classes
                       </h2>
                       {status === 'enrolled' && (
                         <button
                           onClick={() => {
                             setShowAddClassForm((v) => !v);
                             setClassCodeError('');
                             setClassCodeInput('');
                           }}
                           className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
                         >
                           {showAddClassForm ? 'Cancel' : 'Add Class'}
                         </button>
                       )}
                     </div>
                     <p className="text-sm text-muted-foreground mb-4">
                       {classesForStatus.length} class{classesForStatus.length === 1 ? '' : 'es'} with status "{status}"
                     </p>
                   </motion.div>

                   {status === 'enrolled' && showAddClassForm && (
                     <div className="w-full bg-card rounded-xl border border-border/50 shadow-sm p-4 mb-4 shrink-0">
                       <label className="text-xs font-medium text-muted-foreground">Class code</label>
                       <div className="flex gap-2 mt-1.5">
                         <input
                           autoFocus
                           value={classCodeInput}
                           onChange={(e) => {
                             setClassCodeInput(e.target.value);
                             if (classCodeError) setClassCodeError('');
                           }}
                           onKeyDown={(e) => {
                             if (e.key === 'Enter') handleJoinClass();
                           }}
                           placeholder="e.g. BIO101"
                           className="flex-1 text-sm bg-background border border-border/50 rounded-lg px-3 py-2 outline-none focus:border-primary/50 transition-colors"
                         />
                         <button
                           onClick={handleJoinClass}
                           className="text-xs font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity shrink-0"
                         >
                           Join
                         </button>
                       </div>
                       {classCodeError && (
                         <p className="text-xs text-destructive mt-2">{classCodeError}</p>
                       )}
                     </div>
                   )}

                   <motion.div variants={mainAnimation.item} className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-2">
                     {classesForStatus.length === 0 ? (
                       <p className="text-sm text-muted-foreground">No classes here yet.</p>
                     ) : (
                       classesForStatus.map((c) => (
                         <div
                           key={c.code}
                           className="w-full bg-card rounded-xl border border-border/50 shadow-sm p-4 flex items-center justify-between gap-3"
                         >
                           <div className="min-w-0">
                             <p className="text-sm font-semibold text-foreground truncate">{c.subject}</p>
                             <p className="text-xs text-muted-foreground mt-0.5">{c.code} · {c.teacher}</p>
                           </div>
                           <span className="text-xs text-muted-foreground shrink-0">{c.schedule}</span>
                         </div>
                       ))
                     )}
                   </motion.div>
                 </motion.div>
               );
             })()
           ) : activeId === 'calendar' ? (
             <motion.div
               key="calendar"
               initial="hidden"
               animate="visible"
               exit="hidden"
               variants={mainAnimation.item}
               className="flex-1 min-h-0 flex flex-col"
             >
               <CalendarPage
                 accountType={accountType}
                 enrolledClasses={joinedClasses.filter((c) => c.status === 'enrolled')}
               />
             </motion.div>
           ) : activeId === 'p-active' ? (
             <motion.div
               key="p-active"
               initial="hidden"
               animate="visible"
               exit="hidden"
               variants={mainAnimation.item}
               className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
             >
               <ProjectShowcase onProjectClick={setSelectedProject} />
             </motion.div>
           ) : activeId === 'home' ? (
             <motion.div
               key="home"
               initial="hidden"
               animate="visible"
               exit="hidden"
               variants={mainAnimation.container}
               className="p-6 md:p-8 flex-1 min-h-0 flex flex-col overflow-hidden"
             >
               <motion.h2 variants={mainAnimation.item} className="text-2xl font-semibold text-foreground mb-4 shrink-0">
                 Home
               </motion.h2>
               <motion.div variants={mainAnimation.item} className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 overflow-hidden">
                 <div className="min-h-0 flex flex-col">
                   <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 shrink-0">
                     General Announcement
                   </p>
                   <div className="flex-1 min-h-0">
                     <AutoSlideAnnouncements posts={generalAnnouncements} />
                   </div>
                 </div>

                 <div className="min-h-0 flex flex-col gap-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                   <div className="bg-card rounded-xl border border-border/50 shadow-sm p-4 shrink-0">
                     <div className="flex items-center gap-2 mb-3">
                       <CalendarClock className="w-4 h-4 text-primary" strokeWidth={1.5} />
                       <h3 className="text-sm font-semibold text-foreground">Upcoming Due Assignment</h3>
                     </div>
                     <div className="flex flex-col gap-2.5">
                       {upcomingAssignments.map((a) => (
                         <div
                           key={a.id}
                           className="flex items-start justify-between gap-2 pb-2.5 border-b border-border/50 last:border-0 last:pb-0"
                         >
                           <div className="min-w-0">
                             <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                             <p className="text-xs text-muted-foreground mt-0.5">{a.className}</p>
                           </div>
                           <span className="text-[11px] text-muted-foreground shrink-0 text-right">{a.due}</span>
                         </div>
                       ))}
                     </div>
                   </div>

                   <div className="bg-card rounded-xl border border-border/50 shadow-sm p-4 shrink-0">
                     <div className="flex items-center gap-2 mb-3">
                       <History className="w-4 h-4 text-primary" strokeWidth={1.5} />
                       <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
                     </div>
                     <div className="flex flex-col gap-2.5">
                       {recentActivity.map((act) => (
                         <div key={act.id} className="pb-2.5 border-b border-border/50 last:border-0 last:pb-0">
                           <p className="text-sm text-foreground">{act.text}</p>
                           <p className="text-xs text-muted-foreground mt-0.5">{act.time}</p>
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>
               </motion.div>
             </motion.div>
           ) : (
             <motion.div
               key={activeId}
               initial="hidden"
               animate="visible"
               exit="hidden"
               variants={mainAnimation.container}
               className="p-6 md:p-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
             >
               <motion.div variants={mainAnimation.item} className="flex items-center justify-between mb-8">
                 <div className="w-48 h-8 bg-black/5 dark:bg-white/5 rounded-md" />
               </motion.div>

               <motion.div variants={mainAnimation.item} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div className="h-32 bg-card rounded-xl border border-border/50 shadow-sm" />
                 <div className="h-32 bg-card rounded-xl border border-border/50 shadow-sm" />
               </motion.div>

               <motion.div variants={mainAnimation.item} className="w-full bg-card rounded-xl border border-border/50 shadow-sm p-6">
                  <div className="w-1/3 h-5 bg-black/5 dark:bg-white/5 rounded-md mb-6" />
                  <div className="w-full h-[1px] bg-border/50 mb-6" />

                  <div className="flex flex-col gap-4">
                  <div className="w-full h-12 bg-black/5 dark:bg-white/5 rounded-lg" />
                  <div className="w-full h-12 bg-black/5 dark:bg-white/5 rounded-lg" />
                  <div className="w-full h-12 bg-black/5 dark:bg-white/5 rounded-lg" />
                  <div className="w-full h-12 bg-black/5 dark:bg-white/5 rounded-lg" />
                 </div>
               </motion.div>
             </motion.div>
           )}
           </AnimatePresence>
        </div>


        <AnimatePresence>
          {showProfile && (
            <ProfilePage key="profile" accountName={accountName} accountType={accountType} onClose={() => setShowProfile(false)} />
          )}
        </AnimatePresence>

        {selectedProject && (
          <ProjectDetailView
            {...buildProjectDetail(
              selectedProject,
              showcaseProjects.indexOf(selectedProject),
              accountName,
              () => setSelectedProject(null),
            )}
          />
        )}

        {isSearchOpen && (
          <div className="absolute inset-0 z-50 flex items-start justify-center pt-[15vh] bg-background/40 backdrop-blur-sm px-4">
            <div className="absolute inset-0" onClick={() => setIsSearchOpen(false)} />
            <div className="relative w-full max-w-xl bg-card border border-border/50 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center px-4 border-b border-border/50">
                <Search className="w-[18px] h-[18px] text-muted-foreground/70 mr-3 shrink-0" strokeWidth={1.5} />
                <input
                  autoFocus
                  className="flex-1 bg-transparent py-4 outline-none text-[14px] text-foreground placeholder:text-muted-foreground/50"
                  placeholder="Search projects, docs, or actions..."
                />
                <kbd
                  onClick={() => setIsSearchOpen(false)}
                  className="hidden sm:inline-flex items-center justify-center h-5 px-1.5 ml-2 text-[10px] font-medium font-mono text-muted-foreground/70 bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-[4px] cursor-pointer hover:text-foreground hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
                >
                  ESC
                </kbd>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="ml-3 p-1 rounded-md text-muted-foreground/70 hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground transition-colors"
                >
                  <X className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </button>
              </div>
              <div className="p-2 py-8 flex flex-col items-center justify-center">
                 <Command className="w-6 h-6 text-muted-foreground/30 mb-2" strokeWidth={1.5} />
                 <p className="text-[13px] text-muted-foreground font-medium">Type a command or search...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
