# Heroku Deployment Guide

This guide details the step-by-step procedure to deploy the TechStack AI application to a live Heroku web dyno.

---

## 📋 Prerequisites

1. A **Heroku Account** (with credit card verified to provision add-ons like PostgreSQL/Redis).
2. **Heroku CLI** installed on your system. If not installed, download it from [Heroku CLI Installer](https://devcenter.heroku.com/articles/heroku-cli).
3. **Git** installed on your local computer.

---

## 🚀 Deployment Steps

### 1. Initialize Git Repository
Open your terminal inside the project root directory (`c:/Users/parra/Desktop/devlynx hackathon`) and initialize a git repository:
```bash
git init
git add .
git commit -m "Initial commit: TechStack AI release"
```

### 2. Log In to Heroku
Authenticate your local terminal with your Heroku account:
```bash
heroku login
```
This will open a web browser tab to authorize the CLI.

### 3. Create a Heroku App
Create a new Heroku application container:
```bash
heroku create techstack-ai
```
*(Replace `techstack-ai` with a unique name of your choice if it is already taken).*

### 4. (Optional) Provision PostgreSQL Database
To use a real database instead of the in-memory fallback, attach the Heroku Postgres add-on to your application:
```bash
heroku addons:create heroku-postgresql:essential-mini
```
This command automatically provisions a database and assigns the `DATABASE_URL` environment config variable to your Heroku app.

### 5. Configure Heroku Environment Variables
Set your API keys as Config Vars in Heroku. Run the following commands:
```bash
# Add your Exa AI API Key
heroku config:set EXA_API_KEY=your_exa_api_key

# (Optional) Add your Google Gemini API Key for live AI generation
heroku config:set GEMINI_API_KEY=your_gemini_api_key

# Set environment to production
heroku config:set NODE_ENV=production
```

### 6. Deploy Code to Heroku
Deploy the application by pushing your local git commits to Heroku:
```bash
git push heroku main
```
*(If your local branch is named `master` instead of `main`, run `git push heroku master` or `git push heroku master:main`).*

During the build phase, Heroku will read the root `package.json` and automatically:
1. Run `heroku-postbuild` script:
   - Compile the TypeScript backend (output to `backend/dist`).
   - Build the frontend static assets (output to `frontend/dist`).
2. Read the `Procfile` and launch:
   - `web: npm run start` which runs `node backend/dist/index.js`.
3. Host the React assets statically on the Web port!

### 7. View the Live Application
Once the build and deployment succeed, launch the application in your default browser:
```bash
heroku open
```

---

## 🔍 Troubleshooting Commands

- **Check Server Logs**: To view live console logs and troubleshoot errors:
  ```bash
  heroku logs --tail
  ```
- **Run Migrations Check**: To check status of the database:
  ```bash
  heroku pg:info
  ```
- **Scale Dynos**: Ensure at least one web dyno is running:
  ```bash
  heroku ps:scale web=1
  ```
