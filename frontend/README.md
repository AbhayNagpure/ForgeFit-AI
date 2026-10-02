# ForgeFit frontend

React 19 and Vite client for ForgeFit. The client renders real workout, nutrition, profile, and progress data returned by the API. Agent conversations are stored by the backend rather than in browser-local chat history.

```bash
npm install
npm run dev
```

The development server proxies `/api` to the backend on port 5000. Production builds use `npm run build`; static output is written to `dist`.
