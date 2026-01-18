# Complete Deployment Checklist

Use this checklist to ensure everything is set up correctly before deployment.

## 📋 Pre-Deployment

### ML Training
- [ ] Kaggle credentials configured (`~/.kaggle/kaggle.json`)
- [ ] Datasets downloaded (`python ml_training/download_datasets.py`)
- [ ] Fatigue model trained (`python ml_training/train_fatigue_model.py`)
- [ ] Voice model trained (`python ml_training/train_voice_model.py`)
- [ ] Burnout model trained (`python ml_training/train_burnout_model.py`)
- [ ] Models converted to ONNX (`python ml_training/convert_to_onnx.py`)
- [ ] ONNX models copied to `ml_lambda/models/`

### AWS Setup
- [ ] AWS account created and CLI configured
- [ ] AWS credentials configured (`aws configure`)
- [ ] ECR repository created
- [ ] IAM role for Lambda created
- [ ] EC2 key pair created and downloaded

### Database
- [ ] Supabase project created
- [ ] Database password saved securely
- [ ] Connection string obtained
- [ ] IP whitelist configured (if needed)

## 🚀 Lambda Deployment

- [ ] Docker image built (`docker build -t resonance-ml .`)
- [ ] Docker image tagged for ECR
- [ ] Docker image pushed to ECR
- [ ] Lambda function created
- [ ] Lambda memory set to 3008 MB
- [ ] Lambda timeout set to 30 seconds
- [ ] Lambda Function URL created
- [ ] CORS enabled on Function URL
- [ ] Lambda URL copied to backend `.env`

## 🖥️ EC2 Backend Deployment

- [ ] EC2 instance launched (t2.micro, Ubuntu 22.04)
- [ ] Security group configured:
  - [ ] SSH (port 22) from your IP
  - [ ] HTTP (port 80) from anywhere
  - [ ] HTTPS (port 443) from anywhere
  - [ ] Backend API (port 3000) from anywhere
- [ ] EC2 instance accessible via SSH
- [ ] Node.js 18+ installed
- [ ] PM2 installed globally
- [ ] Swap file created (2GB)
- [ ] Backend code uploaded to EC2
- [ ] Dependencies installed (`npm install`)
- [ ] Prisma Client generated (`npm run prisma:generate`)
- [ ] Database schema pushed (`npm run prisma:push`)
- [ ] `.env` file created with:
  - [ ] `DATABASE_URL`
  - [ ] `JWT_SECRET`
  - [ ] `ML_LAMBDA_URL`
  - [ ] `PORT`
  - [ ] `CORS_ORIGINS`
- [ ] TypeScript built (`npm run build`)
- [ ] PM2 started (`pm2 start ecosystem.config.js`)
- [ ] PM2 saved (`pm2 save`)
- [ ] PM2 startup configured (`pm2 startup`)

## ✅ Testing

### Lambda Testing
- [ ] Lambda health endpoint responds (`GET /`)
- [ ] Fatigue prediction works (`POST /predict/fatigue`)
- [ ] Voice prediction works (`POST /predict/voice`)

### Backend Testing
- [ ] Health endpoint responds (`GET /health`)
- [ ] User registration works (`POST /auth/register`)
- [ ] User login works (`POST /auth/login`)
- [ ] JWT token refresh works (`POST /auth/refresh`)
- [ ] Biometric sync works (`POST /api/sync`)
- [ ] Manager heatmap works (`GET /api/manager/heatmap`)
- [ ] Excuse generation works (`POST /api/generate-excuse`)

### Integration Testing
- [ ] React Native app can connect to backend
- [ ] React Native app can upload files to sync endpoint
- [ ] FlowScore calculation works end-to-end
- [ ] Burnout alerts are created automatically

## 🔒 Security

- [ ] JWT secret is strong and unique
- [ ] Database password is strong
- [ ] Lambda Function URL auth set to NONE (for demo only)
- [ ] CORS origins configured correctly
- [ ] Environment variables not committed to git
- [ ] `.env` file in `.gitignore`

## 📊 Monitoring

- [ ] CloudWatch logs accessible
- [ ] PM2 logs accessible
- [ ] Error tracking configured (optional)
- [ ] Lambda warm-up script running (optional)

## 🎯 Post-Deployment

- [ ] All endpoints tested
- [ ] Documentation updated
- [ ] Team notified of deployment
- [ ] Monitoring alerts configured
- [ ] Backup strategy in place

## 🐛 Troubleshooting

If something fails, check:
1. **Lambda:** CloudWatch logs, Function URL configuration
2. **EC2:** PM2 logs (`pm2 logs`), system resources (`htop`)
3. **Database:** Connection string, network access
4. **CORS:** Origin headers, CORS configuration

## 📝 Notes

- Free Tier limits: 750 EC2 hours/month, 1M Lambda requests/month
- t2.micro has 1GB RAM - build TypeScript locally if possible
- Lambda cold starts: ~2-3 seconds (use warm-up script if needed)
- Database: Supabase free tier has connection limits

---

**Last Updated:** After completing all items, your system should be fully deployed and operational!
