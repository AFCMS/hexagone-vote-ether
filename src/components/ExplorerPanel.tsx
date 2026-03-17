import type { ExplorerEvent } from "../eth/types";

export function ExplorerPanel(props: {
  readonly open: boolean;
  readonly onToggle: () => void;
  readonly loading: boolean;
  readonly events: readonly ExplorerEvent[];
  readonly onSelectBlock: (blockNumber: number) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <button className="btn btn-outline" onClick={props.onToggle}>
        {props.open ? "Hide" : "Blockchain Explorer"}
      </button>

      {props.open && (
        <div className="overflow-x-auto">
          {props.loading ? (
            <div className="flex items-center gap-2 opacity-70">
              <span className="loading loading-spinner loading-sm" />
              <span>Loading on-chain data...</span>
            </div>
          ) : props.events.length === 0 ? (
            <p className="opacity-70">No votes recorded yet.</p>
          ) : (
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Tx Hash</th>
                  <th>Block</th>
                  <th>Voter</th>
                  <th>Candidate</th>
                  <th>Time</th>
                  <th>Gas Used</th>
                </tr>
              </thead>
              <tbody>
                {props.events.map((e, i) => (
                  <tr
                    key={i}
                    className="cursor-pointer"
                    onClick={() => props.onSelectBlock(e.blockNumber)}
                  >
                    <td>
                      <a
                        className="link link-primary font-mono"
                        href={`https://sepolia.etherscan.io/tx/${e.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(ev) => ev.stopPropagation()}
                      >
                        {e.hash.slice(0, 10)}...{e.hash.slice(-6)}
                      </a>
                    </td>
                    <td className="font-mono">{e.blockNumber}</td>
                    <td className="font-mono">
                      {e.voter
                        ? `${e.voter.slice(0, 10)}...${e.voter.slice(-6)}`
                        : "-"}
                    </td>
                    <td>{e.candidateName}</td>
                    <td>
                      {e.timestamp
                        ? new Date(e.timestamp * 1000).toLocaleString("en-US")
                        : "-"}
                    </td>
                    <td>
                      {e.gasUsed ? `${e.gasUsed.toLocaleString()} units` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
