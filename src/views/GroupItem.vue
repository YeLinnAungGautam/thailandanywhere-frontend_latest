<template>
  <Layout :is-white="true">
    <div>
      <p>Group Item</p>
    </div>
  </Layout>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useGroupStore } from "../stores/group";
import Layout from "./Layout.vue";
import { onMounted } from "vue";

const groupStore = useGroupStore();
const { groups } = storeToRefs(groupStore);

// Fetch groups when the component is mounted
onMounted(() => {
  // groupStore.getListAction();
});
</script>
