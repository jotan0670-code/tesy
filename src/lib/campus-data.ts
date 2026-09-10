import { type iCardItem } from '@/components/ui/cards-parallax';

/** The four account kinds NotiCampus ships with. Every nav group and page gates on this. */
export type Role = 'Student' | 'Teacher' | 'Office' | 'Admin';

export const ROLES: Role[] = ['Student', 'Teacher', 'Office', 'Admin'];

export interface Department {
  id: string;
  name: string;
  short: string;
}

/**
 * Departments double as the "Individual" audience an office can target.
 * A student only ever sees General posts plus posts aimed at their own department.
 */
export const departments: Department[] = [
  { id: 'bsit', name: 'BS Information Technology', short: 'BSIT' },
  { id: 'bsed', name: 'BS Secondary Education', short: 'BSEd' },
  { id: 'bsba', name: 'BS Business Administration', short: 'BSBA' },
  { id: 'bscrim', name: 'BS Criminology', short: 'BSCrim' },
  { id: 'shs', name: 'Senior High School', short: 'SHS' },
];

export const departmentName = (id: string): string =>
  departments.find((d) => d.id === id)?.name ?? id;

export interface OfficeGroup {
  id: string;
  name: string;
  image: string;
  posts: iCardItem[];
}

const rawOffices: OfficeGroup[] = [
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
        description: "Volunteers gathered for this month's outreach program.",
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
        description:
          'There will be NO CLASSES and NO OFFICE TRANSACTIONS at ALL LEVELS on the following dates: Wednesday, August 26 - Muslim Legal Holiday. Monday, August 31 - National Heroes Day. #opusvitalux',
        tag: 'advisory',
        src: '/announce/785993233_1053237037566691_3518901697778432703_n.jpg',
        link: '#',
        color: '#166a6a',
        textColor: '#eefdfd',
      },
    ],
  },
];

/**
 * Files under public/ referenced from code, not from markup, so Vite cannot
 * rewrite them at build time. Prefixing BASE_URL keeps them resolving when the
 * site is served from a subpath (GitHub Pages) rather than a domain root.
 * Names carry spaces and parentheses, so they are encoded here once.
 */
export const assetUrl = (path: string): string =>
  `${import.meta.env.BASE_URL}${encodeURI(path).replace(/^\//, '')}`;

export const offices: OfficeGroup[] = rawOffices.map((office) => ({
  ...office,
  image: assetUrl(office.image),
  posts: office.posts.map((post) => ({ ...post, src: assetUrl(post.src) })),
}));

/** School-wide feed for the Home page — every office's posts pooled together. */
export const generalAnnouncements = offices.flatMap((office) =>
  office.posts.map((post) => ({ ...post, office: office.name })),
);

/**
 * What an office actually composes. `audience` is either the school-wide
 * 'General' feed or a single department id, mirroring the spec's
 * "Individual, General" choice on the office announce page.
 */
export interface Announcement {
  id: number;
  title: string;
  body: string;
  office: string;
  audience: 'General' | string;
  postedAt: string;
  image?: string;
}

export const initialOfficeAnnouncements: Announcement[] = [
  {
    id: 1,
    title: 'Holiday Advisories',
    body: 'There will be NO CLASSES and NO OFFICE TRANSACTIONS at ALL LEVELS on Wednesday, August 26 and Monday, August 31.',
    office: 'Administration Office',
    audience: 'General',
    postedAt: 'Aug 24',
    image: offices[4].posts[0].src,
  },
  {
    id: 2,
    title: 'OJT Orientation for IT Students',
    body: 'All 3rd year BSIT students must attend the on-the-job training orientation at the AVR, 1:00 PM.',
    office: "Registrar's Office",
    audience: 'bsit',
    postedAt: 'Aug 22',
  },
  {
    id: 3,
    title: 'Enrollment Open',
    body: 'New and returning students may now enroll for the term at the registrar window.',
    office: "Registrar's Office",
    audience: 'General',
    postedAt: 'Aug 20',
    image: offices[2].posts[0].src,
  },
];

export interface RosterStudent {
  id: string;
  name: string;
  department: string;
}

export interface ClassAssignment {
  id: number;
  title: string;
  instructions: string;
  due: string;
  points: number;
  submitted: number;
}

