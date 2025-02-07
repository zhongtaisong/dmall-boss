import { useEffect, useRef } from "react";
import { withScope } from "./with-scope";
import type { INode, IWithScopeProps } from "./types";

let prev_id = "";
export const ActivationKeepAlive = withScope((props: IWithScopeProps) => {
  const domRef = useRef<{
    [key: string]: INode;
  }>({});

  useEffect(() => {
    init(props);
  }, [props?.id]);

  const init = async ({ id, children, keep }: IWithScopeProps) => {
    // 将 children 传递给父组件，父组件返回真实的 dom 节点
    const dom = await keep?.(id, children);

    if (prev_id) {
      const domRef_item = domRef.current?.[prev_id];
      if (domRef_item) {
        // 清除上一个页面的 dom 节点
        domRef_item.innerHTML = "";
      }

      if (prev_id !== props?.id) {
        // 记录当前 id
        prev_id = props?.id;
      }
    } else {
      // 首次渲染，记录当前 id
      prev_id = props?.id;
    }

    if (dom) {
      // 将真实的 dom 节点挂载到当前组件的 div 上
      domRef?.current?.[props?.id]?.appendChild?.(dom);
    }
  };

  return (
    <div
      className="keep-domRef"
      ref={node => {
        const currentNode = domRef.current?.[props.id];
        if (!currentNode) {
          domRef.current[props?.id] = node;
        }
      }}
    />
  );
});
