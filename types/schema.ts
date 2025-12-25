import { Node, Edge } from 'reactflow';

export interface Choice {
  id: string;
  label: string;
  targetNodeId: string;
}

export interface VideoNodeData {
  label: string;
  videoUrl: string;
  question: string;
  choices: Choice[];
}

export interface VideoNode extends Node {
  type: 'videoNode';
  data: VideoNodeData;
}

export type ViewState = 'home' | 'editor' | 'player';

export interface ProjectData {
  nodes: VideoNode[];
  edges: Edge[];
  startNodeId: string | null;
  isPublished: boolean;
}

export interface ProgressState {
  played: number;
  playedSeconds?: number;
  loaded?: number;
  loadedSeconds?: number;
}

// URL 검증
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isYouTubeUrl = (url: string): boolean => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

export const isBlobUrl = (url: string): boolean => {
  return url.startsWith('blob:') || url.includes('blob.vercel');
};

// 순환 참조 검사
export const hasCircularReference = (
  nodeId: string,
  targetNodeId: string,
  nodes: VideoNode[]
): boolean => {
  const visited = new Set<string>();
  
  const dfs = (currentId: string): boolean => {
    if (currentId === nodeId) return true;
    if (visited.has(currentId)) return false;
    
    visited.add(currentId);
    const node = nodes.find(n => n.id === currentId);
    
    if (!node) return false;
    
    for (const choice of node.data.choices) {
      if (choice.targetNodeId && dfs(choice.targetNodeId)) {
        return true;
      }
    }
    
    return false;
  };
  
  return dfs(targetNodeId);
};
