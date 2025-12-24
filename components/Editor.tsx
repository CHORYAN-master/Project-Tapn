"use client";
import React, { useCallback } from 'react';
import ReactFlow, { Background, Controls, Panel, NodeTypes, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import { useStore } from '@/store/useStore';
import CustomNode from './CustomNode';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';

const nodeTypes: NodeTypes = { videoNode: CustomNode };

export default function Editor() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, setSelectedNodeId } = useStore();

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, [setSelectedNodeId]);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  return (
    <div className="w-full h-screen bg-gray-900 relative">
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        onNodesChange={onNodesChange} 
        onEdgesChange={onEdgesChange} 
        onConnect={onConnect} 
        nodeTypes={nodeTypes} 
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
      >
        <Background gap={16} size={1} color="#333" />
        <Controls />
        
        <Panel position="top-left">
          <Toolbar />
        </Panel>
      </ReactFlow>
      
      <Sidebar />
    </div>
  );
}
