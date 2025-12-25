import { Node } from 'reactflow';

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

// ✨ 여기에 'dashboard'를 추가했습니다!
export type ViewState = 'home' | 'editor' | 'player' | 'dashboard';

export interface ProjectData {
  id: string;
  title: string;
  thumbnail: string;
  updatedAt: string;
  nodes: VideoNode[];
  edges: any[];
  startNodeId: string | null;
}