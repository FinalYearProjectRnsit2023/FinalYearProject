import { createContext, useState } from "react";
import { AppDataInterface, defaultAppData } from "../../lib/types/types";

import { AppDataContext } from "./context";

const AppContext = createContext<AppDataContext>([defaultAppData, () => null]);

export const AppContextProvider = ({ children }: any) => {
  const [appData, setAppData] = useState<AppDataInterface>(defaultAppData);

  return (
    <AppContext.Provider value={[appData!, setAppData]}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
