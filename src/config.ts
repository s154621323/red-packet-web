import { createConfig, http } from "wagmi";
import { getDefaultConfig } from "connectkit";

const localhost = {
  id: 1337,  // 本地网络ID
  name: 'Localhost',
  network: 'localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://localhost:7545'] },
    public: { http: ['http://localhost:7545'] },
  },
  testnet: true,
}

export const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [localhost],
    transports: {
      // RPC URL for each chain
      [localhost.id]: http(
        `http://localhost:7545`,
      ),
    },

    // Required API Keys
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,

    // Required App Info
    appName: "Red Packet",

    // Optional App Info
    appDescription: "Red Packet",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);