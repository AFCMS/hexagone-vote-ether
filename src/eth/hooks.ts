import { useContext } from "react";

import { EthContext } from "./EthContext";

export function useEth() {
  const ctx = useContext(EthContext);
  if (!ctx) throw new Error("EthProvider is missing in the React tree.");
  return ctx;
}

export function useEthWallet() {
  const { provider, account, balanceEth, error, connectWallet } = useEth();
  return { provider, account, balanceEth, error, connectWallet };
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
