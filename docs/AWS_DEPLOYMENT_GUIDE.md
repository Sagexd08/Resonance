# AWS Deployment Guide - Complete Setup

This guide covers all AWS resources needed to deploy the Resonance ML-powered mental health system.

## 📋 Prerequisites

- AWS Account (Free Tier eligible)
- AWS CLI installed and configured
- Docker installed locally
- Node.js 18+ installed locally
- Git installed

## 🏗️ Architecture Overview

```
┌─────────────────┐
│  React Native   │
│     Mobile      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────────┐
│   EC2 t2.micro  │─────▶│  Supabase (DB)   │
│  Node.js Backend│      │   PostgreSQL     │
└────────┬────────┘      └──────────────────┘
         │
         │ HTTP POST
         ▼
┌─────────────────┐
│  AWS Lambda     │
│  ML Inference   │
│  (FastAPI)      │
└─────────────────┘
```

## 📦 Part 1: AWS Lambda ML Service

### Step 1.1: Create ECR Repository

```bash
# Set your AWS region
export AWS_REGION=us-east-1
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Create ECR repository
aws ecr create-repository \
  --repository-name resonance-ml \
  --region $AWS_REGION \
  --image-scanning-configuration scanOnPush=true

# Get login token
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
```

### Step 1.2: Build and Push Docker Image

```bash
cd ml_lambda

# Build Docker image
docker build -t resonance-ml .

# Tag for ECR
docker tag resonance-ml:latest \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/resonance-ml:latest

# Push to ECR
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/resonance-ml:latest
```

### Step 1.3: Create Lambda Function

**Option A: Using AWS Console**

1. Go to **Lambda Console** → **Functions** → **Create function**
2. Select **Container image**
3. Function name: `resonance-ml-inference`
4. Container image URI: Click **Browse images** and select your ECR image
5. Click **Create function**

**Option B: Using AWS CLI**

```bash
# Create Lambda function
aws lambda create-function \
  --function-name resonance-ml-inference \
  --package-type Image \
  --code ImageUri=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/resonance-ml:latest \
  --role arn:aws:iam::$AWS_ACCOUNT_ID:role/lambda-execution-role \
  --timeout 30 \
  --memory-size 3008 \
  --region $AWS_REGION
```

### Step 1.4: Configure Lambda Settings

**In AWS Console:**

1. Go to **Configuration** → **General configuration**
   - **Memory:** 3008 MB (for faster CPU)
   - **Timeout:** 30 seconds
   - **Architecture:** x86_64

2. Go to **Configuration** → **Function URL**
   - Click **Create function URL**
   - **Auth type:** NONE (for hackathon demo)
   - **CORS:** Enable
   - Click **Save**

3. **Copy the Function URL** - You'll need this for backend `.env`

### Step 1.5: Set Up Lambda Warm-up (Optional)

Create a simple script to ping Lambda every 2 minutes to keep it warm:

```bash
# Create warm-up script (run on your laptop)
cat > lambda-warmup.sh << 'EOF'
#!/bin/bash
LAMBDA_URL="https://your-lambda-url.lambda-url.us-east-1.on.aws/"

while true; do
  curl -X GET "$LAMBDA_URL" > /dev/null 2>&1
  echo "Warmed up Lambda at $(date)"
  sleep 120  # 2 minutes
done
EOF

chmod +x lambda-warmup.sh
# Run in background: nohup ./lambda-warmup.sh &
```

## 🖥️ Part 2: EC2 Backend Deployment

### Step 2.1: Launch EC2 Instance

**Using AWS Console:**

1. Go to **EC2 Console** → **Launch Instance**
2. **Name:** `Resonance-Backend`
3. **AMI:** Ubuntu Server 22.04 LTS (Free Tier Eligible)
4. **Instance Type:** t2.micro (Free Tier)
5. **Key Pair:** Create new or select existing (download `.pem` file)
6. **Network Settings:**
   - ✅ Allow HTTP traffic from the internet
   - ✅ Allow HTTPS traffic from the internet
   - **Security Group:** Create new or use existing
7. **Configure Storage:** 8 GB gp3 (Free Tier)
8. Click **Launch Instance**

