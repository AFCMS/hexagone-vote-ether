import { createContext } from "react";

import type { EthContextValue } from "./types";

export const EthContext = createContext<EthContextValue | null>(null);
