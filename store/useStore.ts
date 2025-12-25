"use client";

import { create } from 'zustand';
import {
  Edge, Node, OnNodesChange, OnEdgesChange, OnConnect,
  applyNodeChanges, applyEdgeChanges, addEdge, MarkerType,
} from 'reactflow';
import { VideoNode, ViewState, VideoNodeData, ProjectData } from '@/types/schema';

const PUBLISHED_KEY = 'tapn-published-projects';
const DRAFTS_KEY = 'tapn-draft-projects';

interface AppState {
  nodes: Node[];
  edges: Edge[];
  playingNodeId: string | null;
  selectedNodeId: string | null;
  startNodeId: string | null;
  
  currentView: ViewState;
  lastView: ViewState;

  // 프로젝트 메타데이터
  currentProjectId: string | null;
  projectTitle: string;

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  
  addNode: (node: VideoNode) => void;
  deleteNode: (id: string) => void;
  setPlayingNodeId: (id: string | null) => void;
  setSelectedNodeId: (id: string | null) => void;
  setStartNodeId: (id: string | null) => void;
  
  setView: (view: ViewState) => void;
  
  // ✨ 제목 수정 액션 추가
  setProjectTitle: (title: string) => void;

  updateNodeData: (id: string, data: Partial<VideoNodeData>) => void;
  syncEdges: () => void;
  
  createProject: () => void;
  openProject: (project: ProjectData) => void;
  saveDraft: () => void;
  deleteDraft: (id: string) => void;
  publishProject: () => void;
  
  loadPublishedProjects: () => ProjectData[];
  loadDraftProjects: () => ProjectData[];
}

export const useStore = create<AppState>((set, get) => ({
  nodes: [],
  edges: [],
  playingNodeId: null,
  selectedNodeId: null,
  startNodeId: null,
  currentView: 'home',
  lastView: 'home',
  currentProjectId: null,
  projectTitle: '제목 없는 프로젝트',

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
  
  setView: (view) => set((state) => ({ 
    currentView: view,
    lastView: state.currentView !== 'player' ? state.currentView : state.lastView
  })),

  // ✨ 제목 실시간 수정
  setProjectTitle: (title) => set({ projectTitle: title }),
  
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

  createProject: () => {
    set({
      currentProjectId: Date.now().toString(),
      projectTitle: '제목 없는 프로젝트', // 기본값 단순화
      nodes: [],
      edges: [],
      startNodeId: null,
      currentView: 'editor'
    });
  },

  openProject: (project) => {
    set({
      currentProjectId: project.id,
      projectTitle: project.title,
      nodes: project.nodes,
      edges: project.edges,
      startNodeId: project.startNodeId,
      currentView: 'editor'
    });
  },

  saveDraft: () => {
    const { currentProjectId, projectTitle, nodes, edges, startNodeId } = get();
    if (!currentProjectId) {
        const newId = Date.now().toString();
        set({ currentProjectId: newId });
    }
    const safeId = get().currentProjectId!;

    const projectData: ProjectData = {
      id: safeId,
      title: projectTitle, // ✨ 수정된 제목 저장
      thumbnail: nodes.find(n => n.id === startNodeId)?.data?.videoUrl || "",
      updatedAt: new Date().toISOString(),
      nodes, edges, startNodeId
    };

    const drafts = get().loadDraftProjects();
    const existingIdx = drafts.findIndex(d => d.id === safeId);
    let newDrafts = [];
    if (existingIdx >= 0) {
      newDrafts = [...drafts];
      newDrafts[existingIdx] = projectData;
    } else {
      newDrafts = [projectData, ...drafts];
    }

    localStorage.setItem(DRAFTS_KEY, JSON.stringify(newDrafts));
    alert("💾 제목 및 내용이 저장되었습니다!");
  },

  // ✨ [핵심 수정] Draft 삭제 시 Published에서도 함께 삭제
  deleteDraft: (id) => {
    if(!confirm("프로젝트를 삭제하시겠습니까?\n(게시된 영상도 홈 화면에서 사라집니다)")) return;
    
    // 1. 내 보관함(Draft)에서 삭제
    const drafts = get().loadDraftProjects();
    const newDrafts = drafts.filter(d => d.id !== id);
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(newDrafts));

    // 2. 홈 화면(Published) 목록에서도 삭제
    const published = get().loadPublishedProjects();
    const newPublished = published.filter(p => p.id !== id);
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(newPublished));

    set({ currentView: 'dashboard' }); 
  },

  publishProject: () => {
    const { currentProjectId, projectTitle, nodes, edges, startNodeId } = get();
    get().saveDraft(); // 최신 상태 저장

    const newProject: ProjectData = {
      id: currentProjectId || Date.now().toString(),
      title: projectTitle, // ✨ 수정된 제목으로 게시
      thumbnail: nodes.find(n => n.id === startNodeId)?.data?.videoUrl || "",
      updatedAt: new Date().toISOString(),
      nodes, edges, startNodeId
    };

    const published = get().loadPublishedProjects();
    const existingIdx = published.findIndex(p => p.id === newProject.id);
    let newPublished = [];
    if (existingIdx >= 0) {
      newPublished = [...published];
      newPublished[existingIdx] = newProject;
    } else {
      newPublished = [newProject, ...published];
    }
    
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(newPublished));
    alert(`🚀 '${projectTitle}' 영상이 게시되었습니다!`);
    set({ currentView: 'home' });
  },

  loadPublishedProjects: () => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(PUBLISHED_KEY);
    return data ? JSON.parse(data) : [];
  },

  loadDraftProjects: () => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(DRAFTS_KEY);
    return data ? JSON.parse(data) : [];
  }
}));