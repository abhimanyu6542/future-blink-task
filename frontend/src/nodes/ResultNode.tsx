import { Handle, Position, NodeProps } from "@xyflow/react";

export interface ResultNodeData {
  response: string;
  loading: boolean;
  [key: string]: unknown;
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="w-6 h-6 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );
}

export default function ResultNode({ data }: NodeProps) {
  const { response, loading } = data as ResultNodeData;

  return (
    <div className="bg-white border-2 border-emerald-400 rounded-2xl shadow-lg p-3 sm:p-4 w-56 sm:w-72">
      <Handle type="target" position={Position.Left} className="!bg-emerald-400" />
      <Handle type="target" position={Position.Top} className="!bg-emerald-400" />
      <p className="text-xs font-semibold text-emerald-500 uppercase tracking-widest mb-2">
        AI Response
      </p>
      {loading ? (
        <Spinner />
      ) : (
        <div className="min-h-[6rem] sm:min-h-[7rem] max-h-40 sm:max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs sm:text-sm text-gray-800 whitespace-pre-wrap">
          {response || (
            <span className="text-gray-400 italic">Response will appear here…</span>
          )}
        </div>
      )}
    </div>
  );
}
