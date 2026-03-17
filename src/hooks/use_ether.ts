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
  const [candidates, setCandidates] = useState<readonly Candidate[]>([]);
  const [error, setError] = useState<string>();

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

        if (Number(network.chainId) !== EXPECTED_CHAIN_ID) {
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

  return { provider, candidates, error };
}
