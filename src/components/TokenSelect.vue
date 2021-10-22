<template>
  <div>
    <div class="my-5">
      <input
        type="text"
        placeholder="请输入Token合约地址"
        autocomplete="given-name"
        v-model="form.tokenAddress"
        class="
          mt-1
          focus:ring-indigo-500 focus:border-indigo-500
          block
          w-full
          shadow-sm
          sm:text-sm
          border-gray-300
          rounded-md
        "
      />
    </div>

    <h3 class="my-4 text-lg font-medium leading-6 text-gray-900">Token列表</h3>

    <div v-if="loading['walletLoadTokensByGuessString']" class="text-center">
      <LoadingIcon />
    </div>
    <ul v-else role="list" class="-my-6 divide-y divide-gray-200">
      <li v-for="(token, key) in tokens" class="py-6 flex">
        <div
          class="
            flex-1 flex flex-col
            p-4
            rounded-lg
            bg-gray-100
            hover:bg-gray-200
          "
          @click.stop="handleSelectToken(token)"
        >
          <div class="flex justify-between text-base font-medium text-gray-700">
            <h3>
              <a href="#"> {{ token.name }} </a>
            </h3>
            <p class="ml-4">小数位: {{ token.decimals }}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import LoadingIcon from "./common/LoadingIcon.vue";
import { Token, useWalletStore } from "@/store";
import { useLoadingStore } from "@/store/plugins/loading";
import { ref, watch, toRef } from "vue";

const emit = defineEmits<{
  (event: "seleted", value: Token): void;
}>();

const loadStore = useLoadingStore();
const loading = toRef(loadStore, "loading");

const walletStore = useWalletStore();

const form = ref({
  tokenAddress: "",
});

const tokens = ref<Token[]>([]);

watch(
  () => form.value.tokenAddress,
  async (tokenAddress) => {
    tokens.value = await walletStore.loadTokensByGuessString({
      guessString: tokenAddress,
    });
  }
);

const handleSelectToken = (token: Token) => emit("seleted", token);
</script>
