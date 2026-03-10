# Mail Sender Manager

A full-stack app for managing email letters and scheduling them to Gmail via cron jobs.

## Stack
- **Frontend**: Next.js, TanStack Query + Table, Ant Design, Apollo Client (GraphQL)
- **Backend**: NestJS, GraphQL, Prisma, Nodemailer, dynamic cron

## Quick Start

### Backend
```bash
cd backend
npm install
# Edit .env: set GMAIL_USER and GMAIL_APP_PASSWORD (Gmail App Password)
npx prisma migrate dev --name init
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000. Default redirects to `/letters`.

## Gmail Setup
1. Enable 2FA on your Google account
2. Create an App Password: Google Account → Security → App passwords
3. Put the 16-char password in `GMAIL_APP_PASSWORD` (with or without spaces)
