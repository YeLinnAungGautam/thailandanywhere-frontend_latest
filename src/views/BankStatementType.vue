<template>
  <Layout :is_white="true">
    <div class="p-6">
      <h1 class="text-2xl font-bold text-[#FF613c] mb-6">Cash Image Types</h1>

      <!-- Filters -->
      <div class="flex gap-4 mb-6">
        <!-- Year Picker -->
        <select
          v-model="year"
          class="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]"
        >
          <option v-for="y in yearOptions" :key="y" :value="y">
            {{ y }}
          </option>
        </select>

        <!-- Month Picker -->
        <select
          v-model="selectedMonth"
          class="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF613c]"
        >
          <option v-for="m in monthArray" :key="m.id" :value="m.id">
            {{ m.name }}
          </option>
        </select>

        <!-- Relatable Type -->
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-10">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF613c]"
        ></div>
        <p class="mt-2 text-gray-600">Loading...</p>
      </div>

      <!-- Table -->
      <div v-else-if="expandedData.length > 0" class="overflow-x-auto">
        <table class="w-full border border-gray-300">
          <thead>
            <tr class="bg-[#FF613c] text-white">
              <th
                class="px-4 py-3 text-left text-sm font-medium border-r border-white"
              >
                No.
              </th>
              <th class="px-4 py-3 text-left text-sm font-medium">CRM ID</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in expandedData"
              :key="`${item.originalId}-${index}`"
              class="border-b border-gray-300 hover:bg-gray-50"
            >
              <td class="px-4 py-3 text-sm border-r border-gray-300">
                {{ item.rowNumber }}
              </td>
              <td class="px-4 py-3 text-sm">
                {{ item.crm_id || "-" }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="mt-6">
          <Pagination
            v-if="cashImages?.data?.length > 0"
            :data="cashImages"
            @change-page="changePage"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-10">
        <div class="text-gray-400 text-6xl mb-4">📄</div>
        <p class="text-gray-600">No data found</p>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import Layout from "./Layout.vue";
import Pagination from "../components/Pagination.vue";
import { useCashImageStore } from "../stores/cashImage";
import debounce from "lodash/debounce";

const cashImageStore = useCashImageStore();
const { cashImages, loading } = storeToRefs(cashImageStore);

// Current date
const currentDate = new Date();
const currentYear = currentDate.getFullYear();

// Filters
const year = ref(currentYear);
const selectedMonth = ref(currentDate.getMonth() + 1);
const relatableType = ref("");
const limit = ref(100);

// Year options (last 5 years + current + next year)
const yearOptions = computed(() => {
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 1; i++) {
    years.push(i);
  }
  return years;
});

// Month array
const monthArray = [
  { id: 1, name: "January" },
  { id: 2, name: "February" },
  { id: 3, name: "March" },
  { id: 4, name: "April" },
  { id: 5, name: "May" },
  { id: 6, name: "June" },
  { id: 7, name: "July" },
  { id: 8, name: "August" },
  { id: 9, name: "September" },
  { id: 10, name: "October" },
  { id: 11, name: "November" },
  { id: 12, name: "December" },
];

// Generate date range for selected month and year
const generateDateRangeForMonth = (month, yearValue) => {
  const startDate = new Date(yearValue, month - 1, 1);
  const endDate = new Date(yearValue, month, 0);

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return `${formatDate(startDate)},${formatDate(endDate)}`;
};

// Expand data to split CRM IDs
const expandedData = computed(() => {
  if (!cashImages.value?.data) return [];

  console.log(cashImages.value, "this is cash image");

  const expanded = [];
  const seenCrmIds = new Set(); // Track seen CRM IDs
  let rowNumber =
    (cashImages.value.meta.current_page - 1) * cashImages.value.meta.per_page +
    1;

  cashImages.value.data.forEach((item) => {
    if (item.crm_id && item.crm_id.includes(",")) {
      // Split by comma and trim whitespace
      const crmIds = item.crm_id
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id !== "");

      // Create a row for each CRM ID, skipping duplicates
      crmIds.forEach((crmId) => {
        if (!seenCrmIds.has(crmId)) {
          seenCrmIds.add(crmId);
          expanded.push({
            originalId: item.id,
            crm_id: crmId,
            rowNumber: rowNumber++,
          });
        }
      });
    } else {
      // Single CRM ID or no CRM ID
      const crmId = item.crm_id || ""; // Handle null/undefined
      if (!seenCrmIds.has(crmId)) {
        seenCrmIds.add(crmId);
        expanded.push({
          originalId: item.id,
          crm_id: crmId,
          rowNumber: rowNumber++,
        });
      }
    }
  });

  return expanded;
});

// const expandedData = computed(() => {
//   if (!cashImages.value?.data) return [];

//   console.log(cashImages.value, "this is cash image");
//   let rowNumber =
//     (cashImages.value.meta.current_page - 1) * cashImages.value.meta.per_page +
//     1;

//   cashImages.value.data.forEach((item) => {
//     item.rowNumber = rowNumber++;
//   });
//   return cashImages.value.data;
// });

// Search parameters
const searchParams = computed(() => {
  const params = {
    date: generateDateRangeForMonth(selectedMonth.value, year.value),
    limit: 500,
    interact_bank: "company", //step 1 filter by company
    include_relatable: true, // step 2 blink fill with ,
    relatable_type: "App\\Models\\Booking", // filtr by all deposit
  };

  return params;
});

// Fetch data
const getAction = async () => {
  await cashImageStore.getListAction(searchParams.value);
};

// Change page
const changePage = async (url) => {
  await cashImageStore.getChangePage(url, searchParams.value);
};

// Watch for filter changes
watch(
  [year, selectedMonth, relatableType, limit],
  debounce(async () => {
    await getAction();
  }, 500)
);

// Initial load
onMounted(async () => {
  await getAction();
});
</script>
