// App.vue example
<template>
  <div class="max-w-6xl mx-auto p-5">
    <h1 class="text-3xl font-bold text-center mb-8">A4 PNG Generator</h1>
    <A4PaginatedRenderer :items="itemsArray" :itemsPerPage="itemsPerPage" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import A4PaginatedRenderer from "./A4PaginatorComponent.vue";

const itemsPerPage = ref(5); // Adjust based on your content size
const itemsArray = ref([]);

onMounted(() => {
  // Generate sample data - replace with your actual data
  const sampleData = [];
  for (let i = 1; i <= 25; i++) {
    sampleData.push({
      id: i,
      content: `This is the content for item ${i}. You can add any data here that you want to display on your A4 pages.`,
    });
  }
  itemsArray.value = sampleData;
});
</script>
