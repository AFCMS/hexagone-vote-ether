import { candidatesIcons } from "../utils/constants";
import { useEthCandidates, useEthVoting, useEthWallet } from "../eth/hooks";

export function CandidatesIcons() {
  const { candidates } = useEthCandidates();
  const { account } = useEthWallet();
  const { vote, isVoting, cooldownSeconds } = useEthVoting();

  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);

  const leaderId = candidates.reduce<number | null>((leader, c) => {
    if (leader === null) return c.id;
    const leaderVotes = candidates.find((x) => x.id === leader)?.votes;
    if (leaderVotes == null) return c.id;
    return c.votes > leaderVotes ? c.id : leader;
  }, null);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">Results</h2>
        <div className="badge badge-ghost">{totalVotes} total votes</div>
      </div>

      <div className="flex flex-row flex-wrap justify-center gap-6">
        {candidates.map((candidate) => {
          const percentage =
            totalVotes > 0
              ? Math.round((candidate.votes / totalVotes) * 100)
              : 0;

          const isLeader = leaderId != null && candidate.id === leaderId;

          return (
            <div
              key={candidate.id}
              className={
                "card w-64 bg-base-100 shadow-sm " +
                (isLeader ? "ring-1 ring-success" : "")
              }
            >
              <figure className="px-6 pt-6">
                <div className="avatar">
                  <div className="w-28 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                    <img
                      src={candidatesIcons[candidate.id] ?? ""}
                      alt={candidate.name}
                    />
                  </div>
                </div>
              </figure>

              <div className="card-body items-center gap-3 text-center">
                <h3 className="card-title text-base">{candidate.name}</h3>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <div
                    className={
                      "badge " + (isLeader ? "badge-success" : "badge-neutral")
                    }
                  >
                    {candidate.votes} vote(s)
                  </div>
                  <div className="badge badge-outline">{percentage}%</div>
                </div>

                <progress
                  className={
                    "progress w-full " +
                    (isLeader ? "progress-success" : "progress-primary")
                  }
                  value={percentage}
                  max={100}
                />

                {account && cooldownSeconds === 0 && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => vote(candidate.id)}
                    disabled={isVoting}
                  >
                    {isVoting ? "⏳ Voting..." : "Vote →"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
