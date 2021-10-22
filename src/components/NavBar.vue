<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <nav class="bg-gray-800">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div
          class="
            flex
            items-center
            justify-center
            sm:items-stretch sm:justify-start
          "
        >
          <div
            class="
              flex-shrink-0 flex
              items-center
              text-white
              font-bold
              text-2xl
            "
          >
            {{ title }}
          </div>
        </div>
        <div
          class="
            flex
            items-center
            justify-center
            sm:items-stretch sm:justify-start
          "
        >
          <div class="hidden sm:block sm:ml-6">
            <div class="flex space-x-4">
              <a
                href="#"
                class="
                  text-gray-300
                  border-solid border border-gray-400
                  hover:bg-gray-700 hover:text-white
                  px-3
                  py-2
                  rounded-md
                  text-sm
                  font-medium
                "
                @click.stop="walletConnectShow = !walletConnectShow"
              >
                连接钱包
              </a>

              <a
                href="#"
                class="
                  text-gray-300
                  border-solid border border-gray-400
                  hover:bg-gray-700 hover:text-white
                  px-3
                  py-2
                  rounded-md
                  text-sm
                  font-bold
                "
              >
                {{ activeAccountString }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <Modal v-model="walletConnectShow">
    <WalletConnect />
  </Modal>
</template>

<script lang="ts" setup>
import { ref, toRef, onMounted, computed } from "vue";
import Modal from "./common/Modal.vue";
import WalletConnect from "./WalletConnect.vue";
import { useWalletStore } from "@/store";
import { onWalletEvent } from "@/web3";

const props = withDefaults(
  defineProps<{
    title: string;
  }>(),
  {
    title: "标题",
  }
);

const walletConnectShow = ref(false);

const walletStore = useWalletStore();
walletStore.loadAccounts();
onMounted(() => {
  onWalletEvent("accountsChanged", () => walletStore.loadAccounts());
});
const activeAccount = toRef(walletStore, "activeAccount");
const activeAccountString = computed(() => {
  if (!activeAccount.value) return "";

  return (
    activeAccount.value.substr(0, 6) + "..." + activeAccount.value.substr(-4)
  );
});
</script>

<style scoped></style>
