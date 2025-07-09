<template>
  <Layout>
    <div class="p-4">
      <h1 class="text-lg font-medium mb-4">Accounting PDF Generator</h1>

      <div class="mb-6 p-4 border bg-white shadow-sm rounded-lg">
        <h2 class="text-sm font-medium mb-3">Select Date Range</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium mb-1">Start Date</label>
            <input
              type="date"
              v-model="startDate"
              class="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label class="block text-xs font-medium mb-1">End Date</label>
            <input
              type="date"
              v-model="endDate"
              class="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      <button
        @click="generatePdf"
        :disabled="isGenerating"
        class="px-4 py-2 bg-[#FF613c] text-white rounded hover:bg-[#FF613c] disabled:bg-[#FF613c]/50 disabled:cursor-not-allowed"
      >
        <span v-if="isGenerating">Generating...</span>
        <span v-else>Generate Accounting PDF</span>
      </button>

      <div v-if="error" class="mt-4 p-3 bg-red-100 text-red-700 rounded">
        {{ error }}
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref } from "vue";
import { useAccountClassStore } from "../stores/accountClass";
import Layout from "./Layout.vue";

const accountClassStore = useAccountClassStore();
const startDate = ref("");
const endDate = ref("");
const isGenerating = ref(false);
const error = ref(null);

const generatePdf = async () => {
  if (!startDate.value || !endDate.value) {
    error.value = "Please select both start and end dates";
    return;
  }

  try {
    isGenerating.value = true;
    error.value = null;

    const params = {
      start_date: startDate.value,
      end_date: endDate.value,
    };

    const response = await accountClassStore.generateAccountingPdf(params);

    // Create blob URL for the PDF
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    // Create a temporary link and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `accounting_report_${startDate.value}_to_${endDate.value}.pdf`
    );
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Error generating PDF:", err);
    error.value = "Failed to generate PDF. Please try again.";
  } finally {
    isGenerating.value = false;
  }
};
</script>
