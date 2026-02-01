"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { ConfiguratorState, ConfiguratorData } from "./configurator.types";
import { configuratorReducer, ConfiguratorAction, initialState } from "./configurator.reducer";

interface ConfiguratorContextType {
    state: ConfiguratorState;
    dispatch: React.Dispatch<ConfiguratorAction>;
}

const ConfiguratorContext = createContext<ConfiguratorContextType | undefined>(undefined);

export function ConfiguratorProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(configuratorReducer, initialState);

    return (
        <ConfiguratorContext.Provider value={{ state, dispatch }}>
            {children}
        </ConfiguratorContext.Provider>
    );
}

export function useConfigurator() {
    const context = useContext(ConfiguratorContext);
    if (!context) {
        throw new Error("useConfigurator must be used within a ConfiguratorProvider");
    }
    return context;
}
