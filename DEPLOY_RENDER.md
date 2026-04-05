# Render Deployment

This backend runs on `Node.js + Express + Sequelize + MySQL`.

## Important note about `DB_Script.sql`

The provided `DB_Script.sql` is a Microsoft SQL Server dump, not a MySQL dump. This app is configured for MySQL, so that file cannot be imported directly into the database used by this backend on Render.

The app can create its schema with Sequelize during startup:

- `boot/00_initdb.js` runs `sequelize.sync()` and migrations
- `boot/01_seeddb.js` runs seeds
- `boot/02_default_admin.js` creates default admins

## Render setup

Create a new Web Service from this repo and use the included `render.yaml`, or configure the same values manually:

- Build command: `npm install`
- Start command: `node index.js`
- Health check path: `/`

## Required environment variables

- `NODE_ENV=production`
- `DB_HOST`
- `DB_PORT=3306`
- `DB_NAME`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_CONNECT_TIMEOUT=60000`
- `DB_SSL=false`
- `DB_SSL_REJECT_UNAUTHORIZED=false`
- `API_URL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_SENDER_EMAIL`

## AWS database checklist

If the database is on AWS RDS, Render must be able to reach it over the network:

- The RDS endpoint in `DB_HOST` must be correct
- The RDS port in `DB_PORT` must be correct
- The RDS instance must allow inbound traffic on that port
- The RDS security group must allow traffic from Render
- If the RDS instance is private-only, Render cannot connect without additional networking
- If SSL is enforced by RDS, set `DB_SSL=true`

## Recommended first deploy

Use a clean MySQL database and let Sequelize create the schema automatically on first boot. After that, test:

- `GET /`
- `GET /swagger`

If deploy logs show `connect ETIMEDOUT`, the problem is network access to the database, not npm build or app boot syntax.
