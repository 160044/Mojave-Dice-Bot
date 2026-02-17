module.exports = {
  apps: [{
    name: 'mojave-bot',
    script: 'npm',
    args: 'run bot',
    cwd: '/path/to/mojave-for-root',  // UPDATE THIS PATH
    interpreter: 'none',
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      BOT_PREFIX: '!'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    merge_logs: true
  }]
};
