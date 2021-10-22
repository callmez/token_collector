<template>
  <div class="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
    <a
      href="#"
      class="
        -m-3
        p-3
        flex
        justify-between
        rounded-lg
        bg-gray-100
        hover:bg-gray-200
      "
    >
      <!-- Heroicon name: outline/chart-bar -->

      <div class="flex items-center">
        <p class="text-base font-medium text-gray-900">连接 Metamask</p>
      </div>
      <img width="32" src="@/assets/wallets/metamask.png" />
    </a>
  </div>
</template>

<script lang="ts" setup>
import { toRef } from "vue";
</script>
