<script setup>
import Layout from "./Layout.vue";
import Input from "../components/Input.vue";
import InputField from "../components/InputField.vue";
import Pagination from "../components/Pagination.vue";
import {
  PencilSquareIcon,
  TrashIcon,
  ShareIcon,
  EyeIcon,
  TicketIcon,
  BuildingOfficeIcon,
  PlusIcon,
  UserGroupIcon,
  UsersIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/vue/24/outline";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import { onMounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import { useRouter } from "vue-router";
import { useCustomerStore } from "../stores/customer";
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";

const router = useRouter();
const toast = useToast();
const customerStore = useCustomerStore();

const { customer, loading } = storeToRefs(customerStore);
const authStore = useAuthStore();

const changePage = async (url) => {
  console.log(url);
  await customerStore.getChangePage(url);
};
const errors = ref([]);
const onDeleteHandler = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await customerStore.deleteAction(id);
        toast.success(response.message);
      } catch (error) {
        console.log(
          "🚀 ~ file: BlogView.vue:65 ~ onDeleteHandler ~ error:",
          error
        );
        if (error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
        toast.error(error.response.data.message);
      }
      await customerStore.getListAction();
    }
  });
};

const search = ref("");

onMounted(async () => {
  await customerStore.getListAction();
});

watch(search, async (newValue) => {
  await customerStore.getListAction({ search: search.value });
});
</script>

<template>
  <Layout>
    <div class="mb-5 flex items-center justify-between">
      <h3 class="text-2xl font-medium text-gray-600">Customers</h3>
      <div class="space-x-3">
        <router-link to="/customers/create">
          <Button :leftIcon="PlusIcon" @click="CustomerCreate"> Create </Button>
        </router-link>
      </div>
    </div>
    <div class="bg-white/60 p-6 rounded-lg shadow-sm mb-5">
      <!-- search input sort filter -->
      <div class="flex items-center justify-between mb-5">
        <div class="">
          <input
            v-model="search"
            type="text"
            class="w-3/5 sm:w-3/5 md:w-[300px] mr-3 border px-4 py-2 rounded-md shadow focus:ring-0 focus:outline-none text-gray-500"
            placeholder="Search for customers.."
          />
        </div>
        <div>
          <p class="inline-block mr-2 text-gray-500 font-medium">Show</p>
          <select
            class="border-2 p-2 rounded-md w-16 focus:outline-none focus:ring-0"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
          <p class="inline-block ml-2 text-gray-500 font-medium">entries</p>
        </div>
      </div>
      <div class="overflow-auto rounded-lg shadow mb-5">
        <table class="w-full">
          <thead class="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th class="w-20 p-3 text-sm font-medium tracking-wide text-left">
                No.
              </th>
              <th class="w-30 p-3 text-sm font-medium tracking-wide text-left">
                Name
              </th>
              <th class="p-3 text-sm font-medium tracking-wide text-left">
                Email
              </th>
              <th class="p-3 text-sm font-medium tracking-wide text-left">
                Phone
              </th>
              <th class="p-3 text-sm font-medium tracking-wide text-left">
                Address
              </th>
              <th class="w-30 p-3 text-sm font-medium tracking-wide text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="r in customer?.data"
              :key="r.id"
              class="bg-white even:bg-gray-50 hover:bg-gray-50"
            >
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                {{ r.id }}
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                {{ r.name }}
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                {{ r.email }}
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                {{ r.phone_number }}
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                {{ r.company_name }}
              </td>
              <td class="p-3 text-sm text-gray-700 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <router-link :to="'/customers/update/' + r.id">
                    <button
                      class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-blue-500 hover:text-white"
                    >
                      <EyeIcon class="w-5 h-5" />
                    </button>
                  </router-link>
                  <router-link :to="'/customers/update/' + r.id">
                    <button
                      class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                    >
                      <PencilSquareIcon class="w-5 h-5" />
                    </button>
                  </router-link>
                  <button
                    v-if="authStore.isSuperAdmin"
                    @click.prevent="onDeleteHandler(r.id)"
                    class="hover:bg-red-500 p-2 bg-white text-blue-500 transition shadow rounded hover:text-white"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- pagination -->
      <Pagination v-if="!loading" :data="customer" @change-page="changePage" />
    </div>
  </Layout>
</template>
