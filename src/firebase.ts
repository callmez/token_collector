import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { useConfig } from "./config";

let app;
export function useApp() {
  if (app === undefined) {
    const config = useConfig();
    app = initializeApp(config.firebase);
  }

  return app;
}

export function useDatabase() {
  const app = useApp();

  return getDatabase(app);
}
