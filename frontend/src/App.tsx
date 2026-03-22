import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import InputNode from "./nodes/InputNode";
import ResultNode from "./nodes/ResultNode";
import { useFlow } from "./hooks/useFlow";

const nodeTypes = {
  inputNode: InputNode,
  resultNode: ResultNode,
};

export default function App() {
  const {
    nodes, edges, loading, response, saveStatus,
    onNodesChange, onEdgesChange, onConnect,
    handleRun, handleSave,
  } = useFlow();

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      <header className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-gray-900 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-indigo-400 text-lg sm:text-xl">⚡</span>
          <h1 className="text-sm sm:text-lg font-bold tracking-tight">FutureBlink AI Flow</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleRun}
            disabled={loading}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold transition"
          >
            {loading && (
              <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            Run Flow
          </button>

          <button
            onClick={handleSave}
            disabled={!response.trim() || saveStatus === "saving"}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold transition"
          >
            {saveStatus === "saving" && (
              <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {saveStatus === "saved" ? "Saved ✓" : saveStatus === "error" ? "Error ✗" : "Save"}
          </button>
        </div>
      </header>

      <div className="flex-1 min-h-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        >
          <Background color="#374151" gap={20} />
          <Controls className="!bg-gray-800 !border-gray-700 !text-white" />
          <MiniMap
            nodeColor={(n) => (n.type === "inputNode" ? "#6366f1" : "#10b981")}
            className="!bg-gray-900 !border-gray-700 hidden sm:block"
          />
        </ReactFlow>
      </div>
    </div>
  );
}
