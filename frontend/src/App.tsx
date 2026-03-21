import { useCallback, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type OnConnect,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import InputNode, { type InputNodeData } from "./nodes/InputNode";
import ResultNode, { type ResultNodeData } from "./nodes/ResultNode";

const nodeTypes = {
  inputNode: InputNode,
  resultNode: ResultNode,
};

const isMobile = window.innerWidth < 640;

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
    style: { stroke: "#6366f1", strokeWidth: 2 },
    ...(isMobile ? { sourceHandle: null, targetHandle: null } : {}),
  },
];

export default function App() {
  const promptRef = useRef("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Stable callback — never changes, so InputNode never remounts
  const onPromptReady = useCallback((val: string) => {
    promptRef.current = val;
  }, []);

  // Nodes are built once; ResultNode data is updated via setNodes
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([
    {
      id: "1",
      type: "inputNode",
      position: isMobile ? { x: 20, y: 40 } : { x: 80, y: 180 },
      data: { onPromptReady } satisfies InputNodeData,
    },
    {
      id: "2",
      type: "resultNode",
      position: isMobile ? { x: 20, y: 260 } : { x: 520, y: 180 },
      data: { response: "", loading: false } satisfies ResultNodeData,
    },
  ]);

  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  // Update only the result node data
  const updateResultNode = useCallback(
    (patch: Partial<ResultNodeData>) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === "2" ? { ...n, data: { ...n.data, ...patch } } : n
        )
      );
    },
    [setNodes]
  );

  const handleRun = async () => {
    const prompt = promptRef.current.trim();
    if (!prompt) return;

    setLoading(true);
    updateResultNode({ loading: true, response: "" });
    setSaveStatus("idle");

    try {
      const res = await fetch("/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = (await res.json()) as { answer?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      const answer = data.answer ?? "";
      setResponse(answer);
      updateResultNode({ loading: false, response: answer });
    } catch (err) {
      const msg = `Error: ${(err as Error).message}`;
      setResponse(msg);
      updateResultNode({ loading: false, response: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const prompt = promptRef.current.trim();
    if (!prompt || !response.trim()) return;
    setSaveStatus("saving");

    try {
      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, response }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2500);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      {/* Header */}
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

      {/* Flow canvas */}
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
