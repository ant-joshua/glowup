module.exports = {
  apps: [
    {
      name: "glowup",
      script: "node_modules/.bin/next",
      args: "start -p 5001",
      watch: false,
      env: {
        APP_PORT: 5001,
        NODE_ENV: "production"
      },
      instances: "2",
      autorestart: true,
      max_memory_restart: "512M"
    }
  ]
};
