# To Deploy Development

- Add .env file see env-sample
- Create ecosystem.config.js file
- Create a new user on server machine
- create this file vim ~/.ssh/authorized_keys and paste you local machine ssh keys here
- Install pm2
- pm2 deploy ecosystem.config.js development setup
- pm2 deploy ecosystem.config.js development

# To Deploy Staging
- pm2 deploy ecosystem.config.js staging setup
- pm2 deploy ecosystem.config.js staging

# If Pm2 Command not error then comment out this code in you .bashrc file of your server machine by doing this vim ~/.bashrc
# If not running interactively, don 't do anything
# - case $ - in
# - *
# - i * );;
# - *) return;;
# -esac


# Run this to start api on development

- pm2 start ecosystem.config.js --env development

# Download log files from server
- scp btech@35.193.17.45:/home/btech/apps/develop/current/logs/err.log /Users/nikhil/Downloads

# Render

- See `DEPLOY_RENDER.md` for Render deployment and database setup.
