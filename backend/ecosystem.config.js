/**
 * PM2 Ecosystem Configuration
 * For production deployment on EC2 t2.micro
 */
module.exports = {
  apps: [
    {
      name: "resonance-backend",
      script: "./dist/index.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 3000,
      },
      // Auto-restart on crash
      autorestart: true,
      // Watch for file changes (disable in production)
      watch: false,
      // Max memory before restart (1GB for t2.micro)
      max_memory_restart: "800M",
      // Logging
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      // Merge logs
      merge_logs: true,
      // Restart delay
      min_uptime: "10s",
      max_restarts: 10,
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
    },
  ],
};
