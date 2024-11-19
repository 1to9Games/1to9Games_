import { createContext, useState } from "react";


export const AppContext = createContext();

export default function AppContextProvider({children}){

    const paisa = 10000;

    const Value={
      paisa,
    }


    return <AppContext.Provider value={Value}>
        {children}
        </AppContext.Provider>
}