import type { ProductsContextType } from "@app/modules/products/entities/entities";
import { createContext } from "react";

export const ProductsContext = createContext<ProductsContextType | null>(null);
