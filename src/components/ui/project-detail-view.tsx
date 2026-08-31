import * as React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Image,
  Calendar,
  Tag,
  Paperclip,
  Users,
  MoreHorizontal,
  Download,
  Plus,
  ArrowRight,
  Edit2,
  X,
  Share2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mainAnimation } from "@/components/ui/main-animation";
import type { Project } from "@/components/ui/project-showcase";

type Assignee = {
  name: string;
  avatarUrl: string;
};

type ProjectTag = {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
};

type Attachment = {
  name: string;
  size: string;
  type: "pdf" | "figma";
};

type SubTask = {
  id: number;
  task: string;
  category: string;
  status: "Completed" | "In Progress" | "Pending";
  dueDate: string;
};

export type ProjectDetailViewProps = {
  breadcrumbs: { label: string; href: string }[];
  title: string;
  status: string;
  assignees: Assignee[];
  dateRange: {
    start: string;
    end: string;
  };
  tags: ProjectTag[];
  description: string;
  attachments: Attachment[];
  subTasks: SubTask[];
  onClose?: () => void;
};

const StatusBadge = ({ status }: { status: SubTask["status"] }) => {
  const statusStyles = {
    Completed: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 border-green-200 dark:border-green-700/60",
    "In Progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700/60",
    Pending: "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-400 border-gray-200 dark:border-gray-700/60",
  };
  return <Badge variant="outline" className={cn("font-medium", statusStyles[status])}>{status}</Badge>;
};

const FileIcon = ({ type }: { type: Attachment["type"] }) => {
  if (type === "pdf") return <FileText className="h-6 w-6 text-red-500" />;
  if (type === "figma") return <Image className="h-6 w-6 text-purple-500" />;
  return <Paperclip className="h-6 w-6 text-muted-foreground" />;
};

