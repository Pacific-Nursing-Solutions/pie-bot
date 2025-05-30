export const privyConfig = {
  appId: import.meta.env.VITE_PRIVY_APP_ID || 'demo-app-id',
  config: {
    loginMethods: ['wallet', 'twitter', 'email'],
    appearance: {
      theme: 'light' as const,
      accentColor: '#6366F1' as `#${string}`,
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