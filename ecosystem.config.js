module.exports = {
  apps : [{
    script: 'server.js',
    watch: '.',
      name: "cudua-commerce-backend",
      exec_mode: "cluster",
      instances: 'max',
      args: 'start',
      ignore_watch : ["./node_modules", "./uploads/*"],
      env: {
        "NODE_ENV": "production",
        "PORT": 4000,
      }
  }],
};
