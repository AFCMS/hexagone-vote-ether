import { useContext } from "react";

import { EthContext } from "./EthContext";

export function useEth() {
  const ctx = useContext(EthContext);
  if (!ctx) throw new Error("EthProvider is missing in the React tree.");
  return ctx;
}

export function useEthWallet() {
  const {
    readProvider,
    provider,
    account,
    balanceEth,
    hasMetaMask,
    autoConnectAttempted,
    showConnectButton,
    error,
    connectWallet,
  } = useEth();
  return {
    readProvider,
    provider,
    account,
    balanceEth,
    hasMetaMask,
    autoConnectAttempted,
    showConnectButton,
    error,
    connectWallet,
  };
}

export function useEthCandidates() {
  const { candidates } = useEth();
  return { candidates };
}

export function useEthVoting() {
  const { vote, isVoting, cooldownSeconds, txHash, lastBlockNumber } = useEth();
  return { vote, isVoting, cooldownSeconds, txHash, lastBlockNumber };
}

export function useEthRealtime() {
  const { lastEvent } = useEth();
  return { lastEvent };
}

export function useEthExplorer() {
  const { explorerEvents, explorerLoading, loadExplorerEvents } = useEth();
  return { explorerEvents, explorerLoading, loadExplorerEvents };
}
