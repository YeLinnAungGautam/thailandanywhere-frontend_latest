<template>
  <div>
    <Layout :title="`Welcome back, ${authStore.user.name.split(' ')[0]}!`">
      <p>Auditor dashboard</p>
    </Layout>
  </div>
</template>

<script setup>
import Layout from "./Layout.vue";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
</script>
