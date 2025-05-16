import { useState, createContext, useContext,ReactNode } from "react";

const LoadertimeContext = createContext<number | undefined>(undefined);
//const LoadertimeContext = createContext();
export const Loadertime=({ children }: { children: ReactNode })=>{
 const loadingtime = 2000;
  return <LoadertimeContext.Provider value={loadingtime}>
    {children}
    </LoadertimeContext.Provider>;
}
export const useLoadertime = () => {
  const context = useContext(LoadertimeContext);
  if (context === undefined) {
    throw new Error("useLoadertime must be used within a LoadertimeProvider");
  }
  return context;
};