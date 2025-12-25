"use client";

import { create } from 'zustand';
import {
  Edge, Node, OnNodesChange, OnEdgesChange, OnConnect,
  applyNodeChanges, applyEdgeChanges, addEdge, MarkerType,
} from 'reactflow';
import { VideoNode, ViewState, VideoNodeData } from '@/types/schema';

const PUBLISHED_KEY = 'tapn-published-projects';

interface AppState {
  nodes: Node[];
  edges: Edge[];
  playingNodeId: string | null;
  selectedNodeId: string | null;
  startNodeId: string | null;
  currentView: ViewState;

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  
  addNode: (node: VideoNode) => void;
  deleteNode: (id: string) => void;
  setPlayingNodeId: (id: string | null) => void;
  setSelectedNodeId: (id: string | null) => void;
  setStartNodeId: (id: string | null) => void;
  setView: (view: ViewState) => void;
  updateNodeData: (id: string, data: Partial<VideoNodeData>) => void;
  syncEdges: () => void;
  saveProject: () => void;
  loadProject: () => void;
  resetProject: () => void;
  publishProject: () => void;
}

const STORAGE_KEY = 'interactive-video-project';

export const useStore = create<AppState>((set, get) => ({
  nodes: [],
  edges: [],
  playingNodeId: null,
  selectedNodeId: null,
  startNodeId: null,
  currentView: 'home',

  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
  onConnect: (connection) => set({ edges: addEdge(connection, get().edges) }),
  
  addNode: (node) => {
    const { nodes } = get();
    const isFirst = nodes.length === 0;
    set({ 
      nodes: [...nodes, node],
      startNodeId: isFirst ? node.id : get().startNodeId
    });
  },
  
  deleteNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
      startNodeId: state.startNodeId === id ? null : state.startNodeId
    }));
  },

  setPlayingNodeId: (id) => set({ playingNodeId: id }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setStartNodeId: (id) => set({ startNodeId: id }),
  setView: (view) => set({ currentView: view }),
  
  updateNodeData: (id, newData) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      }),
    });
  },

  syncEdges: () => {
    const { nodes } = get();
    const newEdges: Edge[] = [];
    nodes.forEach((sourceNode) => {
      const choices = sourceNode.data.choices || [];
      choices.forEach((choice: any) => {
        if (choice.targetNodeId) {
          newEdges.push({
            id: `e-${sourceNode.id}-${choice.targetNodeId}`,
            source: sourceNode.id,
            target: choice.targetNodeId,
            animated: true,
            style: { stroke: '#fff', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#fff' },
          });
        }
      });
    });
    set({ edges: newEdges });
  },

  saveProject: () => {
    const { nodes, edges, startNodeId } = get();
    const data = JSON.stringify({ nodes, edges, startNodeId });
    localStorage.setItem(STORAGE_KEY, data);
  },

  loadProject: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        set({ 
          nodes: parsed.nodes || [], 
          edges: parsed.edges || [],
          startNodeId: parsed.startNodeId || null
        });
      } catch (e) {
        console.error('Failed to load project:', e);
      }
    }
  },

  resetProject: () => {
    if (confirm('작업 내용을 초기화하시겠습니까?')) {
      set({ nodes: [], edges: [], startNodeId: null });
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  publishProject: () => {
    const { nodes, edges, startNodeId } = get();
    
    const newProject = {
      id: Date.now().toString(),
      title: nodes.find(n => n.id === startNodeId)?.data?.label || "제목 없는 프로젝트",
      thumbnail: nodes.find(n => n.id === startNodeId)?.data?.videoUrl || "",
      createdAt: new Date().toISOString(),
      data: { nodes, edges, startNodeId }
    };

    const stored = localStorage.getItem(PUBLISHED_KEY);
    const publishedList = stored ? JSON.parse(stored) : [];
    const updatedList = [newProject, ...publishedList];
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(updatedList));

    alert("🚀 TAPN 홈에 성공적으로 게시되었습니다!");
    set({ currentView: 'home' });
  }
}));