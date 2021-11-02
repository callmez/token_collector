<template>
  <div class="px-4 py-5 sm:px-6">
    <h3 class="text-lg leading-6 font-medium text-gray-900">
      授权合约提取钱包Token
    </h3>
    <p class="mt-1 max-w-2xl text-sm text-gray-500">
      只需一次授权. 合约可随时提取Token并统一转移您的指定归集钱包
    </p>
  </div>
  <div class="border-t border-gray-200">
    <dl>
      <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
        <dt class="flex items-center text-sm font-medium text-gray-500">
          归集合约
        </dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3">
          <input
            type="text"
            autocomplete="given-name"
            class="
              focus:ring-indigo-500 focus:border-indigo-500
              block
              w-full
              shadow-sm
              sm:text-sm
              border-gray-300
              rounded-md
            "
            placeholder="请填写归集合约地址"
            v-model="form.collectContract"
          />
        </dd>
      </div>

      <div class="px-4 py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
        <dt class="flex items-center text-sm font-medium text-gray-500">
          归集Token
        </dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3">
          <div class="relative rounded-md shadow-sm">
            <input
              type="text"
              name="price"
              id="price"
              class="
                focus:ring-indigo-500 focus:border-indigo-500
                block
                w-full
                pr-12
                sm:text-sm
                border-gray-300
                rounded-md
              "
              readonly
              @click.stop="handleShowTokenSelectModal"
              v-model="form.collectToken"
              placeholder="请输入归集Token地址"
            />
            <div
              v-if="selectedToken"
              class="
                border-l border-gray-300
                absolute
                inset-y-0
                right-0
                flex
                items-center
                justify-center
                text-center text-gray-500
                font-bold
                w-12
              "
            >
              {{ selectedToken?.name }}
            </div>
          </div>

          <TransitionRoot appear :show="tokenSelectModalShow" as="template">
            <Dialog as="div" @close="handleCloseTokenSelectModal">
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

                  <span
                    class="inline-block h-screen align-middle"
                    aria-hidden="true"
                  >
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
                        class="text-lg font-medium leading-6 text-gray-900"
                      >
                        选择Token
                      </DialogTitle>

                      <TokenSelect @seleted="handleTokenSelected" />
                    </div>
                  </TransitionChild>
                </div>
              </div>
            </Dialog>
          </TransitionRoot>
        </dd>
      </div>

      <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
        <dt class="flex items-center text-sm font-medium text-gray-500">
          授权额度
        </dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3">
          <input
            type="text"
            autocomplete="given-name"
            class="
              focus:ring-indigo-500 focus:border-indigo-500
              block
              w-full
              shadow-sm
              sm:text-sm
              border-gray-300
              rounded-md
            "
            placeholder="请填写授权归集的最大额度"
            v-model="form.approveAmount"
          />
        </dd>
      </div>

      <div class="bg-white my-4 sm:gap-4 sm:px-6">
        <button
          @click.stop="handleApproveCollect"
          type="submit"
          class="
            group
            relative
            w-full
            flex
            justify-center
            py-2
            px-4
            border border-transparent
            text-md
            font-medium
            rounded-md
            text-white
            bg-indigo-600
            hover:bg-indigo-700
            focus:outline-none
            focus:ring-2
            focus:ring-offset-2
            focus:ring-indigo-500
          "
          :disabled="loading['walletApprove']"
        >
          <LoadingIcon
            class="
              absolute
              left-6
              flex
              items-center
              justify-center
              text-gray-300
            "
            v-if="loading['walletApprove']"
          />
          授权归集
        </button>
      </div>
    </dl>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, toRef } from "vue";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogOverlay,
  DialogTitle,
} from "@headlessui/vue";

import TokenSelect from "@/components/TokenSelect.vue";
import { Token, useWalletStore } from "@/store";
import { useLoadingStore } from "@/store/plugins/loading";
import { fromDecimalValue } from "@/utils";

import LoadingIcon from "@/components/common/LoadingIcon.vue";
import { useCollectStore } from "@/store/collect";

const props = withDefaults(
  defineProps<{
    collector: string;
  }>(),
  {
    collector: "",
  }
);

const loadingStore = useLoadingStore();
const loading = toRef(loadingStore, "loading");

const walletStore = useWalletStore();
const chainID = toRef(walletStore, "chainID");
walletStore.loadChainID();

const collector = toRef(props, "collector");
const form = ref({
  collectContract: collector,
  collectToken: "",
  approveAmount: "",
});

const collectStore = useCollectStore();

const handleApproveCollect = async () => {
  const tx = await walletStore.approve({
    token: form.value.collectToken,
    spender: form.value.collectContract,
    amount: form.value.approveAmount,
  });

  const data = await collectStore.addApprove({
    tx: {},
    chain_id: chainID.value || 0,
    token: form.value.collectToken,
    wallet: walletStore.activeAccount,
    spender: form.value.collectContract,
    amount: form.value.approveAmount,
    created_at: Date.now(),
  });
};

const tokenSelectModalShow = ref(false);
const handleShowTokenSelectModal = () => {
  tokenSelectModalShow.value = true;
};
const handleCloseTokenSelectModal = () => {
  tokenSelectModalShow.value = false;
};
const selectedToken = ref<Token>();
const handleTokenSelected = (token: Token) => {
  handleCloseTokenSelectModal();

  form.value.collectToken = token.address;
  form.value.approveAmount =
    "" +
    parseFloat(fromDecimalValue(token.totalSupply, token.decimals).toString());
  selectedToken.value = token;
};
</script>

<style lang="scss" scoped></style>
