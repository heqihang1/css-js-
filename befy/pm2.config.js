const appConfig = require('./app.config.js');
module.exports = {
  "apps": [
    {
      "name": appConfig.appKey,
      "cwd": "./dist",
      "script": "./serve.js",
      "log_date_format": "YYYY-MM-DD HH:mm:ss",
      "min_uptime": "200s",
      "max_restarts": 10,
      "cron_restart": "1 0 * * *",
      "watch": true
    }
  ]
}