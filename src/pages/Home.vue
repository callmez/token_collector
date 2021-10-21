<template>
  <PageNavBar title="主页" />
  <h2 class="section-title">授权</h2>
  <van-cell-group>
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
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed, toRef } from "vue";
import PageNavBar from "@/components/PageNavBar.vue";
import { useWalletStore } from "@/store";
import { useLoadingStore } from "@/store/plugins/loading";
import { fromDecimalValue } from "@/utils";
import { useConfig } from "@/config";

const config = useConfig();

const loadingStore = useLoadingStore();
const loading = toRef(loadingStore, "loading");
const walletStore = useWalletStore();
const token = computed(() => walletStore.tokens[form.value.tokenAddress]);

const form = ref({
  tokenAddress: "",
  approveAddress: config.collector.address,
  approveAmount: "",
});
const handleApproveCollect = async () => {
  const tx = await walletStore.approve({
    tokenAddress: form.value.tokenAddress,
    spender: form.value.approveAddress,
    amount: form.value.approveAmount,
  });

  console.log(tx);
};

watch(
  () => form.value.tokenAddress,
  async (tokenAddress) => {
    if ((tokenAddress + "").length >= 42) {
      const { totalSupply, decimals } = await walletStore.loadToken({
        address: tokenAddress,
      });
      const value =
        "" + parseFloat(fromDecimalValue(totalSupply, decimals).toString());
      form.value.approveAmount = value;
    }
  }
);
</script>

<style lang="scss" scoped></style>
