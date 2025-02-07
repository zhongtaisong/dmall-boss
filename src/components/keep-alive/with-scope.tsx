import { useContext } from "react";
import type { IComponentProps, IWithScopeProps } from "./types";
import { KeepAliveContext } from "./keep-alive-context";

export const withScope = (WrappedComponent: React.FC<IWithScopeProps>) => (props: IComponentProps) => {
    const { keep, } = useContext(KeepAliveContext);
    
    return <WrappedComponent {...props} keep={ keep } />;
};
