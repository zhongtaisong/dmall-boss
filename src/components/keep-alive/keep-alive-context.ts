import { createContext } from "react";
import type { IKeep } from "./types";

export const KeepAliveContext = createContext<Partial<{
    keep: IKeep;
}>>({});
