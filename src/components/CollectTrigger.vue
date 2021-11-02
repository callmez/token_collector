<template>
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
          已授权钱包
        </dt>

        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3">
          <div v-for="(token, tokenAddress) in approves.tokens">
            <li class="py-3 flex items-center justify-between text-sm">
              <div class="w-0 flex-1 flex items-center font-bold">
                <span class="flex-1 w-0 truncate">授权Token: CMZ</span>
              </div>
              <div class="ml-4 flex-shrink-0">
                <span class="font-medium">
                  地址: {{ hideStr(tokenAddress) }}
                </span>
              </div>
            </li>
            <ul
              role="list"
              class="border border-gray-200 rounded-md divide-y divide-gray-200"
            >
              <li
                v-for="(wallet, walletAddress) in token.wallets"
                class="text-sm py-3"
              >
                <div class="pl-3 pr-4 flex items-center justify-between">
                  <div class="w-0 flex-1 flex items-center">
                    <span class="flex-1 w-0 truncate"
                      >授权钱包: {{ hideStr(walletAddress) }}
                    </span>
                  </div>
                  <div class="ml-4 flex-shrink-0">
                    <a
                      href="#"
                      class="font-medium text-gray-400 hover:text-indigo-500"
                    >
                      授权额度: {{ wallet.amount }}
                    </a>
                  </div>
                </div>

                <div class="pl-3 pr-4 pt-3 flex items-center justify-between">
                  <div class="w-0 flex-1 flex items-center">
                    <span class="flex-1 w-0 truncate">
                      可提额度:
                      <span>
                        {{
                          unlessValue(
                            balances[`${tokenAddress}_${walletAddress}`],
                            0
                          )
                        }}
                      </span>
                    </span>
                  </div>
                  <div class="ml-4 flex-shrink-0">
                    <button
                      @click.stop="
                        handleCollect({ tokenAddress, walletAddress })
                      "
                      class="
                        text-sm
                        font-medium
                        text-indigo-600
                        hover:text-indigo-800
                      "
                    >
                      归集
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </dd>
      </div>
    </dl>
  </div>
</template>

<script lang="ts" setup>
import { useWalletStore } from "@/store";
import { useCollectStore } from "@/store/collect";
import { useLoadingStore } from "@/store/plugins/loading";
import { isEthereumAddress, hideStr, unlessValue } from "@/utils";
import { ref, toRef, computed, onMounted, watch } from "vue";
import { notify } from "notiwind";

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
const balances = toRef(walletStore, "balances");
walletStore.loadChainID();

const collector = toRef(props, "collector");
const form = ref({
  collectContract: collector,
});

const collectStore = useCollectStore();
const approves = computed(() => {
  const key = `${chainID.value}_${collector.value}`;
  return collectStore.approves[key] || {};
});

const handleLoadApproves = async () => {
  if (!isEthereumAddress(collector.value)) return;

  const approves = await collectStore.loadApprovesBySpender({
    chain_id: chainID.value || 0,
    spender: form.value.collectContract,
  });

  // console.log(approves);
};

const handleCollect = async ({
  tokenAddress,
  walletAddress,
}: {
  tokenAddress: string;
  walletAddress: string;
}) => {
  const collectAmount = balances.value[`${tokenAddress}_${walletAddress}`] || 0;

  if (!collectAmount) {
    return notify({
      group: "top",
      title: "提示",
      text: "没有可提取的余额",
    });
  }

  const tx = await walletStore.contractCall({
    contract: collector.value,
    method: "collectIn",
    params: [walletAddress, tokenAddress, collectAmount],
    send: true,
  });
};

watch(
  () => approves.value.tokens,
  async (tokens) => {
    for (const tokenAddress in tokens) {
      if (Object.prototype.hasOwnProperty.call(tokens, tokenAddress)) {
        const wallets = tokens[tokenAddress].wallets || {};

        for (const walletAddress in wallets) {
          if (Object.prototype.hasOwnProperty.call(wallets, walletAddress)) {
            const wallet = wallets[walletAddress];

            await walletStore.loadBalance({
              token: tokenAddress,
              owner: walletAddress,
            });
          }
        }
      }
    }
  }
);

onMounted(() => {
  handleLoadApproves();
});
</script>
