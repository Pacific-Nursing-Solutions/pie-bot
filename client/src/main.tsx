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
        logo: '🥧'
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
