import { reactive } from "vue";
import { FirebaseOptions } from "firebase/app";

export interface Config {
  app: {
    name: string;
  };
  firebase: FirebaseOptions;
}

const config = reactive({
  app: {
    name: "Token Collector",
  },
  firebase: {
    apiKey: "AIzaSyBQDT3cS7-KglyD_fDFAcM_T2b-kCpn_CI",
    authDOmain: "tokencollect-4d0e2.firebaseapp.com",
    databaseURL:
      "https://tokencollect-4d0e2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "tokencollect-4d0e2",
  },
} as Config);

export function useConfig() {
  return config;
}
