import { useEther } from "./hooks/use_ether";
import { CandidatesIcons } from "./components/CandidatesIcons";
import { EXPECTED_NETWORK_NAME } from "./utils/constants";

function App() {
  const {
    candidates,
    error,
    account,
    connectWallet,
    vote,
    isVoting,
    cooldownSeconds,
    txHash,
    lastBlockNumber,
  } = useEther();

  return (
    <div className="min-h-dvh bg-base-200">
      <div className="navbar bg-base-100 shadow-sm">
        <div className="mx-auto w-full max-w-5xl px-4">
          <div className="flex w-full items-center justify-between">
            <a className="btn btn-ghost text-xl">Hexagone Vote</a>
            {!account ? (
              <button className="btn btn-primary" onClick={connectWallet}>
                Connect MetaMask
              </button>
            ) : (
              <div className="text-sm">
                <span className="opacity-70">Connected:</span>{" "}
                <span className="font-mono font-semibold">{account}</span>
                <span className="opacity-70"> · </span>
                <span className="font-semibold">{EXPECTED_NETWORK_NAME}</span>
              </div>
            )}
          </div>
        </div>
      </div>

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

            {error && (
              <div className="alert alert-error">
                <span>⚠ {error}</span>
              </div>
            )}

            {account && cooldownSeconds > 0 && (
              <div className="alert alert-warning">
                <div className="flex w-full flex-col gap-1">
                  <p className="font-medium">⏳ Prochain vote disponible dans :</p>
                  <p className="font-mono text-3xl font-bold tabular-nums">
                    {String(Math.floor(cooldownSeconds / 60)).padStart(2, "0")}:
                    {String(cooldownSeconds % 60).padStart(2, "0")}
                  </p>
                  <p className="text-xs opacity-70">
                    La blockchain enregistre l'heure de votre dernier vote via
                    block.timestamp
                  </p>
                </div>
              </div>
            )}

            {txHash && (
              <div className="alert alert-info">
                <span className="break-all">Transaction envoyée : {txHash}</span>
              </div>
            )}

            {lastBlockNumber && (
              <div className="alert alert-success">
                <span>✅ Incluse dans le bloc #{lastBlockNumber}</span>
              </div>
            )}

            <CandidatesIcons
              candidates={candidates}
              account={account}
              cooldownSeconds={cooldownSeconds}
              isVoting={isVoting}
              onVote={vote}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
