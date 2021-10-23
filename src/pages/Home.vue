<template>
  <NavBar :title="config.app.name" />
  {{ form }}
  <main
    class="flex flex-col items-center justify-start flex-grow w-full h-full"
  >
    <section class="py-4 md:py-8 lg:py-12 max-w-xl w-full">
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            多钱包Token自动归集
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            安全、去中心化的多钱包Token归集系统
          </p>
        </div>
        <div class="border-t border-gray-200">
          <dl>
            <div
              class="
                bg-gray-50
                px-4
                py-5
                sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6
              "
            >
              <dt class="flex items-center text-sm font-medium text-gray-500">
                归集合约
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
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
                  v-model="form.approveAddress"
                />
              </dd>
            </div>

            <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="flex items-center text-sm font-medium text-gray-500">
                归集Token
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
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
                    v-model="form.tokenAddress"
                    placeholder="请输入归集Token地址"
                  />
                  <div
                    class="
                      absolute
                      inset-y-0
                      right-0
                      flex
                      items-center
                      text-gray-500
                      font-bold
                      px-4
                    "
                  >
                    {{ selectedToken?.name }}
                  </div>
                </div>

                <TransitionRoot
                  appear
                  :show="tokenSelectModalShow"
                  as="template"
                >
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
                          <DialogOverlay
                            class="fixed inset-0 bg-black opacity-30"
                          />
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
                              class="
                                text-lg
                                font-medium
                                leading-6
                                text-gray-900
                              "
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

            <div
              class="
                bg-gray-50
                px-4
                py-5
                sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6
              "
            >
              <dt class="flex items-center text-sm font-medium text-gray-500">
                授权额度
              </dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
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

            <div class="bg-white px-4 py-5 sm:gap-4 sm:px-6">
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
                <LoadingIcon v-if="loading['walletApprove']" />
                授权归集
              </button>
            </div>
          </dl>
        </div>
      </div>
    </section>
  </main>

  <!-- <h2 class="section-title">授权</h2> -->
  <!-- <van-cell-group>
    <van-field
      v-model="form.tokenAddress"
      label="授权币种"
      placeholder="请输入授权币种合约地址"
    >
      <template v-if="loading['walletLoadToken']" #right-icon>
        <van-loading size="24" />
      </template>
      <template v-if="!loading['walletLoadToken'] && token" #button>
        <span class="color-primary">{{ token.symbol }}</span>
      </template>
    </van-field>
    <van-field
      v-model="form.approveAddress"
      label="授权归集地址"
      placeholder="请输入授权归集地址"
    />
    <van-field
      v-model="form.approveAmount"
      label="授权额度"
      placeholder="请输入授权额度"
    />
  </van-cell-group>

  <div class="mt-md my-md">
    <van-button v-if="loading['walletApprove']" loading block type="primary" />
    <van-button v-else type="primary" block @click.stop="handleApproveCollect"
      >授权</van-button
    >
  </div> -->
</template>

<script lang="ts" setup>
import { ref, watch, computed, toRef } from "vue";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogOverlay,
  DialogTitle,
} from "@headlessui/vue";
import NavBar from "@/components/NavBar.vue";
import TokenSelect from "@/components/TokenSelect.vue";
import { Token, useWalletStore } from "@/store";
import { useLoadingStore } from "@/store/plugins/loading";
import { fromDecimalValue } from "@/utils";
import { useConfig } from "@/config";
import { useRoute } from "vue-router";
import LoadingIcon from "@/components/common/LoadingIcon.vue";

const config = useConfig();

const router = useRoute();
const query = toRef(router, "query");

const loadingStore = useLoadingStore();
const loading = toRef(loadingStore, "loading");
const walletStore = useWalletStore();

const form = ref({
  tokenAddress: "",
  approveAddress: "",
  approveAmount: "",
});
watch(
  query,
  () => {
    form.value.approveAddress =
      (query.value.collector as string | undefined) || "";
  },
  { immediate: true }
);

const handleApproveCollect = async () => {
  const tx = await walletStore.approve({
    tokenAddress: form.value.tokenAddress,
    spender: form.value.approveAddress,
    amount: form.value.approveAmount,
  });

  console.log(tx);
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

  form.value.tokenAddress = token.address;
  form.value.approveAmount =
    "" +
    parseFloat(fromDecimalValue(token.totalSupply, token.decimals).toString());
  selectedToken.value = token;
};
</script>

<style lang="scss" scoped></style>
