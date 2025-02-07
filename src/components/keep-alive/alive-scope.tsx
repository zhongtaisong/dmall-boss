import { useRef, useState } from "react";
import { KeepAliveContext } from "./keep-alive-context";
import type { INode } from "./types";

export const AliveScope = (props: { children: React.ReactNode }) => {
  const nodes = useRef<{
    [id: string]: INode;
  }>({});
  const [state, setState] = useState<{
    [id: string]: {
      id: string;
      children: React.ReactNode;
    };
  }>({});

  const keep = (id: string, children: React.ReactNode): Promise<INode> => {
    return new Promise(resolve => {
      // 父组件接收到 children 后，将其保存到 state 中。
      setState({
        ...state,
        [id]: { id, children },
      });

      // 往子组件返回真实 DOM 节点
      let dom = nodes.current?.[id];
      if (!dom) {
        const timer = setInterval(() => {
          dom = nodes.current?.[id];
          if (dom) {
            clearInterval(timer);
            resolve(dom);
          }
        }, 100);
      } else {
        resolve(dom);
      }
    });
  };

  return (
    <KeepAliveContext.Provider value={{ keep }}>
      {props?.children}

      <div className="keepers-store">
        {/* 渲染所有的 children */}
        {Object.values(state).map(item => {
          if (!item?.id) return null;

          return (
            <div key={item?.id} ref={node => (nodes.current[item?.id] = node)}>
              {item?.children}
            </div>
          );
        })}
      </div>
    </KeepAliveContext.Provider>
  );
};
