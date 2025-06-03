export const privyConfig = {
  appId: import.meta.env.VITE_PRIVY_APP_ID || 'demo-app-id',
  config: {
    loginMethods: ['email' as const],
    appearance: {
      theme: 'dark' as const,
      accentColor: '#F4A261' as `#${string}`,
      logo: undefined,
    },
    embeddedWallets: {
      createOnLogin: 'off' as const,
    },
  },
};