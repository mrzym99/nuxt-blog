module.exports = {
  apps: [
    {
      name: 'NuxtBlog',
      port: '3333',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      min_uptime: '60s',
      max_restarts: 10,
      restart_delay: 60,
    },
  ],
};
