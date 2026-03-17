import { AlertTriangle, ArrowLeft, ArrowRight, X } from "lucide-react";

interface BlockDetailsModalProps {
  readonly open: boolean;
  readonly loading: boolean;
  readonly error: string | null;
  readonly blockNumber: number | null;
  readonly details: {
    parentHash: string;
    gasLimit: string;
    gasUsed: string;
    miner: string;
  } | null;
  readonly onClose: () => void;
  readonly onPrev: () => void;
  readonly onNext: () => void;
}

export function BlockDetailsModal(props: BlockDetailsModalProps) {
  if (!props.open) return null;

  return (
    <dialog open className="modal">
      <div className="modal-box">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-bold">
            Block details #{props.blockNumber ?? "-"}
          </h3>
          <button className="btn btn-sm btn-ghost" onClick={props.onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {props.loading ? (
            <div className="flex items-center gap-2 opacity-70">
              <span className="loading loading-spinner loading-sm" />
              <span>Loading block...</span>
            </div>
          ) : props.error ? (
            <div className="alert alert-error">
              <span className="inline-flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {props.error}
              </span>
            </div>
          ) : props.details ? (
            <div className="space-y-3">
              <div>
                <div className="text-xs opacity-70">parentHash</div>
                <div className="font-mono break-all">
                  {props.details.parentHash}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <div className="text-xs opacity-70">gasLimit</div>
                  <div className="font-mono break-all">
                    {props.details.gasLimit}
                  </div>
                </div>
                <div>
                  <div className="text-xs opacity-70">gasUsed</div>
                  <div className="font-mono break-all">
                    {props.details.gasUsed}
                  </div>
                </div>
                <div>
                  <div className="text-xs opacity-70">miner</div>
                  <div className="font-mono break-all">
                    {props.details.miner}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="opacity-70">-</div>
          )}

          <div className="flex items-center justify-between gap-2 pt-2">
            <button
              className="btn btn-outline btn-sm"
              disabled={
                props.loading ||
                props.blockNumber == null ||
                props.blockNumber <= 0
              }
              onClick={props.onPrev}
            >
              <ArrowLeft className="h-4 w-4" />
              Previous block
            </button>

            <button
              className="btn btn-outline btn-sm"
              disabled={props.loading || props.blockNumber == null}
              onClick={props.onNext}
            >
              Next block
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <button className="modal-backdrop" onClick={props.onClose}>
        close
      </button>
    </dialog>
  );
}
