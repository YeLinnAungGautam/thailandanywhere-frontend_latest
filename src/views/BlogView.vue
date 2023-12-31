<script setup>
import Layout from "./Layout.vue";
import Input from "../components/Input.vue";
import InputField from "../components/InputField.vue";
import Pagination from "../components/Pagination.vue";

import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  TicketIcon,
  BuildingOfficeIcon,
  SquaresPlusIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  UsersIcon,
  PlusIcon,
  ListBulletIcon,
} from "@heroicons/vue/24/outline";
import { onMounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";

import { usePostStore } from "../stores/post";
import { storeToRefs } from "pinia";
import axios from "axios";
const toast = useToast();
const postStore = usePostStore();
const { data, loading } = storeToRefs(postStore);
const showEntries = ref(10);
const errors = ref(null);
const search = ref("");

onMounted(async () => {
  await postStore.getListAction();
});

const changePage = async (url) => {
  const { data } = await axios.get(url);
  postStore.data = data.result;
};

watch(showEntries, async (newValue) => {
  await postStore.getListAction({ limit: showEntries.value });
});

watch(search, async (newValue) => {
  await postStore.getListAction({ search: search.value });
});

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
        const response = await postStore.deleteAction(id);
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
      await postStore.getListAction();
    }
  });
};
</script>

<template>
  <Layout>
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-2xl font-medium text-gray-600">Blog Posts</h3>
      <div class="space-x-3">
        <router-link to="/blogs/categories">
          <Button :leftIcon="ListBulletIcon"> Categories </Button>
        </router-link>
        <router-link to="/blogs/new">
          <Button :leftIcon="PlusIcon"> Add Post </Button>
        </router-link>
      </div>
    </div>
    <div class="p-6 mb-5 rounded-lg shadow-sm bg-white/60">
      <!-- search input sort filter -->
      <div class="flex items-center justify-between mb-5">
        <div>
          <p class="inline-block mr-2 font-medium text-gray-500">Show</p>
          <select
            v-model="showEntries"
            class="w-16 p-2 border-2 rounded-md focus:outline-none focus:ring-0"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <p class="inline-block ml-2 font-medium text-gray-500">entries</p>
        </div>
        <div class="">
          <input
            v-model.lazy="search"
            type="text"
            class="w-3/5 sm:w-3/5 md:w-[300px] mr-3 border px-4 py-2 rounded-md shadow focus:ring-0 focus:outline-none text-gray-500"
            placeholder="Search for posts.."
          />
        </div>
      </div>
      <div class="mb-5 overflow-auto rounded-lg shadow" v-if="!loading">
        <table class="w-full">
          <thead class="border-b-2 border-gray-200 bg-gray-50">
            <tr>
              <th class="p-4 text-sm font-medium tracking-wide text-left">
                No.
              </th>
              <th class="p-4 text-sm font-medium tracking-wide text-left">
                Title
              </th>
              <th class="p-4 text-sm font-medium tracking-wide text-left">
                Category
              </th>
              <th class="p-4 text-sm font-medium tracking-wide text-left">
                Meta
              </th>
              <th class="p-4 text-sm font-medium tracking-wide text-left">
                Updated at
              </th>
              <th class="p-4 text-sm font-medium tracking-wide text-left">
                Created at
              </th>
              <th class="p-4 text-sm font-medium tracking-wide text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="post in data?.data"
              :key="post.id"
              class="bg-white even:bg-gray-50 hover:bg-gray-50"
            >
              <td class="p-4 text-sm text-gray-700 whitespace-nowrap">
                {{ post.id }}
              </td>
              <td class="p-4 text-sm text-gray-700 whitespace-nowrap">
                {{ post.title.slice(0, 50) }}
              </td>
              <td class="p-4 text-sm text-gray-700 whitespace-nowrap">
                {{ post.category.name }}
              </td>
              <td
                class="flex items-center gap-3 p-4 text-sm text-gray-700 whitespace-nowrap"
              >
                <div class="flex items-center">
                  <EyeIcon class="w-4 h-4 mr-1" />{{ post.views }}
                </div>
                <div class="flex items-center">
                  <ChatBubbleLeftRightIcon class="w-4 h-4 mr-1" />{{
                    post.comments.length
                  }}
                </div>
              </td>
              <td class="p-4 text-sm text-gray-700 whitespace-nowrap">
                {{ post.updated_at }}
              </td>
              <td class="p-4 text-sm text-gray-700 whitespace-nowrap">
                {{ post.created_at }}
              </td>
              <td class="p-4 text-sm text-gray-700 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <router-link :to="'/blogs/edit/' + post.slug">
                    <button
                      class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-blue-500 hover:text-white"
                    >
                      <EyeIcon class="w-5 h-5" />
                    </button>
                  </router-link>
                  <router-link :to="'/blogs/edit/' + post.slug">
                    <button
                      class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                    >
                      <PencilSquareIcon class="w-5 h-5" />
                    </button>
                  </router-link>
                  <button
                    @click.prevent="onDeleteHandler(post.id)"
                    class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-red-500 hover:text-white"
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
      <Pagination v-if="!loading" :data="data" @change-page="changePage" />
    </div>
  </Layout>
</template>