/** A classroom a teacher owns. `code` is what students type on the Add Class form. */
export interface TeacherClass {
  code: string;
  subject: string;
  section: string;
  schedule: string;
  room: string;
  students: RosterStudent[];
  assignments: ClassAssignment[];
}

export const initialTeacherClasses: TeacherClass[] = [
  {
    code: 'CS101-A',
    subject: 'Introduction to Programming',
    section: 'IT-1A',
    schedule: 'MWF 8:00–9:00 AM',
    room: 'Comp Lab 2',
    students: [
      { id: '2023-00456', name: 'MABALA, JEFF AIVAN RECESIO', department: 'bsit' },
      { id: '2023-00461', name: 'ALONZO, MARIA CLARA', department: 'bsit' },
      { id: '2023-00478', name: 'DELA CRUZ, JUAN MIGUEL', department: 'bsit' },
      { id: '2023-00490', name: 'RAMOS, ANGEL GRACE', department: 'bsit' },
    ],
    assignments: [
      {
        id: 1,
        title: 'Programming Exercise 3',
        instructions: 'Write a program that reverses a string without using built-in helpers.',
        due: 'Tomorrow, 11:59 PM',
        points: 20,
        submitted: 2,
      },
      {
        id: 2,
        title: 'Flowchart Activity',
        instructions: 'Draw the flowchart for the payroll problem discussed in class.',
        due: 'Next Monday',
        points: 15,
        submitted: 4,
      },
    ],
  },
  {
    code: 'CS102-B',
    subject: 'Data Structures',
    section: 'IT-2B',
    schedule: 'TTh 1:00–2:30 PM',
    room: 'Comp Lab 1',
    students: [
      { id: '2022-00112', name: 'SANTIAGO, PAULO REY', department: 'bsit' },
      { id: '2022-00134', name: 'VILLAREAL, KIM DANIELLE', department: 'bsit' },
    ],
    assignments: [
      {
        id: 3,
        title: 'Linked List Implementation',
        instructions: 'Implement a singly linked list with insert, delete, and traverse.',
        due: 'Friday, 5:00 PM',
        points: 30,
        submitted: 1,
      },
    ],
  },
];

/**
 * Accounts the admin manages. Only Teacher and Office accounts pass through
 * admin approval — students self-register and admins are provisioned directly.
 */
export interface ManagedAccount {
  id: number;
  name: string;
  email: string;
  role: 'Teacher' | 'Office';
  /** Department for teachers, office name for office staff. */
  assignment: string;
  status: 'pending' | 'active' | 'suspended';
  requestedAt: string;
}

export const initialManagedAccounts: ManagedAccount[] = [
  {
    id: 1,
    name: 'SANTOS, RONALD B.',
    email: 'ronald.santos@sjcs.edu.ph',
    role: 'Teacher',
    assignment: 'BS Information Technology',
    status: 'active',
    requestedAt: 'Jun 02',
  },
  {
    id: 2,
    name: 'CRUZ, MARILOU P.',
    email: 'marilou.cruz@sjcs.edu.ph',
    role: 'Teacher',
    assignment: 'BS Secondary Education',
    status: 'active',
    requestedAt: 'Jun 04',
  },
  {
    id: 3,
    name: "Registrar's Office",
    email: 'registrar@sjcs.edu.ph',
    role: 'Office',
    assignment: "Registrar's Office",
    status: 'active',
    requestedAt: 'May 28',
  },
  {
    id: 4,
    name: 'REYES, ANNA LIZA G.',
    email: 'annaliza.reyes@sjcs.edu.ph',
    role: 'Teacher',
    assignment: 'BS Business Administration',
    status: 'pending',
    requestedAt: 'Today',
  },
  {
    id: 5,
    name: 'Guidance Office',
    email: 'guidance@sjcs.edu.ph',
    role: 'Office',
    assignment: 'Guidance Office',
    status: 'pending',
    requestedAt: 'Yesterday',
  },
  {
    id: 6,
    name: 'BAUTISTA, MARK ANTHONY',
    email: 'mark.bautista@sjcs.edu.ph',
    role: 'Teacher',
    assignment: 'BS Criminology',
    status: 'suspended',
    requestedAt: 'Apr 15',
  },
];
