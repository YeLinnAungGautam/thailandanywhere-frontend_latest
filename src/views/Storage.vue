<template>
  <Layout>
    <div class="storage-manager p-6 bg-gray-50 min-h-screen">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Storage Management
        </h1>
        <p class="text-gray-600">Monitor and manage your application files</p>
      </div>

      <!-- Loading Overlay -->
      <div
        v-if="storageStore.loading"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <div class="flex items-center space-x-3">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
            ></div>
            <span class="text-lg">Loading...</span>
          </div>
        </div>
      </div>

      <!-- Storage Overview Cards -->
      <div
        v-if="storageStats"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div
          class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500"
        >
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Total Files</h3>
          <p class="text-3xl font-bold text-blue-600">
            {{ storageStats.totals?.total_files || 0 }}
          </p>
        </div>

        <div
          class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500"
        >
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Total Size</h3>
          <p class="text-3xl font-bold text-green-600">
            {{ storageStats.totals?.total_size_mb || 0 }} MB
          </p>
        </div>

        <div
          class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500"
        >
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Directories</h3>
          <p class="text-3xl font-bold text-purple-600">
            {{ Object.keys(storageStats.directories || {}).length }}
          </p>
        </div>

        <div
          class="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500"
        >
          <h3 class="text-lg font-semibold text-gray-700 mb-2">
            Storage Usage
          </h3>
          <p class="text-3xl font-bold text-orange-600">
            {{ storageStats.totals?.total_size_gb || 0 }} GB
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mb-6 flex flex-wrap gap-3">
        <button
          @click="loadStorageStats"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Refresh Stats</span>
        </button>

        <button
          @click="toggleView"
          class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
          <span>{{
            viewMode === "overview" ? "Detailed View" : "Overview"
          }}</span>
        </button>
      </div>

      <!-- Directory Statistics -->
      <div
        v-if="viewMode === 'overview' && storageStats"
        class="bg-white rounded-lg shadow-md overflow-hidden mb-8"
      >
        <div class="px-6 py-4 bg-gray-50 border-b">
          <h2 class="text-xl font-semibold text-gray-800">
            Directory Overview
          </h2>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Directory
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Files
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Size (MB)
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(stats, directory) in storageStats.directories"
                :key="directory"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div
                        class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center"
                      >
                        <svg
                          class="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 capitalize">
                        {{ directory }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ stats.file_count }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ stats.size_mb }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div class="flex space-x-2">
                    <button
                      @click="loadDirectoryFiles(directory)"
                      class="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded text-xs transition-colors duration-200"
                    >
                      View Files
                    </button>
                    <button
                      @click="getDirectoryCount(directory)"
                      class="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded text-xs transition-colors duration-200"
                    >
                      Count
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Detailed File View -->
      <div v-if="viewMode === 'detailed'" class="space-y-6">
        <!-- Directory Selector -->
        <div class="bg-white p-4 rounded-lg shadow-md">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Select Directory</label
          >
          <select
            v-model="selectedDirectory"
            @change="loadDirectoryFiles(selectedDirectory)"
            class="w-full md:w-1/3 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose a directory...</option>
            <option value="export">Export</option>
            <option value="pdfs">PDFs</option>
          </select>
        </div>

        <!-- File List -->
        <div
          v-if="directoryFiles && directoryFiles.length > 0"
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div
            class="px-6 py-4 bg-gray-50 border-b flex justify-between items-center"
          >
            <h2 class="text-xl font-semibold text-gray-800 capitalize">
              {{ selectedDirectory }} Files
            </h2>
            <span class="text-sm text-gray-600"
              >{{ directoryFiles.length }} files</span
            >
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-100">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    File Name
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Size
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Modified
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="file in directoryFiles"
                  :key="file.name"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-8 w-8">
                        <div
                          class="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center"
                        >
                          <svg
                            v-if="file.extension === 'pdf'"
                            class="w-4 h-4 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                          <svg
                            v-else-if="
                              ['jpg', 'jpeg', 'png', 'gif'].includes(
                                file.extension
                              )
                            "
                            class="w-4 h-4 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <svg
                            v-else
                            class="w-4 h-4 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ file.name }}
                        </div>
                        <div class="text-xs text-gray-500">{{ file.path }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      {{ file.size_mb }} MB
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ formatBytes(file.size) }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ file.formatted_date }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      @click="deleteFile(selectedDirectory, file.name)"
                      class="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-xs transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- No Files Message -->
        <div
          v-else-if="
            selectedDirectory && directoryFiles && directoryFiles.length === 0
          "
          class="bg-white p-8 rounded-lg shadow-md text-center"
        >
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No files found</h3>
          <p class="mt-1 text-sm text-gray-500">
            The {{ selectedDirectory }} directory is empty.
          </p>
        </div>
      </div>

      <!-- Error Messages -->
      <div
        v-if="error"
        class="mt-4 bg-red-50 border border-red-200 rounded-md p-4"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error occurred</h3>
            <div class="mt-2 text-sm text-red-700">
              {{ error }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useStorageStore } from "../stores/storage";
import axios from "axios";
import Layout from "./Layout.vue";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";

// Store
const storageStore = useStorageStore();

// Reactive data
const storageStats = ref(null);
const directoryFiles = ref([]);
const selectedDirectory = ref("");
const viewMode = ref("overview"); // 'overview' or 'detailed'
const error = ref("");
const toast = useToast();

// Methods
const loadStorageStats = async () => {
  try {
    error.value = "";
    const response = await storageStore.getStorageStats();
    storageStats.value = response;
  } catch (err) {
    error.value = "Failed to load storage statistics: " + err.message;
  }
};

const loadDirectoryFiles = async (directory) => {
  if (!directory) return;

  try {
    error.value = "";
    const response = await storageStore.getFileTypeList(directory);
    directoryFiles.value = response.files || [];
    selectedDirectory.value = directory;
    viewMode.value = "detailed";
  } catch (err) {
    error.value = `Failed to load files from ${directory}: ` + err.message;
  }
};

const getDirectoryCount = async (directory) => {
  try {
    error.value = "";
    const response = await storageStore.getFileTypeCount(directory);
    alert(
      `${directory} has ${response.file_count} files (${response.total_size_mb} MB)`
    );
  } catch (err) {
    error.value = `Failed to get count for ${directory}: ` + err.message;
  }
};

const deleteFile = async (type, filename) => {
  Swal.fire({
    title: "Are you sure?",
    text: "Delete this file? File : " + filename,
    // text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#FF613c",
    cancelButtonColor: "#000000",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await storageStore.deleteFile(type, filename);
        if (res) {
          await loadDirectoryFiles(type);
          await loadStorageStats();
          toast.success("File deleted successfully!");
        }
      } catch (err) {
        error.value = `Failed to delete ${filename}: ` + err.message;
      }
    }
  });
};

const toggleView = () => {
  viewMode.value = viewMode.value === "overview" ? "detailed" : "overview";
};

const formatBytes = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Initialize
onMounted(() => {
  loadStorageStats();
});
</script>

<style scoped>
.storage-manager {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
}
</style>
