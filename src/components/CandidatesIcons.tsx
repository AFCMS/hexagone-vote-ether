import { candidatesIcons } from "../utils/constants";

interface Candidate {
  id: number;
  name: string;
  votes: number;
}

interface CandidatesIconsProps {
  readonly candidates: readonly Candidate[];
}

export function CandidatesIcons(props: CandidatesIconsProps) {
  return (
    <div className="flex flex-row gap-8 rounded-lg bg-zinc-300">
      {props.candidates.map((candidate) => (
        <div key={candidate.id} className="">
          <img
            src={candidatesIcons[candidate.id] ?? ""}
            alt={candidate.name}
            className="size-32 rounded-full"
          />
          <h3>{candidate.name}</h3>
          <p className="text-lg font-bold">${candidate.votes} votes</p>
        </div>
      ))}
    </div>
  );
}
