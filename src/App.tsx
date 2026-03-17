import { useEffect, useState } from "react";

import { CandidatesIcons } from "./components/CandidatesIcons";
import { Navbar } from "./components/Navbar";
import { StatusAlerts } from "./components/StatusAlerts";
import { ExplorerPanel } from "./components/ExplorerPanel";
import { BlockDetailsModal } from "./components/BlockDetailsModal";
import {
  useEthExplorer,
  useEthRealtime,
  useEthVoting,
  useEthWallet,
} from "./eth/hooks";

function App() {
  const { provider, error, account, balanceEth, connectWallet } =
    useEthWallet();
  const { cooldownSeconds, txHash, lastBlockNumber } = useEthVoting();
  const { lastEvent } = useEthRealtime();
  const { explorerEvents, explorerLoading, loadExplorerEvents } =
    useEthExplorer();

  const [explorerOpen, setExplorerOpen] = useState(false);

  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);
  const [blockError, setBlockError] = useState<string | null>(null);
  const [selectedBlockNumber, setSelectedBlockNumber] = useState<number | null>(
    null,
  );
  const [blockDetails, setBlockDetails] = useState<{
    parentHash: string;
    gasLimit: string;
    gasUsed: string;
    miner: string;
  } | null>(null);

  const loadBlockDetails = async (blockNumber: number) => {
    if (!provider) return;
    setBlockLoading(true);
    setBlockError(null);
    try {
      const b = await provider.getBlock(blockNumber);
      if (!b) {
        setBlockError("Block not found.");
        setBlockDetails(null);
        return;
      }
      setBlockDetails({
        parentHash: b.parentHash,
        gasLimit: b.gasLimit.toString(),
        gasUsed: b.gasUsed.toString(),
        miner: (b as { miner?: string }).miner ?? "-",
      });
    } catch (e) {
      setBlockError(String(e));
      setBlockDetails(null);
    } finally {
      setBlockLoading(false);
    }
  };

  useEffect(() => {
    if (explorerOpen && provider) {
      void loadExplorerEvents();
    }
  }, [explorerOpen, provider, loadExplorerEvents]);

  return (
    <div className="min-h-dvh bg-base-200">
      <Navbar
        account={account}
        balanceEth={balanceEth}
        onConnect={connectWallet}
      />

      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body gap-6">
            <div>
              <h1 className="card-title text-2xl">Vote</h1>
              <p className="opacity-70">
                The results are visible to everyone. To vote, connect your
                MetaMask.
              </p>
            </div>

            <StatusAlerts
              error={error}
              account={account}
              cooldownSeconds={cooldownSeconds}
              txHash={txHash}
              lastBlockNumber={lastBlockNumber}
              lastEvent={lastEvent}
            />

            <CandidatesIcons />

            <div className="divider" />

            <ExplorerPanel
              open={explorerOpen}
              onToggle={() => setExplorerOpen((o) => !o)}
              loading={explorerLoading}
              events={explorerEvents}
              onSelectBlock={(blockNumber) => {
                setExplorerOpen(true);
                setBlockModalOpen(true);
                setSelectedBlockNumber(blockNumber);
                void loadBlockDetails(blockNumber);
              }}
            />

            <BlockDetailsModal
              open={blockModalOpen}
              loading={blockLoading}
              error={blockError}
              blockNumber={selectedBlockNumber}
              details={blockDetails}
              onClose={() => setBlockModalOpen(false)}
              onPrev={() => {
                if (selectedBlockNumber == null) return;
                const next = selectedBlockNumber - 1;
                setSelectedBlockNumber(next);
                void loadBlockDetails(next);
              }}
              onNext={() => {
                if (selectedBlockNumber == null) return;
                const next = selectedBlockNumber + 1;
                setSelectedBlockNumber(next);
                void loadBlockDetails(next);
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