**Note:** Save your instance's **Public IP** and **Security Group ID**

### Step 2.2: Configure Security Group

```bash
# Get your public IP (for SSH access)
MY_IP=$(curl -s https://checkip.amazonaws.com)

# Allow SSH from your IP
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 22 \
  --cidr $MY_IP/32

# Allow HTTP/HTTPS from anywhere (for API access)
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

# Allow backend port (3000) from anywhere
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxxxxx \
  --protocol tcp \
  --port 3000 \
  --cidr 0.0.0.0/0
```

### Step 2.3: SSH into EC2 and Initial Setup

```bash
# SSH into instance (replace with your key and IP)
ssh -i "your-key.pem" ubuntu@ec2-XX-XXX-XXX-XXX.compute-1.amazonaws.com

# Once connected, run:
```

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs git

# Install PM2 globally
sudo npm install -g pm2

# Install build tools (for native modules)
sudo apt-get install -y build-essential python3

# Create swap file (2GB) for t2.micro memory
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make swap permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verify swap
free -h
```

### Step 2.4: Clone and Setup Backend

```bash
# Clone your repository (or upload files)
git clone https://github.com/yourusername/resonance-backend.git
cd resonance-backend/backend

# Or if you have the files locally, use SCP:
# scp -i "your-key.pem" -r backend/ ubuntu@ec2-XX-XXX-XXX-XXX.compute-1.amazonaws.com:~/
```

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# Create .env file
nano .env
```

**Add to `.env`:**
```env
DATABASE_URL="postgres://postgres:[YOUR_PASSWORD]@db.[SUPABASE_REF].supabase.co:5432/postgres"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
ML_LAMBDA_URL="https://[YOUR_LAMBDA_ID].lambda-url.us-east-1.on.aws"
PORT=3000
CORS_ORIGINS="http://localhost:3000,http://localhost:8081,http://localhost:19000"
NODE_ENV=production
```

### Step 2.5: Database Setup

```bash
# Push Prisma schema to database
npm run prisma:push

# Verify connection
npm run prisma:generate
```

### Step 2.6: Build and Deploy

**Option A: Build Locally (Recommended for t2.micro)**

On your local machine:
```bash
cd backend
npm install
npm run build

# Upload dist folder to EC2
scp -i "your-key.pem" -r dist/ ubuntu@ec2-XX-XXX-XXX-XXX.compute-1.amazonaws.com:~/resonance-backend/backend/
```

On EC2:
```bash
cd ~/resonance-backend/backend

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
# Follow the instructions shown (usually: sudo env PATH=... pm2 startup systemd -u ubuntu --hp /home/ubuntu)
```

**Option B: Build on EC2**

```bash
# Build TypeScript (may take a while on t2.micro)
npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 2.7: Verify Backend is Running

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs resonance-backend

# Test endpoint
curl http://localhost:3000/health
```

## 🔐 Part 3: IAM Roles and Permissions

### Step 3.1: Create Lambda Execution Role

```bash
# Create trust policy
cat > lambda-trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create role
aws iam create-role \
  --role-name lambda-execution-role \
  --assume-role-policy-document file://lambda-trust-policy.json

# Attach basic Lambda execution policy
aws iam attach-role-policy \
  --role-name lambda-execution-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# Get role ARN (needed for Lambda creation)
aws iam get-role --role-name lambda-execution-role --query 'Role.Arn' --output text
```

## 🌐 Part 4: Supabase Database Setup

### Step 4.1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note your:
   - **Database Password** (set during creation)
   - **Project Reference** (in URL: `https://[REF].supabase.co`)
   - **Connection String** (Settings → Database → Connection string)

### Step 4.2: Configure Database Connection

In your backend `.env`:
```env
DATABASE_URL="postgres://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"
```

### Step 4.3: Run Prisma Migrations

```bash
# On EC2 or locally
cd backend
npm run prisma:push
```

## 📱 Part 5: Frontend Configuration

Update your React Native app's API configuration:

