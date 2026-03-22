import { useCallback, useRef, useState } from "react";
import { addEdge, useNodesState, useEdgesState, type Node, type Edge, type OnConnect } from "@xyflow/react";
import { askAI, saveConversation } from "../api/ai.api";
import type { InputNodeData } from "../nodes/InputNode";
import type { ResultNodeData } from "../nodes/ResultNode";

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

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useFlow() {
  const promptRef = useRef("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const onPromptReady = useCallback((val: string) => {
    promptRef.current = val;
  }, []);

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

  const updateResultNode = useCallback(
    (patch: Partial<ResultNodeData>) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === "2" ? { ...n, data: { ...n.data, ...patch } } : n))
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
      const answer = await askAI(prompt);
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
      await saveConversation(prompt, response);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2500);
    }
  };

  return {
    nodes,
    edges,
    loading,
    response,
    saveStatus,
    onNodesChange,
    onEdgesChange,
    onConnect,
    handleRun,
    handleSave,
  };
}
