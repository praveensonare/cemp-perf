import { useSelector } from 'react-redux';

export const useNodesData = () => {
  const nodesData = useSelector((state) => state.node);
  return nodesData;
};