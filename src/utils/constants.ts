export const CONTRACT_ADDRESS = "0x07dc061bf3C8e7F5dB6d908B4E86eB9F0ab5fa35";
export const EXPECTED_CHAIN_ID = 11155111;
export const EXPECTED_NETWORK_NAME = "Sepolia";

export const SEPOLIA_RPC_URL =
  import.meta.env.VITE_SEPOLIA_RPC_URL ??
  "https://ethereum-sepolia.publicnode.com";

import leonBlum from "../assets/leon_blum.png?h=112&w=112&format=avif&imagetools";
import chirac from "../assets/chirac.png?h=112&w=112&format=avif&imagetools";
import mitterrand from "../assets/mitterrand.png?h=112&w=112&format=avif&imagetools";

export const candidatesIcons = [leonBlum, chirac, mitterrand] as const;
