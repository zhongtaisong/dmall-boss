import mitt from 'mitt';
import type { NavigateOptions, To } from 'react-router';

export interface IEventBus {
    navigate: {
        to: To;
        options?: NavigateOptions;
        delta?: number;
    };
    queryUserInfo: unknown;
    onLanguageChange: IObject;
}

// @ts-ignore
export const eventBus = mitt<IEventBus>();
