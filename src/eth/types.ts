export interface Candidate {
  readonly id: number;
  readonly name: string;
  readonly votes: number;
}

export interface LastVoteEvent {
  readonly voter: string;
  readonly candidateName: string;
}

export interface ExplorerEvent {
  readonly hash: string;
  readonly blockNumber: number;
  readonly voter: string;
  readonly candidateName: string;
  readonly timestamp: number | null;
  readonly gasUsed: number | null;
}

export interface EthContextValue {
  readonly provider: import("ethers").BrowserProvider | undefined;
  readonly account: string | null;
  readonly balanceEth: string | null;

  readonly hasMetaMask: boolean;
  readonly autoConnectAttempted: boolean;
  readonly showConnectButton: boolean;

  readonly candidates: readonly Candidate[];

  readonly error: string | null;

  readonly connectWallet: () => Promise<void>;

  readonly isVoting: boolean;
  readonly cooldownSeconds: number;
  readonly txHash: string | null;
  readonly lastBlockNumber: number | null;
  readonly lastEvent: LastVoteEvent | null;
  readonly vote: (candidateIndex: number) => Promise<void>;

  readonly explorerEvents: readonly ExplorerEvent[];
  readonly explorerLoading: boolean;
  readonly loadExplorerEvents: () => Promise<void>;
}
