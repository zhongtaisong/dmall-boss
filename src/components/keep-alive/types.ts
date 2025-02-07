export interface IComponentProps {
    id: string;
    children: React.ReactNode;
}

export type INode = HTMLDivElement | null;

export type IKeep = (id: string, children: React.ReactNode) => Promise<INode>;

export type IWithScopeProps = IComponentProps & {
    keep: IKeep | undefined;
}
