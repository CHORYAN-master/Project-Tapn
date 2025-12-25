import { ProjectData } from '@/types/schema';

export const SAMPLE_PROJECT: ProjectData = {
  id: 'sample-demo-permanent',
  title: '🎬 샘플: 미미와의 데이트',
  thumbnail: 'https://bfskllce5abng0tv.public.blob.vercel-storage.com/tapn%20sample%201-dojDm8wqzxexlHU3GdO4C5g2msUJ7D.mp4',
  updatedAt: '2025-12-26T00:00:00.000Z',
  isSample: true,
  isLocked: true,
  nodes: [
    {
      id: 'brto0g474',
      type: 'videoNode',
      position: { x: 426.1799191345862, y: 138.81441680433045 },
      data: {
        label: 'Scene 1',
        videoUrl: 'https://bfskllce5abng0tv.public.blob.vercel-storage.com/tapn%20sample%201-dojDm8wqzxexlHU3GdO4C5g2msUJ7D.mp4',
        question: '어디로 갈까?',
        choices: [
          { id: '1766679059009', label: '공원을 좀 걷자', targetNodeId: 'mbgssr3sj' },
          { id: '1766679061302', label: '와인바에서 한잔 더?', targetNodeId: 'sdw9jpazx' }
        ]
      },
      width: 256,
      height: 209,
      selected: false,
      dragging: false
    },
    {
      id: 'mbgssr3sj',
      type: 'videoNode',
      position: { x: 193.4600505778189, y: 397.93873707388894 },
      data: {
        label: 'Scene 2',
        videoUrl: 'https://bfskllce5abng0tv.public.blob.vercel-storage.com/tapn%20sample%202-hRxZdxz5Q1G5Q6bf2pi7XTErLkW8FJ.mp4',
        question: '취한 것 같아요',
        choices: [
          { id: '1766679130782', label: '집에 데려다 줄께', targetNodeId: 'rwk9169im' },
          { id: '1766679130990', label: '우리집에서 한잔 더하자', targetNodeId: 'rwk9169im' }
        ]
      },
      width: 256,
      height: 209,
      selected: false,
      dragging: false
    },
    {
      id: 'sdw9jpazx',
      type: 'videoNode',
      position: { x: 613.0124055221594, y: 396.0167035721129 },
      data: {
        label: 'Scene 3',
        videoUrl: 'https://bfskllce5abng0tv.public.blob.vercel-storage.com/tapn%20sample%203-5k0xMQICrj9lHJPnsJpXoiQLuNirl3.mp4',
        question: '나 다쳤어요ㅜㅜ',
        choices: [
          { id: '1766679213733', label: '우선 집으로 가자!', targetNodeId: 'rwk9169im' },
          { id: '1766679215143', label: '업어 줄께', targetNodeId: 'rwk9169im' }
        ]
      },
      width: 256,
      height: 209,
      selected: false,
      dragging: false
    },
    {
      id: 'rwk9169im',
      type: 'videoNode',
      position: { x: 406.1273724038137, y: 674.7050087505377 },
      data: {
        label: 'Scene 4',
        videoUrl: 'https://bfskllce5abng0tv.public.blob.vercel-storage.com/tapn%20sample%204-DphhtTBwCjE32krWhXfpY3VhXGLi0Y.mp4',
        question: '튜토리얼 끝',
        choices: []
      },
      width: 256,
      height: 209,
      selected: false,
      dragging: false
    }
  ],
  edges: [
    {
      id: 'e-brto0g474-mbgssr3sj',
      source: 'brto0g474',
      target: 'mbgssr3sj',
      animated: true,
      style: { stroke: '#fff', strokeWidth: 2 },
      markerEnd: { type: 'arrowclosed' as const, color: '#fff' }
    },
    {
      id: 'e-brto0g474-sdw9jpazx',
      source: 'brto0g474',
      target: 'sdw9jpazx',
      animated: true,
      style: { stroke: '#fff', strokeWidth: 2 },
      markerEnd: { type: 'arrowclosed' as const, color: '#fff' }
    },
    {
      id: 'e-mbgssr3sj-rwk9169im-1',
      source: 'mbgssr3sj',
      target: 'rwk9169im',
      animated: true,
      style: { stroke: '#fff', strokeWidth: 2 },
      markerEnd: { type: 'arrowclosed' as const, color: '#fff' }
    },
    {
      id: 'e-sdw9jpazx-rwk9169im-1',
      source: 'sdw9jpazx',
      target: 'rwk9169im',
      animated: true,
      style: { stroke: '#fff', strokeWidth: 2 },
      markerEnd: { type: 'arrowclosed' as const, color: '#fff' }
    }
  ],
  startNodeId: 'brto0g474'
};
