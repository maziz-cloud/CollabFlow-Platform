full web app from scratch: a Project Management & Team Collaboration Platform.**

Core Features
- **Multi-tenant workspace structure**: Organizations → Projects → Tasks/Subtasks hierarchy.
- **Task Management**: Kanban board (To Do, In Progress, Review, Done), list view, and calendar timeline (Gantt-style). Drag-and-drop task prioritization.
- **User Roles & Permissions**: Admin (workspace settings), Manager (project-level control), Member (task-level access), Viewer (read-only). Invite via email.
- **Real-time Collaboration**: Live cursors, instant comments on tasks, @mentions with notifications, activity feed per project.
- **File Management**: Upload attachments to tasks (max 50MB), preview images/docs, version history, cloud storage integration.
- **Dashboard Overview**: Active projects counter, task completion rate, team workload distribution, overdue tasks highlight.

UI/UX Requirements
- **Main Layout**: Sidebar workspace navigation, top bar with global search (tasks, projects, files), user profile menu.
- **Project Views**: Toggle between Kanban, List, Timeline, and Dashboard tabs without page reload.
- **Task Cards**: Show assignee avatar, due date badge, priority flag, attachment icon, comment count.
- **Responsive Design**: Mobile-optimized kanban with horizontal scroll, collapsible sidebar on tablet.
- **Theme System**: Light/dark mode toggle with system preference detection, custom brand colors per workspace.

Technical & Integrations
- **Stack**: Next.js 14 (App Router), Supabase (auth, DB, storage), Prisma schema for complex relations.
- **Real-time**: Supabase Realtime subscriptions for live updates across clients.
- **Search**: Implement full-text search across tasks/comments using PostgreSQL FTS or Typesense.
- **Notifications**: In-app notification bell with badge count, email digests for updates, push notifications for @mentions.
- **Integrations**: Slack incoming/outgoing webhooks (task updates → channel), GitHub issue sync (branch naming → task status).

Bonus / Advanced
- **AI Task Assistant**: Auto-suggest task breakdown for projects, summarize comment threads, predict due dates based on history.
- **Time Tracking**: Built-in timer per task, manual time entry, timesheet export (CSV/PDF), billable hours marking.
- **Advanced Reports**: Velocity charts, burndown charts, custom dashboard widgets, CSV export.
- **White-labeling**: Custom domain mapping, logo upload, CSS variable overrides for enterprise clients.

Final Deliverable
Ready full-stack app: database schema, authentication flow, all UI pages/components, API routes, real-time logic, file handling, permission guards, and deployment configuration (Docker/Dockerfile).
