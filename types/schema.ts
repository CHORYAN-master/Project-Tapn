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

export type ViewState = 'home' | 'editor' | 'player';

export interface ProjectData {
  nodes: VideoNode[];
  edges: any[];
  startNodeId: string | null;
}
