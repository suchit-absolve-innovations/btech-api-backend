const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
module.exports = {
  apps: [
    {
      name: 'btech-develop',
      script: './index.js',
      exec_mode: 'fork',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      watch: false,
      watch_ignore: true,
      env_development: {
        PORT: 6600,
        NODE_ENV: 'development'
      }
    },
    {
      name: 'btech-production',
      script: './index.js',
      exec_mode: 'fork',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      watch: false,
      watch_ignore: true,
      env_production: {
        PORT: 7700,
        NODE_ENV: 'production'
      }
    }
  ],

  deploy: {
    development: {
      user: 'root',
      host: '128.199.75.98',
      ref: 'origin/develop',
      repo: 'git@github.com:Dkode/btech.git',
      path: '/root/apps/api/develop',
      'post-deploy': 'npm i && pm2 reload ecosystem.config.js --only btech-develop --env develop'
    },
    production: {
      user: 'root',
      host: '128.199.75.98',
      ref: 'origin/master',
      repo: 'git@github.com:Dkode/btech.git',
      path: '/root/apps/api/production',
      'post-deploy': 'npm i && pm2 reload ecosystem.config.js --only btech-production --env production'
    }
  }
};
