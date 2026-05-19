This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy to Tencent Cloud

This repo uses GitHub Actions CD to build a Docker image after CI succeeds, push it to GitHub Container Registry, and restart the app on a Tencent Cloud server with Docker Compose.

Required GitHub repository secrets:

- `SERVER_HOST`: Tencent Cloud server IP or host.
- `SERVER_USER`: SSH user.
- `SERVER_SSH_KEY`: private key for SSH login.
- `DEPLOY_PATH`: directory on the server that contains `docker-compose.yml` and `.env`.
- `DEPLOY_PORT`: optional SSH port, defaults to `22`.

Optional GitHub repository variable:

- `PRODUCTION_URL`: production URL shown in the GitHub deployment environment.

Initial server setup:

```bash
mkdir -p /opt/shanghai-fresh-prices
cd /opt/shanghai-fresh-prices
# Copy this repo's docker-compose.yml here.
# Create .env with DATABASE_URL and any optional runtime variables.
# The default host port is 3002, mapped to container port 3000.
```

If PostgreSQL runs directly on the same Tencent Cloud host instead of inside Docker, use `host.docker.internal` in `DATABASE_URL`; `docker-compose.yml` maps it to the Docker host gateway on Linux.