export function ProjectDetailView({
  breadcrumbs,
  title,
  status,
  assignees,
  dateRange,
  tags,
  description,
  attachments,
  subTasks,
  onClose,
}: ProjectDetailViewProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-sm px-4 py-8">
      <div className="absolute inset-0" onClick={onClose} />
      <Card className="relative w-full max-w-4xl max-h-full mx-auto overflow-hidden overflow-y-auto border-none shadow-2xl shadow-slate-200/50 dark:shadow-black/50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <motion.div initial="hidden" animate="visible" variants={mainAnimation.container}>
          <CardHeader className="p-4 border-b bg-muted/30">
            <motion.div variants={mainAnimation.item} className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {breadcrumbs.map((breadcrumb, index) => (
                  <React.Fragment key={index}>
                    <span>{breadcrumb.label}</span>
                    {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon"><Share2 className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><Edit2 className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
              </div>
            </motion.div>
          </CardHeader>

          <CardContent className="p-6 md:p-8 space-y-8">
            <motion.h1 variants={mainAnimation.item} className="text-3xl font-bold tracking-tight text-foreground">
              {title}
            </motion.h1>

            <motion.div
              variants={mainAnimation.item}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm"
            >
              <div className="flex items-start gap-3">
                <MoreHorizontal className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge
                    variant="outline"
                    className="mt-1 font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700/60"
                  >
                    <span className="mr-2 h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></span>
                    {status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Assignee</p>
                  <div className="flex items-center gap-2 mt-1">
                    {assignees.map((assignee) => (
                      <div key={assignee.name} className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={assignee.avatarUrl} alt={assignee.name} />
                          <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{assignee.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium flex items-center gap-2 mt-1">
                    {dateRange.start} <ArrowRight className="h-4 w-4 text-muted-foreground" /> {dateRange.end}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Tag className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Tags</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {tags.map((tag) => (
                      <Badge key={tag.label} variant={tag.variant}>{tag.label}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 col-span-1 md:col-span-2">
                <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Description</p>
                  <p className="mt-1 text-foreground/80">{description}</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={mainAnimation.item} className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold flex items-center gap-2">
                  <Paperclip className="h-5 w-5 text-muted-foreground" />
                  Attachment <Badge variant="secondary">{attachments.length}</Badge>
                </h3>
                <Button variant="ghost" size="sm" className="text-primary">
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {attachments.map((file) => (
                  <div key={file.name} className="flex items-center gap-3 p-3 border rounded-lg bg-muted/40">
                    <FileIcon type={file.type} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.size}</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-center p-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/40 transition-colors">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </motion.div>

            <motion.div variants={mainAnimation.item} className="space-y-4">
              <h3 className="font-semibold">Task List</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">No</TableHead>
                      <TableHead>Task</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subTasks.map((task) => (
                      <motion.tr variants={mainAnimation.item} key={task.id} className="border-b transition-colors hover:bg-muted/50">
                        <TableCell className="text-muted-foreground">{task.id}</TableCell>
                        <TableCell className="font-medium">{task.task}</TableCell>
                        <TableCell>{task.category}</TableCell>
                        <TableCell><StatusBadge status={task.status} /></TableCell>
                        <TableCell className="text-right text-muted-foreground">{task.dueDate}</TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          </CardContent>
        </motion.div>
      </Card>
    </div>
  );
}

const SUBTASK_TEMPLATES: Omit<SubTask, "id">[][] = [
  [
    { task: "Define component tokens", category: "Design", status: "Completed", dueDate: "Mar 2" },
    { task: "Build theme generator", category: "Engineering", status: "In Progress", dueDate: "Mar 9" },
    { task: "Write usage docs", category: "Docs", status: "Pending", dueDate: "Mar 14" },
  ],
  [
    { task: "Realtime cursor sync", category: "Engineering", status: "Completed", dueDate: "Feb 20" },
    { task: "Presence indicators", category: "Engineering", status: "In Progress", dueDate: "Mar 4" },
    { task: "Conflict resolution", category: "Engineering", status: "Pending", dueDate: "Mar 18" },
  ],
  [
    { task: "Palette extraction algorithm", category: "Engineering", status: "Completed", dueDate: "Jan 12" },
    { task: "Accessibility contrast check", category: "Design", status: "Completed", dueDate: "Jan 28" },
    { task: "Export to CSS variables", category: "Engineering", status: "In Progress", dueDate: "Feb 6" },
  ],
  [
    { task: "Mesh import pipeline", category: "Engineering", status: "In Progress", dueDate: "Feb 10" },
    { task: "Material editor UI", category: "Design", status: "Pending", dueDate: "Feb 24" },
    { task: "Scene export", category: "Engineering", status: "Pending", dueDate: "Mar 3" },
  ],
];

const TAG_TEMPLATES: ProjectTag[][] = [
  [{ label: "Design System", variant: "secondary" }, { label: "AI", variant: "outline" }],
  [{ label: "Realtime", variant: "secondary" }, { label: "Collaboration", variant: "outline" }],
  [{ label: "Color", variant: "secondary" }, { label: "Tooling", variant: "outline" }],
  [{ label: "3D", variant: "secondary" }, { label: "WebGL", variant: "outline" }],
];

const STATUS_TEMPLATES = ["In Progress", "In Progress", "In Review", "Planning"];

export function buildProjectDetail(
  project: Project,
  index: number,
  accountName: string,
  onClose: () => void,
): ProjectDetailViewProps {
  return {
    breadcrumbs: [
      { label: "Projects", href: "#" },
      { label: "Active", href: "#" },
      { label: project.title, href: "#" },
    ],
    title: project.title,
    status: STATUS_TEMPLATES[index % STATUS_TEMPLATES.length],
    assignees: [{ name: accountName, avatarUrl: "" }],
    dateRange: { start: `Jan ${project.year.slice(2)}`, end: `Dec ${project.year.slice(2)}` },
    tags: TAG_TEMPLATES[index % TAG_TEMPLATES.length],
    description: project.description,
    attachments: [
      { name: `${project.title}-spec.pdf`, size: "1.2 MB", type: "pdf" },
      { name: `${project.title}-ui-kit.fig`, size: "8.4 MB", type: "figma" },
    ],
    subTasks: SUBTASK_TEMPLATES[index % SUBTASK_TEMPLATES.length].map((t, i) => ({ id: i + 1, ...t })),
    onClose,
  };
}
