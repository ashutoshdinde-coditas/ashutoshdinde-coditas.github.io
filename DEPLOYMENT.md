# GitHub Pages Deployment Guide

This guide will help you deploy the Delivery Manager Dashboard to GitHub Pages.

## Prerequisites

1. A GitHub account
2. Git installed on your machine
3. Node.js and npm installed

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it (e.g., `Delivery-Manager-Dashboard` or `delivery-manager-dashboard`)
3. **Important**: Note the exact repository name (case-sensitive)

## Step 2: Update Base Path

If your repository name is different from `Delivery-Manager-Dashboard`, update the base path in `vite.config.ts`:

```typescript
base: process.env.NODE_ENV === 'production' ? '/your-repository-name/' : '/',
```

**Note**: 
- For project pages: Use `/repository-name/` (with trailing slash)
- For user/org pages (username.github.io): Use `/`

## Step 3: Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repository-name.git
git push -u origin main
```

## Step 4: Deploy to GitHub Pages

Run the deployment command:

```bash
npm run deploy
```

This will:
1. Build your project (`npm run build`)
2. Deploy the `dist` folder to the `gh-pages` branch
3. Make your site available at: `https://your-username.github.io/your-repository-name/`

## Step 5: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings**
3. Scroll down to **Pages** section
4. Under **Source**, select `gh-pages` branch
5. Select `/ (root)` folder
6. Click **Save**

Your site will be live in a few minutes at:
`https://your-username.github.io/your-repository-name/`

## Updating Your Site

Whenever you make changes:

1. Commit your changes:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```

2. Deploy again:
   ```bash
   npm run deploy
   ```

## Troubleshooting

- **404 Error**: Check that the base path in `vite.config.ts` matches your repository name exactly
- **Blank Page**: Make sure you've enabled GitHub Pages in repository settings and selected the `gh-pages` branch
- **Assets Not Loading**: Verify the base path includes a trailing slash for project pages
