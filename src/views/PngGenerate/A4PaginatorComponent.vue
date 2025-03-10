// A4PaginatedRenderer.vue
<template>
  <div class="flex flex-col gap-5">
    <div class="flex gap-3 mb-5">
      <button
        @click="generatePNGs"
        class="px-4 py-2 font-semibold text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition-colors"
      >
        Generate PNG Images
      </button>
      <button
        @click="downloadAll"
        :disabled="!pngUrls.length"
        class="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Download All As Zip
      </button>
      <button
        @click="downloadAsSinglePage()"
        :disabled="!pngUrls.length"
        class="px-4 py-2 font-semibold text-white bg-orange-500 rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Download All As Png
      </button>
    </div>

    <!-- Generated PNG previews -->
    <div v-if="pngUrls.length" class="mt-8">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold">Generated PNG Images</h3>
      </div>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
      >
        <div
          v-for="(url, index) in pngUrls"
          :key="index"
          class="flex flex-col items-center"
        >
          <div class="flex flex-col items-center w-full">
            <p class="mb-2">Page {{ index + 1 }}</p>
            <img
              :src="url"
              :alt="`Page ${index + 1}`"
              class="max-w-full h-auto border border-gray-200 shadow-sm mb-2"
            />
            <button
              @click="downloadSinglePage(index)"
              class="w-full mt-2 px-3 py-1.5 text-sm font-medium text-white bg-indigo-500 rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 transition-colors"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview container -->
    <div class="flex-col gap-8 flex">
      <div v-for="(page, index) in pages" :key="index" class="mb-10">
        <h3 class="text-xl font-bold mb-3">Page {{ index + 1 }}</h3>
        <div
          :id="`page-${index}`"
          class="w-[210mm] h-[297mm] p-[20mm] mx-auto bg-white shadow-md overflow-hidden"
          ref="pageRefs"
        >
          <div
            v-for="(item, itemIndex) in page"
            :key="itemIndex"
            class="mb-3 p-3 border-b border-gray-200"
          >
            <!-- Render your item content here -->
            <div>
              <h4 class="font-bold text-lg">Item {{ item.id }}</h4>
              <p class="text-gray-700">{{ item.content }}</p>
              <!-- Add more item rendering as needed -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { saveAs } from "file-saver";

// Props definition
const props = defineProps({
  // Array of data items to render
  items: {
    type: Array,
    required: true,
  },
  // Maximum items per A4 page
  itemsPerPage: {
    type: Number,
    default: 10,
  },
});

// Reactive state
const pngUrls = ref([]);
const pageRefs = ref([]);

// Computed pagination based on items array
const pages = computed(() => {
  const result = [];
  let currentPage = [];

  for (let i = 0; i < props.items.length; i++) {
    currentPage.push(props.items[i]);

    if (
      currentPage.length >= props.itemsPerPage ||
      i === props.items.length - 1
    ) {
      result.push([...currentPage]);
      currentPage = [];
    }
  }

  return result;
});

const isGenerating = ref(false);

// Generate PNG for each page
const generatePNGs = async () => {
  isGenerating.value = true;
  // Clear previous PNGs
  pngUrls.value = [];

  // For each page, generate a PNG
  for (let i = 0; i < pages.value.length; i++) {
    const pageElement = pageRefs.value[i];
    if (!pageElement) continue;

    try {
      const canvas = await html2canvas(pageElement, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const pngUrl = canvas.toDataURL("image/png");
      pngUrls.value.push(pngUrl);
    } catch (error) {
      console.error(`Error generating PNG for page ${i + 1}:`, error);
    }
  }

  isGenerating.value = false;
};

// Download all PNGs as a single page
const downloadAsSinglePage = async () => {
  for (let i = 0; i < pngUrls.value.length; i++) {
    // Add a small delay between downloads to avoid browser restrictions
    await new Promise((resolve) => setTimeout(resolve, 300));
    downloadSinglePage(i);
  }
};

// Download a single PNG page
const downloadSinglePage = (pageIndex) => {
  if (!pngUrls.value[pageIndex]) return;

  try {
    // Convert data URL to Blob
    const dataUrl = pngUrls.value[pageIndex];
    const byteString = atob(dataUrl.split(",")[1]);
    const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeString });
    saveAs(blob, `page-${pageIndex + 1}.png`);
  } catch (error) {
    console.error(`Error downloading page ${pageIndex + 1}:`, error);
  }
};

// Download all PNGs as a zip file
const downloadAll = async () => {
  if (!pngUrls.value.length) return;

  try {
    const zip = new JSZip();

    // Add each PNG to the zip
    for (let i = 0; i < pngUrls.value.length; i++) {
      const pngUrl = pngUrls.value[i];
      const base64Data = pngUrl.replace("data:image/png;base64,", "");
      zip.file(`page-${i + 1}.png`, base64Data, { base64: true });
    }

    // Generate and download the zip file
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "a4-pages.zip");
  } catch (error) {
    console.error("Error creating zip file:", error);
  }
};

onMounted(() => {
  generatePNGs();
});

// Watch for changes in the items prop and regenerate PNGs
watch(
  () => props.items,
  (newItems) => {
    if (newItems && newItems.length > 0) {
      generatePNGs();
    }
  },
  { deep: true }
);
</script>
