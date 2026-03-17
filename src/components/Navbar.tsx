import { EXPECTED_NETWORK_NAME } from "../utils/constants";

interface NavbarProps {
  readonly account: string | null;
  readonly balanceEth: string | null;
  readonly onConnect: () => void;
}

export function Navbar(props: NavbarProps) {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="mx-auto w-full max-w-5xl px-4">
        <div className="flex w-full items-center justify-between">
          <a className="btn btn-ghost text-xl">Hexagone Vote</a>
          {!props.account ? (
            <button className="btn btn-primary" onClick={props.onConnect}>
              Connect MetaMask
            </button>
          ) : (
            <div className="flex flex-wrap items-center justify-end gap-2 text-sm">
              <div>
                <span className="opacity-70">Connected:</span>{" "}
                <span className="font-mono font-semibold">{props.account}</span>
                <span className="opacity-70"> · </span>
                <span className="font-semibold">{EXPECTED_NETWORK_NAME}</span>
              </div>
              {props.balanceEth && (
                <div className="badge badge-ghost font-mono">
                  {Number(props.balanceEth).toFixed(4)} ETH
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
