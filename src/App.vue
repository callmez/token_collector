<script setup lang="ts"></script>

<template>
  <div class="wrapper">
    <router-view></router-view>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body {
  background-color: #f7f8fa;
}
.wrapper {
  width: inherit;
  margin-left: auto;
  margin-right: auto;
}
@media screen and (min-width: 40px) {
  .wrapper {
    width: 375px;
  }
}

.section-title {
  margin: 0;
  padding: 20px 16px 16px;
  color: #455a6499;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
}
.mt-md {
  margin-top: 16px;
}
.my-md {
  margin-left: 16px;
  margin-right: 16px;
}
.color-primary {
  color: #1989fa;
}
</style>
