# QuickSight Dashboard Setup for Local Development

This guide explains how to configure your local development environment to work with AWS QuickSight embedded dashboards.

## Problem

When running the app locally at `http://localhost:3000`, QuickSight dashboards fail to load with the error:
```
ap-southeast-2.quicksight.aws.amazon.com refused to connect
```

This happens because AWS QuickSight requires domain whitelisting and has strict Content Security Policy (CSP) rules.

---

## Solution: Files Changed

The following files have been configured to enable QuickSight on localhost:

### 1. ✅ `/src/setupProxy.js` - **NEW FILE**
**Purpose**: Proxy QuickSight requests to bypass CORS restrictions

**Status**: Created automatically

**What it does**:
- Proxies requests to `ap-southeast-2.quicksight.aws.amazon.com`
- Removes CSP headers that block iframe embedding
- Allows development on localhost

### 2. ✅ `/.env` - **UPDATED**
**Purpose**: Development environment configuration

**Changes added**:
```bash
# QuickSight and security settings for local development
DANGEROUSLY_DISABLE_HOST_CHECK=true
SKIP_PREFLIGHT_CHECK=true
WDS_SOCKET_PORT=0
```

**What it does**:
- Disables webpack dev server host checking
- Allows QuickSight iframes to load
- Fixes websocket issues

### 3. ✅ `/public/index.html` - **UPDATED**
**Purpose**: Allow QuickSight iframe embedding

**Changes added**:
```html
<!-- Allow QuickSight iframe embedding for development -->
<meta http-equiv="Content-Security-Policy" content="...">
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN">

<!-- DNS prefetch for QuickSight -->
<link rel="dns-prefetch" href="https://ap-southeast-2.quicksight.aws.amazon.com" />
<link rel="preconnect" href="https://ap-southeast-2.quicksight.aws.amazon.com" crossorigin />
```

**What it does**:
- Sets permissive CSP for development
- Allows QuickSight domains in frame-src
- Pre-connects to QuickSight for faster loading

---

## Installation Steps

### Step 1: Install Required Dependency

The `setupProxy.js` file requires `http-proxy-middleware`. Install it:

```bash
npm install http-proxy-middleware --save-dev
```

**OR with yarn:**
```bash
yarn add http-proxy-middleware --dev
```

### Step 2: Verify File Structure

Ensure these files exist:
```
/home/user/cemp-perf/
├── src/
│   └── setupProxy.js          ✅ NEW
├── public/
│   └── index.html             ✅ UPDATED
├── .env                        ✅ UPDATED
├── .env.production
└── package.json
```

### Step 3: Restart Development Server

**IMPORTANT**: You MUST restart your dev server for changes to take effect:

```bash
# Stop your current server (Ctrl+C)
# Then start again:
npm start
```

### Step 4: Test QuickSight Dashboard

1. Navigate to: `http://localhost:3000`
2. Login with your credentials
3. Go to a project dashboard: `http://localhost:3000/project-sites/100kW_SAUDI/Dashboard`
4. The QuickSight dashboard should now load

---

## Compare with Your Working Project

If you have another project where QuickSight works on localhost, compare these files:

### Files to Check in Working Project:

| File | What to Look For |
|------|------------------|
| **`/src/setupProxy.js`** | QuickSight proxy configuration |
| **`/package.json`** | `"proxy"` field or `http-proxy-middleware` dependency |
| **`/public/index.html`** | CSP meta tags for QuickSight |
| **`/.env`** or **`/.env.local`** | `DANGEROUSLY_DISABLE_HOST_CHECK`, QuickSight URLs |
| **`/public/config.js`** | QuickSight-specific environment variables |
| **`/src/pages/Dashboard/Dashboard.js`** | Embedding SDK version, frame options |
| **`craco.config.js`** or **`config-overrides.js`** | Webpack config overrides |

### Copy These Files If They Exist:

1. **Copy** `setupProxy.js` from working project → this project
2. **Compare** `.env` files and merge QuickSight-related variables
3. **Check** `package.json` for these fields:
   ```json
   {
     "proxy": "https://...",
     "devDependencies": {
       "http-proxy-middleware": "^x.x.x"
     }
   }
   ```

---

## Troubleshooting

### Issue 1: Dashboard Still Not Loading

**Solution**: Clear browser cache and restart server
```bash
# Stop server
# Clear browser cache (Ctrl+Shift+Delete)
npm start
```

### Issue 2: "Proxy error: ECONNREFUSED"

**Cause**: Backend API is not responding

**Solution**: Check that `REACT_APP_SERVER_URL` in `public/config.js` is correct:
```javascript
var REACT_APP_SERVER_URL='https://mcm1cxutqk.execute-api.ap-southeast-2.amazonaws.com/preprod/';
```

### Issue 3: "Cannot find module 'http-proxy-middleware'"

**Cause**: Dependency not installed

**Solution**:
```bash
npm install http-proxy-middleware --save-dev
npm start
```

### Issue 4: CSP Errors in Console

**Symptom**: Console shows "Content Security Policy" violations

**Solution**: Check `public/index.html` has the correct CSP meta tag (already added)

### Issue 5: Still Getting "refused to connect"

**Possible causes**:
1. Server not restarted after changes
2. Browser caching old CSP headers
3. AWS QuickSight account doesn't have `localhost` whitelisted

**Solution**:
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Try incognito/private window
- Ask AWS admin to whitelist `http://localhost:3000` in QuickSight settings

---

## Alternative: AWS QuickSight Whitelisting (Preferred Method)

If you have access to AWS Console:

1. **Login to AWS Console** → QuickSight (region: ap-southeast-2)
2. **Click** your username (top-right) → **Manage QuickSight**
3. **Navigate to**: Security & Permissions → **Domains and Embedding**
4. **Add domains**:
   ```
   http://localhost:3000
   http://localhost:3001
   http://127.0.0.1:3000
   ```
5. **Save** and test

This is the cleanest solution and works without proxy configurations.

---

## Verification Checklist

After setup, verify:

- [ ] `http-proxy-middleware` installed
- [ ] `setupProxy.js` exists in `/src/`
- [ ] `.env` has `DANGEROUSLY_DISABLE_HOST_CHECK=true`
- [ ] `index.html` has CSP meta tags
- [ ] Server restarted with `npm start`
- [ ] Dashboard loads at `http://localhost:3000/project-sites/{project}/Dashboard`
- [ ] No CSP errors in browser console

---

## Production Deployment

**IMPORTANT**: The CSP settings in `index.html` are permissive for development.

For production:

1. Use a stricter CSP policy
2. Remove `DANGEROUSLY_DISABLE_HOST_CHECK` from production `.env`
3. Ensure production domain is whitelisted in QuickSight AWS settings
4. The `setupProxy.js` file is **only used in development** (automatically ignored in production builds)

---

## Summary of Changes

| File | Change | Impact |
|------|--------|--------|
| `src/setupProxy.js` | **NEW** - QuickSight proxy | Bypasses CORS in development |
| `.env` | Added host check disable | Allows localhost QuickSight |
| `public/index.html` | Added CSP meta tags | Allows iframe embedding |
| `public/index.html` | Added DNS prefetch | Faster QuickSight loading |

---

**Date**: 2025-12-24
**Status**: ✅ Configured and ready for testing
**Next Step**: Install `http-proxy-middleware` and restart server
