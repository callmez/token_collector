import { createPinia } from "pinia";
import { loading } from "./plugins/loading";

export * from "./wallet";

export const store = createPinia();
store.use(loading);
