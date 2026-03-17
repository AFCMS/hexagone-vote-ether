import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import { BrowserProvider, Contract, formatEther } from "ethers";

import {
  CONTRACT_ADDRESS,
  EXPECTED_CHAIN_ID,
  EXPECTED_NETWORK_NAME,
} from "../utils/constants";
import ABI from "../utils/abi.json" with { type: "json" };
import type {
  Candidate,
  EthContextValue,
  ExplorerEvent,
  LastVoteEvent,
} from "./types";

import { EthContext } from "./EthContext";

export function EthProvider(props: { readonly children: ReactNode }) {
  const [provider, setProvider] = useState<BrowserProvider>();
  const [account, setAccount] = useState<string | null>(null);
  const [balanceEth, setBalanceEth] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<readonly Candidate[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [autoConnectAttempted, setAutoConnectAttempted] = useState(false);

  const [isVoting, setIsVoting] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [lastBlockNumber, setLastBlockNumber] = useState<number | null>(null);
  const [lastEvent, setLastEvent] = useState<LastVoteEvent | null>(null);

  const [explorerEvents, setExplorerEvents] = useState<
    readonly ExplorerEvent[]
  >([]);
  const [explorerLoading, setExplorerLoading] = useState(false);

  const candidatesRef = useRef(candidates);
  useEffect(() => {
    candidatesRef.current = candidates;
  }, [candidates]);

  const loadCandidates = useCallback(async (p: BrowserProvider) => {
    const contract = new Contract(CONTRACT_ADDRESS, ABI, p);
    const count = await contract.getCandidatesCount();
    const list: Candidate[] = [];

    for (let i = 0; i < Number(count); i++) {
      const [name, voteCount] = await contract.getCandidate(i);
      list.push({ id: i, name, votes: Number(voteCount) });
    }

    setCandidates(list);
  }, []);

  const refreshBalance = useCallback(
    async (p: BrowserProvider, addr: string) => {
      try {
        const bal = await p.getBalance(addr);
        setBalanceEth(formatEther(bal));
      } catch {
        setBalanceEth(null);
      }
    },
    [],
  );

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) {
        setHasMetaMask(false);
        setAutoConnectAttempted(true);
        setError("MetaMask not installed.");
        return;
      }

      setHasMetaMask(true);

      try {
        const p = new BrowserProvider(window.ethereum);
        const network = await p.getNetwork();

        if (network.chainId !== BigInt(EXPECTED_CHAIN_ID)) {
          setError(
            `Wrong network. Expected ${EXPECTED_NETWORK_NAME} (${EXPECTED_CHAIN_ID}), got ${network.name} (${network.chainId})`,
          );
          setAutoConnectAttempted(true);
          return;
        }

        setProvider(p);
        setError(null);

        await loadCandidates(p);

        try {
          const accounts = (await p.send("eth_accounts", [])) as string[];
          const addr = accounts?.[0];
          if (addr) {
            setAccount(addr);
            void refreshBalance(p, addr);
          }
        } catch {
          // Ignore: auto-connect is best-effort and should not block app load.
        }

        setAutoConnectAttempted(true);
      } catch (e) {
        console.error(e);
        setError(String(e));
        setAutoConnectAttempted(true);
      }
    };

    void init();
  }, [loadCandidates, refreshBalance]);

  useEffect(() => {
    if (!provider || !account) {
      setBalanceEth(null);
      return;
    }

    void refreshBalance(provider, account);
  }, [provider, account, refreshBalance]);

  useEffect(() => {
    type AccountsChangedHandler = (accounts: string[]) => void;
    type EthereumWithEvents = import("ethers").Eip1193Provider & {
      on?: (event: "accountsChanged", handler: AccountsChangedHandler) => void;
      removeListener?: (
        event: "accountsChanged",
        handler: AccountsChangedHandler,
      ) => void;
    };

    const eth = window.ethereum as EthereumWithEvents | undefined;
    if (!eth?.on) return;

    const handler: AccountsChangedHandler = (accounts) => {
      const next = accounts?.[0] ?? null;
      setAccount(next);

      setTxHash(null);
      setLastBlockNumber(null);
      setCooldownSeconds(0);
      setLastEvent(null);
      setError(null);

      if (!provider || !next) {
        setBalanceEth(null);
        return;
      }

      void refreshBalance(provider, next);
    };

    eth.on("accountsChanged", handler);
    return () => {
      eth.removeListener?.("accountsChanged", handler);
    };
  }, [provider, refreshBalance]);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;

    const timer = window.setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldownSeconds]);

  useEffect(() => {
    if (!provider) return;

    let listenContract: Contract | undefined;
    try {
      listenContract = new Contract(CONTRACT_ADDRESS, ABI, provider);

      const handler = (voter: string, candidateIndex: bigint) => {
        const idx = Number(candidateIndex);
        const candidateName =
          candidatesRef.current[idx]?.name ?? `Candidate #${idx}`;

        setLastEvent({
          voter: `${voter.slice(0, 6)}...${voter.slice(-4)}`,
          candidateName,
        });

        void loadCandidates(provider);
      };

      listenContract.on("Voted", handler);
      return () => {
        listenContract?.off("Voted", handler);
      };
    } catch (err) {
      const message = (err as { message?: unknown })?.message;
      console.warn(
        "Unable to listen to events:",
        typeof message === "string" ? message : err,
      );
    }
  }, [provider, loadCandidates]);

  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) {
        setError("MetaMask not installed.");
        return;
      }

      const p = new BrowserProvider(window.ethereum);
      await p.send("eth_requestAccounts", []);

      const network = await p.getNetwork();
      if (network.chainId !== BigInt(EXPECTED_CHAIN_ID)) {
        setError(
          `Wrong network - connect MetaMask to ${EXPECTED_NETWORK_NAME}.`,
        );
        return;
      }

      const signer = await p.getSigner();
      const address = await signer.getAddress();

      setAccount(address);
      setProvider(p);
      setError(null);

      void refreshBalance(p, address);
      await loadCandidates(p);
    } catch {
      setError("Connection refused.");
    }
  }, [loadCandidates, refreshBalance]);

  const vote = useCallback(
    async (candidateIndex: number) => {
      if (!provider) {
        setError("Wallet not connected.");
        return;
      }
      if (!account) {
        setError("Connect MetaMask to vote.");
        return;
      }

      try {
        setIsVoting(true);
        setError(null);

        const signer = await provider.getSigner();
        const voteContract = new Contract(CONTRACT_ADDRESS, ABI, signer);

        const secondsLeft = Number(
          await voteContract.getTimeUntilNextVote(account),
        );
        if (secondsLeft > 0) {
          setCooldownSeconds(secondsLeft);
          return;
        }

        const tx = await voteContract.vote(candidateIndex);
        setTxHash(tx.hash);

        const receipt = await tx.wait();
        setLastBlockNumber(Number(receipt.blockNumber));

        await loadCandidates(provider);
        void refreshBalance(provider, account);

        setCooldownSeconds(3 * 60);
      } catch (err) {
        const code = (err as { code?: unknown })?.code;
        const message = (err as { message?: unknown })?.message;

        if (code === 4001 || code === "ACTION_REJECTED") {
          setError("Transaction cancelled.");
        } else {
          setError(
            `Error: ${typeof message === "string" ? message : String(err)}`,
          );
        }
      } finally {
        setIsVoting(false);
      }
    },
    [provider, account, loadCandidates, refreshBalance],
  );

  const loadExplorerEvents = useCallback(async () => {
    if (!provider) return;
    setExplorerLoading(true);

    try {
      const ec = new Contract(CONTRACT_ADDRESS, ABI, provider);
      const filter = ec.filters.Voted();

      let raw: unknown[] = [];
      try {
        raw = await ec.queryFilter(filter, -1000);
      } catch {
        const current = await provider.getBlockNumber();
        const fromBlock = Math.max(0, current - 1000);
        raw = await ec.queryFilter(filter, fromBlock);
      }

      const last20 = raw.slice(-20).reverse();
      const enriched = await Promise.all(
        last20.map(async (e) => {
          type VotedEventLog = {
            readonly transactionHash: string;
            readonly blockNumber: number;
            readonly args?: {
              readonly voter?: string;
              readonly candidateIndex?: bigint;
            };
          };

          const ev = e as VotedEventLog;
          const voter = String(ev.args?.voter ?? "");
          const idx = Number(ev.args?.candidateIndex ?? 0n);

          let timestamp: number | null = null;
          let gasUsed: number | null = null;

          try {
            const block = await provider.getBlock(ev.blockNumber);
            timestamp = block?.timestamp ?? null;
          } catch {
            /* silent */
          }

          try {
            const receipt = await provider.getTransactionReceipt(
              ev.transactionHash,
            );
            gasUsed = receipt?.gasUsed != null ? Number(receipt.gasUsed) : null;
          } catch {
            /* silent */
          }

          return {
            hash: String(ev.transactionHash),
            blockNumber: Number(ev.blockNumber),
            voter,
            candidateName:
              candidatesRef.current[idx]?.name ?? `Candidate #${idx}`,
            timestamp,
            gasUsed,
          } satisfies ExplorerEvent;
        }),
      );

      setExplorerEvents(enriched);
    } catch {
      setExplorerEvents([]);
    } finally {
      setExplorerLoading(false);
    }
  }, [provider]);

  const value = useMemo(
    () =>
      ({
        provider,
        account,
        balanceEth,
        hasMetaMask,
        autoConnectAttempted,
        showConnectButton: hasMetaMask && autoConnectAttempted && !account,
        candidates,
        error,
        connectWallet,
        isVoting,
        cooldownSeconds,
        txHash,
        lastBlockNumber,
        lastEvent,
        vote,
        explorerEvents,
        explorerLoading,
        loadExplorerEvents,
      }) satisfies EthContextValue,
    [
      provider,
      account,
      balanceEth,
      hasMetaMask,
      autoConnectAttempted,
      candidates,
      error,
      connectWallet,
      isVoting,
      cooldownSeconds,
      txHash,
      lastBlockNumber,
      lastEvent,
      vote,
      explorerEvents,
      explorerLoading,
      loadExplorerEvents,
    ],
  );

  return (
    <EthContext.Provider value={value}>{props.children}</EthContext.Provider>
  );
}
