export const privyConfig = {
  appId: import.meta.env.VITE_PRIVY_APP_ID || 'clpnw9kl4020ql308w3zizjm0',
  config: {
    loginMethods: ['wallet', 'twitter', 'email'] as const,
    appearance: {
      theme: 'light' as const,
      accentColor: '#6366F1',
      logo: undefined,
    },
    embeddedWallets: {
      createOnLogin: 'users-without-wallets' as const,
    },
    externalWallets: {
      coinbaseWallet: {
        connectionOptions: 'all' as const,
      },
      metamask: {
        connectionOptions: 'all' as const,
      },
      walletConnect: {
        connectionOptions: 'all' as const,
      },
    },
    mfa: {
      noPromptOnMfaRequired: false,
    },
  },
};