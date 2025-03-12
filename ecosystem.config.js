module.exports = {
  apps : [{
    name   : "web_class_backend",
    script : "./dist/app.js",
    env_production: {
      NODE_ENV: "production"
    }
  }]

}
