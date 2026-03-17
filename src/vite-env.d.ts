/// <reference types="vite/client" />

/**
 * This is a hack to make vite-imagetools work with typescript.
 */
declare module "*&imagetools" {
  const out: string;
  export default out;
}

interface Window {
  ethereum?: import("ethers").Eip1193Provider;
}
