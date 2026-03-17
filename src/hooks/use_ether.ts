import { useEffect, useState } from "react";

import { BrowserProvider, Contract } from "ethers";

import {
  CONTRACT_ADDRESS,
  EXPECTED_CHAIN_ID,
  EXPECTED_NETWORK_NAME,
} from "../utils/constants";
import ABI from "../utils/abi.json" with { type: "json" };

export interface Candidate {
  readonly id: number;
  readonly name: string;
  readonly votes: number;
}

export function useEther() {
  const [provider, setProvider] = useState<BrowserProvider>();
  const [account, setAccount] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<readonly Candidate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [lastBlockNumber, setLastBlockNumber] = useState<number | null>(null);

  const loadCandidates = async (provider: BrowserProvider) => {
    const contrat = new Contract(CONTRACT_ADDRESS, ABI, provider);
    const count = await contrat.getCandidatesCount();
    const list = [];
    for (let i = 0; i < Number(count); i++) {
      const [name, voteCount] = await contrat.getCandidate(i);
      list.push({ id: i, name, votes: Number(voteCount) });
    }
    setCandidates(list);
  };

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) return;
      try {
        const p = new BrowserProvider(window.ethereum);
        const network = await p.getNetwork();

        if (network.chainId !== BigInt(EXPECTED_CHAIN_ID)) {
          setError(
            `Wrong network. Expected ${EXPECTED_NETWORK_NAME} (${EXPECTED_CHAIN_ID}), got ${network.name} (${network.chainId})`,
          );
          return;
        }

        setProvider(p);
        await loadCandidates(p);
      } catch (e) {
        console.error(e);
        setError(String(e));
      }
    };
    init();
  }, []);

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

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError("MetaMask not installed.");
        return;
      }

      const _provider = new BrowserProvider(window.ethereum);
      await _provider.send("eth_requestAccounts", []);

      const network = await _provider.getNetwork();
      if (network.chainId !== BigInt(EXPECTED_CHAIN_ID)) {
        setError(
          `Wrong network - connect MetaMask to ${EXPECTED_NETWORK_NAME}.`,
        );
        return;
      }

      const signer = await _provider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);
      setProvider(_provider);
      setError(null);

      await loadCandidates(_provider);
    } catch {
      setError("Connection refused.");
    }
  };

  const vote = async (candidateIndex: number) => {
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
  };

  return {
    provider,
    account,
    candidates,
    error,
    connectWallet,
    isVoting,
    cooldownSeconds,
    txHash,
    lastBlockNumber,
    vote,
  };
}
