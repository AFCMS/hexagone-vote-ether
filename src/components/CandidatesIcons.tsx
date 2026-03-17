import { candidatesIcons } from "../utils/constants";

interface Candidate {
  readonly id: number;
  readonly name: string;
  readonly votes: number;
}

interface CandidatesIconsProps {
  readonly candidates: readonly Candidate[];
  readonly account: string | null;
  readonly cooldownSeconds: number;
  readonly isVoting: boolean;
  readonly onVote: (candidateIndex: number) => void;
}

export function CandidatesIcons(props: CandidatesIconsProps) {
  return (
    <div className="flex flex-row flex-wrap justify-center gap-6">
      {props.candidates.map((candidate) => (
        <div key={candidate.id} className="card w-64 bg-base-100 shadow-sm">
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

          <div className="card-body items-center text-center">
            <h3 className="card-title text-base">{candidate.name}</h3>
            <div className="badge badge-neutral">{candidate.votes} votes</div>

            {props.account && props.cooldownSeconds === 0 && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => props.onVote(candidate.id)}
                disabled={props.isVoting}
              >
                {props.isVoting ? "⏳ En cours..." : "Voter →"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
