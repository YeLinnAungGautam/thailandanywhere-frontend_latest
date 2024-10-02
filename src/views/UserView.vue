<script setup>
import Layout from "./Layout.vue";
import { onMounted, watch, ref } from "vue";
import { useUserStore } from "../stores/user";
import { storeToRefs } from "pinia";
import Pagination from "../components/Pagination.vue";
import { computed } from "vue";
import debounce from "lodash/debounce";
import { useToast } from "vue-toastification";

const userStore = useUserStore();
const toast = useToast();
const { users, loading } = storeToRefs(userStore);

const search = ref("");
const unique_key = ref("");

const changePage = async (url) => {
  console.log(url);
  await userStore.getChangePage(url, watchSystem.value);
};

const displayAlert = (message) => {
  toast.error(message);
};

onMounted(async () => {
  await userStore.getListAction();
});

const watchSystem = computed(() => {
  let data = {};

  if (search.value) {
    data.search = search.value;
  }
  if (unique_key.value) {
    data.unique_key = unique_key.value;
  }
  return data;
});

watch(
  search,
  debounce(async () => {
    await userStore.getListAction(watchSystem.value);
  }, 500)
);

watch(
  unique_key,
  debounce(async () => {
    await userStore.getListAction(watchSystem.value);
  }, 500)
);
</script>

<template>
  <Layout>
    <div class="mb-5 flex items-center justify-between">
      <h3 class="text-2xl font-medium text-gray-600">Users</h3>
    </div>
    <div class="bg-white/60 p-6 rounded-lg shadow-sm mb-5">
      <!-- search input sort filter -->
      <div class="flex items-center justify-between mb-5">
        <div class="flex justify-start gap-4">
          <input
            v-model="search"
            type="text"
            class="w-3/5 sm:w-3/5 md:w-[300px] mr-3 border px-4 py-2 rounded-md shadow focus:ring-0 focus:outline-none text-gray-500"
            placeholder="Search for users name & email.."
          />
          <input
            v-model="unique_key"
            type="text"
            class="w-3/5 sm:w-3/5 md:w-[300px] mr-3 border px-4 py-2 rounded-md shadow focus:ring-0 focus:outline-none text-gray-500"
            placeholder="Search for users unique key"
          />
        </div>
      </div>
      <div class="overflow-auto rounded-lg shadow mb-5">
        <table class="w-full">
          <thead class="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th class="w-20 p-3 text-xs font-medium tracking-wide text-left">
                No.
              </th>
              <th class="w-30 p-3 text-xs font-medium tracking-wide text-left">
                Name
              </th>
              <th class="p-3 text-xs font-medium tracking-wide text-left">
                Email
              </th>
              <th class="p-3 text-xs font-medium tracking-wide text-left">
                Unique Key
              </th>
              <th class="w-30 p-3 text-xs font-medium tracking-wide text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="r in users?.data"
              :key="r.id"
              class="bg-white even:bg-gray-50 hover:bg-gray-50"
            >
              <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
                {{ r.id }}
              </td>
              <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
                {{ r.name }}
              </td>
              <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
                {{ r.email }}
              </td>
              <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
                {{ r.unique_key }}
              </td>
              <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
                <div
                  class="flex items-center gap-2"
                  @click="displayAlert('not confirm to show user data !')"
                >
                  <p class="text-blue-500 cursor-pointer underline">details</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- pagination -->
      <Pagination v-if="!loading" :data="users" @change-page="changePage" />
    </div>
  </Layout>
</template>
