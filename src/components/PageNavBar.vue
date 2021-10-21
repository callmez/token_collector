<template>
  <van-nav-bar :title="title" :left-text="leftText" left-arrow>
    <template #right>
      <span v-if="activeAccount">{{ activeAccountString }}</span>
      <van-icon size="26" v-else name="user-circle-o" />
    </template>
  </van-nav-bar>
</template>

<script lang="ts" setup>
import { toRef, onMounted, computed } from "vue";
import { useWalletStore } from "@/store";
import { onWalletEvent } from "@/web3";

const props = withDefaults(
  defineProps<{
    title: string;
    leftText: string;
  }>(),
  {
    title: "标题",
    leftText: "返回",
  }
);

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
