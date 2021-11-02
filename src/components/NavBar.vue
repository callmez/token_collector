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
          <div class="sm:ml-6">
            <div class="flex space-x-4">
              <a
                v-if="!activeAccount"
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
                @click.stop="handleShowWalletConnectModal"
              >
                连接钱包
              </a>

              <button
                v-else
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
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <TransitionRoot appear :show="walletConnectModalShow" as="template">
    <Dialog as="div" @close.stop="handleCloseWalletConnectModal">
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="min-h-screen px-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <DialogOverlay class="fixed inset-0 bg-black opacity-30" />
          </TransitionChild>

          <span class="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>

          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <div
              class="
                inline-block
                w-full
                max-w-md
                p-6
                my-8
                overflow-hidden
                text-left
                align-middle
                transition-all
                transform
                bg-white
                shadow-xl
                rounded-2xl
              "
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900 mb-4"
              >
                选择钱包
              </DialogTitle>

              <WalletConnect @connected="handleCloseWalletConnectModal" />
            </div>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts" setup>
import { ref, toRef, onMounted, computed } from "vue";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogOverlay,
  DialogTitle,
} from "@headlessui/vue";
import WalletConnect from "./WalletConnect.vue";
import { useWalletStore } from "@/store";
import { hasConnectedAddress, onEvent } from "@/utils/web3";
import { hideStr } from "@/utils";

const props = withDefaults(
  defineProps<{
    title: string;
  }>(),
  {
    title: "标题",
  }
);

const walletConnectModalShow = ref(false);
const handleShowWalletConnectModal = () =>
  (walletConnectModalShow.value = true);
const handleCloseWalletConnectModal = () =>
  (walletConnectModalShow.value = false);

const walletStore = useWalletStore();

onMounted(() => {
  if (hasConnectedAddress()) {
    walletStore.loadAccounts();
  }

  onEvent("accountsChanged", (accounts: string[]) => {
    if (!accounts.length) {
      return walletStore.cleanAccounts();
    }

    walletStore.loadAccounts();
  });
});

const activeAccount = toRef(walletStore, "activeAccount");
const activeAccountString = computed(() => {
  if (!activeAccount.value) return "";

  return hideStr(activeAccount.value);
});
</script>

<style scoped></style>
