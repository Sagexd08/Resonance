# Backend Deployment Guide

## Prerequisites

- Node.js 18+
- PostgreSQL (Supabase)
- AWS EC2 t2.micro instance
- PM2 installed globally

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Prisma

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database (or use migrations)
npm run prisma:push
```

### 3. Environment Variables

Create `.env` file:

```env
DATABASE_URL="postgres://postgres:[PASSWORD]@db.[SUPABASE_REF].supabase.co:5432/postgres"
JWT_SECRET="your-secret-key-here"
ML_LAMBDA_URL="https://[LAMBDA_ID].lambda-url.us-east-1.on.aws"
PORT=3000
CORS_ORIGINS="http://localhost:3000,http://localhost:8081"
```

### 4. Build TypeScript

**Option A: Build Locally (Recommended for t2.micro)**
```bash
npm run build
# Then upload dist/ folder to EC2
```

**Option B: Build on Server**
```bash
# On EC2, create swap file first:
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Then build
npm run build
```

### 5. Deploy with PM2

```bash
# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
# Follow the instructions shown
```

### 6. Monitor

```bash
# View logs
pm2 logs resonance-backend

# View status
pm2 status

# Restart
pm2 restart resonance-backend
```

## API Endpoints

### Sync Biometrics
```
POST /api/sync
Content-Type: multipart/form-data
Body:
  - userId: string
  - audioFile: File
  - imageFile: File
```

### Manager Heatmap
```
GET /api/manager/heatmap?teamId=<team_id>
Headers:
  Authorization: Bearer <token>
```

### Generate Excuse
```
POST /api/generate-excuse
Body:
  {
    "meetingName": "string",
    "managerName": "string"
  }
```

## Troubleshooting

### Out of Memory on t2.micro
- Build TypeScript locally and upload `dist/` folder
- Use swap file (see step 4)
- Reduce PM2 memory limit in `ecosystem.config.js`

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check Supabase connection settings
- Ensure IP is whitelisted in Supabase

### Lambda Timeout
- Increase Lambda timeout in AWS Console
- Check `ML_LAMBDA_URL` is correct
- Verify Lambda function is deployed and accessible
