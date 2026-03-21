import { useState } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";

export interface InputNodeData {
  onPromptReady: (val: string) => void;
  [key: string]: unknown;
}

export default function InputNode({ data }: NodeProps) {
  const { onPromptReady } = data as InputNodeData;
  const [local, setLocal] = useState("");

  return (
    <div className="bg-white border-2 border-indigo-400 rounded-2xl shadow-lg p-3 sm:p-4 w-56 sm:w-72">
      <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-2">
        Input Prompt
      </p>
      <textarea
        className="w-full h-24 sm:h-28 resize-none rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition nodrag"
        placeholder="Type your prompt here…"
        value={local}
        onChange={(e) => {
          setLocal(e.target.value);
          onPromptReady(e.target.value);
        }}
      />
      <Handle type="source" position={Position.Right} className="!bg-indigo-400" />
      <Handle type="source" position={Position.Bottom} className="!bg-indigo-400" />
    </div>
  );
}
