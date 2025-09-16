module.exports = {
  apps: [
    {
      name: "spa-tournament",
      script: "./node_modules/.bin/next",
      args: "start",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
