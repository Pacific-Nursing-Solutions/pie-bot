export const privyConfig = {
  appId: import.meta.env.VITE_PRIVY_APP_ID || 'demo-app-id',
  config: {
    loginMethods: ['wallet', 'email'],
    appearance: {
      theme: 'light' as const,
      accentColor: '#f97316' as `#${string}`, // orange-500 brand color
      logo: undefined,
    },
    embeddedWallets: {
      createOnLogin: 'users-without-wallets' as const,
    },
    externalWallets: {
      metamask: {},
      coinbaseWallet: {},
    },
  },
};