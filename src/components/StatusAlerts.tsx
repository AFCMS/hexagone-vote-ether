import type { LastVoteEvent } from "../eth/types";

interface StatusAlertsProps {
  readonly error: string | null;
  readonly account: string | null;
  readonly cooldownSeconds: number;
  readonly txHash: string | null;
  readonly lastBlockNumber: number | null;
  readonly lastEvent: LastVoteEvent | null;
}

export function StatusAlerts(props: StatusAlertsProps) {
  const isConfirmed = props.lastBlockNumber != null;
  const showPendingTx = props.txHash != null && !isConfirmed;
  const hideLastEvent =
    isConfirmed &&
    props.txHash != null &&
    props.lastEvent?.txHash != null &&
    props.lastEvent.txHash === props.txHash;

  return (
    <>
      {props.error && (
        <div className="alert alert-error">
          <span>⚠ {props.error}</span>
        </div>
      )}

      {props.account && props.cooldownSeconds > 0 && (
        <div className="alert alert-warning">
          <div className="flex w-full flex-col gap-1">
            <p className="font-medium">⏳ Next vote available in:</p>
            <p className="font-mono text-3xl font-bold tabular-nums">
              {String(Math.floor(props.cooldownSeconds / 60)).padStart(2, "0")}:
              {String(props.cooldownSeconds % 60).padStart(2, "0")}
            </p>
          </div>
        </div>
      )}

      {showPendingTx && (
        <div className="alert alert-info">
          <span className="break-all">Transaction sent: {props.txHash}</span>
        </div>
      )}

      {props.lastBlockNumber != null && (
        <div className="alert alert-success">
          <span>
            ✅ Confirmed in block #{props.lastBlockNumber}
            {props.txHash && (
              <>
                {" "}
                ·{" "}
                <a
                  className="link link-primary"
                  href={`https://sepolia.etherscan.io/tx/${props.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Etherscan
                </a>
              </>
            )}
          </span>
        </div>
      )}

      {props.lastEvent && !hideLastEvent && (
        <div className="alert alert-success">
          <span>
            ⚡ New vote - <strong>{props.lastEvent.voter}</strong> voted for{" "}
            <strong>{props.lastEvent.candidateName}</strong>
          </span>
        </div>
      )}
    </>
  );
}
