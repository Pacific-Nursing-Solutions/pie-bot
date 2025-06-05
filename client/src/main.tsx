import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./hooks/use-dark-mode";
import { PrivyProvider } from '@privy-io/react-auth';

createRoot(document.getElementById("root")!).render(
  <PrivyProvider
    appId={import.meta.env.VITE_PRIVY_APP_ID}
    config={{
      loginMethods: ['wallet', 'email', 'google'],
      appearance: {
        theme: 'light',
        accentColor: '#f97316',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iNiIgeT0iOCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjEwIiByeD0iMyIgcnk9IjMiIGZpbGw9IiNmOTczMTYiIHN0cm9rZT0iI2VhNTgwYyIgc3Ryb2tlLXdpZHRoPSIxIi8+CjxyZWN0IHg9IjExIiB5PSI1IiB3aWR0aD0iMiIgaGVpZ2h0PSIzIiBmaWxsPSIjZWE1ODBjIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iNCIgcj0iMS41IiBmaWxsPSIjZWE1ODBjIi8+CjxjaXJjbGUgY3g9IjkuNSIgY3k9IjEyIiByPSIxLjUiIGZpbGw9IiNmZmZmZmYiLz4KPGNpcmNsZSBjeD0iMTQuNSIgY3k9IjEyIiByPSIxLjUiIGZpbGw9IiNmZmZmZmYiLz4KPGNpcmNsZSBjeD0iOS41IiBjeT0iMTIiIHI9IjAuNSIgZmlsbD0iIzFmMjkzNyIvPgo8Y2lyY2xlIGN4PSIxNC41IiBjeT0iMTIiIHI9IjAuNSIgZmlsbD0iIzFmMjkzNyIvPgo8cmVjdCB4PSIxMCIgeT0iMTUiIHdpZHRoPSI0IiBoZWlnaHQ9IjEuNSIgcng9IjAuNzUiIGZpbGw9IiNlYTU4MGMiLz4KPHJlY3QgeD0iNSIgeT0iMTAiIHdpZHRoPSIxIiBoZWlnaHQ9IjIiIGZpbGw9IiNlYTU4MGMiLz4KPHJlY3QgeD0iMTgiIHk9IjEwIiB3aWR0aD0iMSIgaGVpZ2h0PSIyIiBmaWxsPSIjZWE1ODBjIi8+Cjwvc3ZnPgo='
      },
      embeddedWallets: {
        createOnLogin: 'users-without-wallets'
      }
    }}
  >
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </PrivyProvider>
);
