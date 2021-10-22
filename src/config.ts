import { reactive } from "vue";
const config = reactive({
  app: {
    name: "Token Collector",
  },
  collector: {
    address: "0x203c860f176e6c768F322C106E65c2D179D37BCA",
  },
});

export function useConfig() {
  return config;
}
