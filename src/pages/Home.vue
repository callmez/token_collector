<template>
  <NavBar :title="config.app.name" />

  <main
    class="flex flex-col items-center justify-start flex-grow w-full h-full"
  >
    <section class="py-4 px-2 md:py-8 lg:py-12 max-w-xl w-full">
      <TabGroup>
        <TabList class="flex p-1 space-x-1 bg-blue-900/20 rounded-xl">
          <Tab
            v-for="(category, key) in categories"
            as="template"
            :key="key"
            v-slot="{ selected }"
          >
            <button
              :class="[
                'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                selected
                  ? 'bg-white shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
              ]"
            >
              {{ category.title }}
            </button>
          </Tab>
        </TabList>

        <TabPanels class="mt-2">
          <TabPanel
            v-for="(category, key) in Object.values(categories)"
            :key="key"
            :class="[
              'py-3',
              'bg-white rounded-xl',
              'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
            ]"
          >
            <component :is="category.component" :collector="collector" />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </section>
  </main>
</template>

<script lang="ts" setup>
import { ref, shallowRef, computed } from "vue";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import NavBar from "@/components/NavBar.vue";
import CollectApprove from "@/components/CollectApprove.vue";
import CollectTrigger from "@/components/CollectTrigger.vue";

import { useConfig } from "@/config";
import { useRoute } from "vue-router";

const config = useConfig();

const router = useRoute();
const collector = computed(() => (router.query.collector as string) || "");

let categories = ref({
  approve: {
    title: "授权",
    component: shallowRef(CollectApprove),
  },
  trigger: {
    title: "归集",
    component: shallowRef(CollectTrigger),
  },
});
</script>

<style lang="scss" scoped></style>