```typescript
// config/api.config.ts
export const API_CONFIG = {
  BASE_URL: 'http://[EC2_PUBLIC_IP]:3000',
  ML_LAMBDA_URL: 'https://[LAMBDA_ID].lambda-url.us-east-1.on.aws',
};
```

## 🧪 Part 6: Testing Deployment

### Test Lambda

```bash
# Test Lambda health endpoint
curl https://[LAMBDA_ID].lambda-url.us-east-1.on.aws/

# Test fatigue prediction (requires image file)
curl -X POST https://[LAMBDA_ID].lambda-url.us-east-1.on.aws/predict/fatigue \
  -F "file=@test_image.jpg"

# Test voice prediction (requires audio file)
curl -X POST https://[LAMBDA_ID].lambda-url.us-east-1.on.aws/predict/voice \
  -F "file=@test_audio.wav"
```

### Test Backend

```bash
# Health check
curl http://[EC2_IP]:3000/health

# Register user
curl -X POST http://[EC2_IP]:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://[EC2_IP]:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 💰 Cost Estimation (Free Tier)

- **EC2 t2.micro:** 750 hours/month free
- **Lambda:** 1M requests/month free, 400,000 GB-seconds free
- **ECR:** 500 MB storage free
- **Data Transfer:** 100 GB/month free (outbound)

**Estimated Monthly Cost (if within Free Tier): $0**

## 🔧 Troubleshooting

### Lambda Cold Start Issues

- Use Lambda Provisioned Concurrency (not free)
- Or run warm-up script every 2 minutes
- Consider using Lambda@Edge for better performance

### EC2 Out of Memory

- Increase swap file size
- Build TypeScript locally and upload `dist/`
- Reduce PM2 memory limit in `ecosystem.config.js`

### Database Connection Issues

- Verify Supabase IP whitelist (allow all for demo)
- Check `DATABASE_URL` format
- Verify network connectivity from EC2

### CORS Issues

- Update `CORS_ORIGINS` in backend `.env`
- Configure CORS in Lambda Function URL settings
- Check browser console for specific errors

## 📊 Monitoring

### CloudWatch Logs

```bash
# View Lambda logs
aws logs tail /aws/lambda/resonance-ml-inference --follow

# View EC2 logs (via PM2)
pm2 logs resonance-backend
```

### Set Up Alarms (Optional)

```bash
# Lambda error rate alarm
aws cloudwatch put-metric-alarm \
  --alarm-name lambda-high-errors \
  --alarm-description "Alert when Lambda errors exceed threshold" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1
```

## 🚀 Next Steps

1. ✅ Train ML models (see `ml_training/README.md`)
2. ✅ Deploy Lambda with trained models
3. ✅ Set up EC2 backend
4. ✅ Configure frontend API URLs
5. ✅ Test end-to-end flow
6. ✅ Set up monitoring and alerts

## 📝 Checklist

- [ ] ECR repository created
- [ ] Lambda function created and configured
- [ ] Lambda Function URL created
- [ ] EC2 instance launched
- [ ] Security groups configured
- [ ] Backend deployed to EC2
- [ ] Prisma migrations run
- [ ] Environment variables set
- [ ] PM2 configured and running
- [ ] Lambda warm-up script running (optional)
- [ ] Frontend configured with API URLs
- [ ] End-to-end testing completed

## 🔗 Useful Commands

```bash
# Update Lambda code
docker build -t resonance-ml .
docker tag resonance-ml:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/resonance-ml:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/resonance-ml:latest
aws lambda update-function-code --function-name resonance-ml-inference --image-uri $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/resonance-ml:latest

# Restart backend on EC2
pm2 restart resonance-backend

# View backend logs
pm2 logs resonance-backend --lines 100

# SSH into EC2
ssh -i "your-key.pem" ubuntu@ec2-XX-XXX-XXX-XXX.compute-1.amazonaws.com
```

---

**Note:** This setup is optimized for Free Tier. For production, consider:
- Using RDS instead of Supabase
- Adding CloudFront for CDN
- Using Application Load Balancer
- Setting up auto-scaling
- Using Secrets Manager for sensitive data
- Enabling VPC for Lambda
- Adding WAF for security
