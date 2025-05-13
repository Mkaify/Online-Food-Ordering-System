# Important Instructions for Netlify Site Admin

## Next.js Plugin Issue

This project is a **static-only** landing page deployment. It **does not** use Next.js for the deployed version.

However, it appears that the Next.js plugin is still active on your Netlify site configuration, which is causing deployment errors.

## How to Fix

1. Go to your Netlify site dashboard
2. Navigate to **Build & Deploy** > **Build Settings**
3. Click on **Edit settings** > **Build plugins**
4. Find the **Next.js** plugin (@netlify/plugin-nextjs)
5. Click **Remove** or disable the plugin
6. Save your changes
7. Trigger a new deployment

## Why This Is Necessary

The deployment is failing because the Next.js plugin is looking for Next.js build artifacts that don't exist in this static deployment. The only way to fully disable the plugin is to remove it from the Netlify UI.

If you're seeing errors like:
```
Plugin "@netlify/plugin-nextjs" failed
Error: Your publish directory does not contain expected Next.js build output. Please check your build settings
```

Then this is the issue that needs to be fixed. 