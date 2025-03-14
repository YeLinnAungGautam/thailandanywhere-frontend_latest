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
    <!-- <div class="flex-col gap-8 flex">
      <div v-for="(page, index) in pages" :key="index" class="mb-10">
        <h3 class="text-xl font-bold mb-3">Page {{ index + 1 }}</h3>
        <div
          :id="`page-${index}`"
          class="w-[210mm] h-[297mm] p-[20mm] mx-auto bg-white shadow-md overflow-hidden"
          ref="pageRefs"
        >
          <div class="flex justify-between items-center bg-red-500">
            <div>
              <h2 class="font-bold text-3xl">Page {{ index + 1 }}</h2>
              <p class="text-gray-700">This is page {{ index + 1 }}</p>
            </div>
            <div>
              <h3 class="font-bold text-2xl text-center">Footer</h3>
            </div>
          </div>
          <div
            v-for="(item, itemIndex) in page"
            :key="itemIndex"
            class="mb-3 p-3 border-b border-gray-200"
          >
            <div>
              <h4 class="font-bold text-lg">Item {{ item.id }}</h4>
              <p class="text-gray-700">{{ item.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div> -->

    <div
      class="max-w-4xl mx-auto bg-white shadow-lg mb-10"
      v-for="(page, index) in pages"
      :key="index"
      ref="pageRefs"
    >
      <!-- Header -->
      <div
        class="bg-orange-500 text-white py-6 px-8 flex justify-between items-center"
      >
        <div class="space-y-2">
          <h1 class="text-2xl font-bold">
            Thailand <span class="font-normal">Anywhere</span>
          </h1>
          <p class="text-sm">View on: www.thanywhere.com/scan</p>
        </div>
        <div class="text-right">
          <div class="flex justify-end item-center mb-2">
            <span class="w-32 font-medium">Invoice to:</span>
            <span class="w-40 text-sm">{{ invoice.customer }}</span>
          </div>
          <div class="flex justify-end item-center mb-2">
            <span class="w-32 font-medium">Sales date:</span>
            <span class="w-40 text-sm">{{ invoice.salesDate }}</span>
          </div>
          <div class="flex justify-end item-center">
            <span class="w-32 font-medium">Due Date:</span>
            <span class="w-40 text-sm">{{ invoice.dueDate }}</span>
          </div>
        </div>
      </div>

      <!-- Items Header -->
      <div class="flex justify-between mt-6">
        <div class="bg-orange-500 text-white py-2 px-8 font-medium text-sm">
          Items
        </div>
        <div
          class="bg-orange-500 text-white py-1.5 px-4 mr-8 rounded-xl font-medium"
        >
          {{ invoice.invoiceNumber }}
        </div>
      </div>

      <!-- Items List -->
      <div class="p-4 mt-4">
        <div
          v-for="(item, index) in invoice.items"
          :key="index"
          class="flex mb-4 px-2"
        >
          <div class="w-1/6">
            <img
              src="https://media-cdn.tripadvisor.com/media/photo-s/12/d7/ca/34/rooftop-pool.jpg"
              alt="Item image"
              class="w-24 h-24 rounded-xl object-cover"
            />
          </div>
          <div class="w-3/5 pl-2">
            <h3 class="text-lg font-bold">{{ item.name }}</h3>
            <p class="text-sm">{{ item.description }}</p>
            <p class="font-semibold text-sm">{{ item.period }}</p>
            <p class="text-sm">{{ item.details }}</p>
          </div>
          <div class="w-1/5 text-right">
            <p class="mb-1 flex justify-center items-center">
              <span class="inline-block w-24 text-xs pr-3">Discount:</span>
              <span class="inline-block w-20 text-right"
                >{{ item.discount }} ฿</span
              >
            </p>
            <p class="flex justify-center items-center">
              <span class="inline-block w-24 text-xs pr-3">Amount:</span>
              <span class="inline-block w-20 text-right font-bold text-xl"
                >{{ item.amount }} ฿</span
              >
            </p>
          </div>
        </div>
      </div>

      <!-- QR Code and Summary -->
      <div class="flex mt-8 border-t-2 border-orange-500 pt-4 pb-8 px-6">
        <div class="w-1/2 flex">
          <div class="w-1/3">
            <!-- <img src="/qr-code.png" alt="QR Code" class="w-32 h-32" /> -->
          </div>
          <div class="w-2/3">
            <p class="font-semibold mb-2">
              Validate your tickets on our official website:
            </p>
            <ul class="list-disc pl-5">
              <li>Scan the above QR</li>
              <li>Login / Signup to thanywhere.com</li>
              <li>Confirm to connect invoice to profile.</li>
              <li>View tickets, booking status and a lot more!</li>
            </ul>
            <p class="mt-4 text-sm">
              Note QR can only be connected once. Please protect your invoice by
              connecting to your profile as soon as possible.
            </p>
          </div>
        </div>
        <div class="w-1/2">
          <div class="text-right">
            <div class="flex justify-end mb-2">
              <span class="inline-block w-32 font-semibold">Subtotal:</span>
              <span class="inline-block w-32 text-right"
                >{{ invoice.subtotal }} ฿</span
              >
            </div>
            <div class="flex justify-end mb-2">
              <span class="inline-block w-32 font-semibold">Discount:</span>
              <span class="inline-block w-32 text-right"
                >{{ invoice.totalDiscount }} ฿</span
              >
            </div>
            <div class="flex justify-end mb-2 text-lg font-bold">
              <span class="inline-block w-32">Total:</span>
              <span class="inline-block w-32 text-right"
                >{{ invoice.total }} ฿</span
              >
            </div>
            <div class="flex justify-end mb-2">
              <span class="inline-block w-32 font-semibold">Deposit:</span>
              <span class="inline-block w-32 text-right"
                >{{ invoice.deposit }} ฿</span
              >
            </div>
            <div class="flex justify-end mb-2 font-bold">
              <span class="inline-block w-32">Balance Due:</span>
              <span class="inline-block w-32 text-right"
                >{{ invoice.balanceDue }} ฿</span
              >
            </div>
            <div class="flex justify-end mb-2">
              <span class="inline-block w-32 font-semibold">Payment Due:</span>
              <span
                class="inline-block w-32 text-right text-red-500 font-bold"
                >{{ invoice.paymentStatus }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-orange-500 text-white p-6">
        <div class="flex justify-between">
          <div class="w-1/2">
            <div class="flex items-center mb-3">
              <div class="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <span>+959 250 794 945</span>
            </div>
            <div class="flex items-center mb-3">
              <div class="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <span>+959 250 794 945</span>
            </div>
            <div class="flex items-center">
              <div class="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <span>+959 250 794 945</span>
            </div>
          </div>
          <div class="w-1/2">
            <div class="flex">
              <div class="w-1/2">
                <div class="mb-3">
                  <div class="flex items-start">
                    <div class="mr-2 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p class="font-bold">Yangon Branch</p>
                      <p class="text-xs">
                        66/3C, 69th St (bet: 28-29th), Mandalay
                      </p>
                    </div>
                  </div>
                </div>
                <div class="mb-3">
                  <div class="flex items-start">
                    <div class="mr-2 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p class="font-bold">Mandalay Branch</p>
                      <p class="text-xs">
                        66/3C, 69th St (bet: 28-29th), Mandalay
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div class="flex items-start">
                    <div class="mr-2 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p class="font-bold">Pattaya Branch</p>
                      <p class="text-xs">
                        66/3C, 69th St (bet: 28-29th), Mandalay
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="w-1/2 flex items-center justify-center">
                <div class="text-center">
                  <div class="mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                      />
                    </svg>
                  </div>
                  <span>/ThAnywhereYgn</span>
                </div>
              </div>
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

const invoice = ref({
  customer: "Kumar Bhusal",
  salesDate: "23 March 2025",
  dueDate: "30 March 2025",
  invoiceNumber: "HN-2545",
  items: [
    {
      image: "/hotel.jpg", // Replace with actual image path
      name: "Asia Hotel Pattaya",
      description: "Superior Seaview Room with Breakfast",
      period: "In: 07-March-2025 - Out: 09-March-2025",
      details: "2 Nights x 2 Rooms x 1900",
      discount: "0",
      amount: "3800",
    },
    {
      image: "/frost.jpg", // Replace with actual image path
      name: "Frost Magical Garden",
      description: "Entrance Ticket Plus Boots",
      period: "2025-02-19",
      details: "Adult - 2 x 550 ฿ · Child - 0 x 350฿",
      discount: "0",
      amount: "3800",
    },
    {
      image: "/package.jpg", // Replace with actual image path
      name: "Pattaya Package 45",
      description: "Saloon",
      period: "2025-02-19",
      details: "1 Saloon x 4500 ฿",
      discount: "0",
      amount: "3800",
    },
    {
      image: "/frost.jpg", // Replace with actual image path
      name: "Frost Magical Garden",
      description: "Entrance Ticket Plus Boots",
      period: "2025-02-19",
      details: "Adult - 2 x 550 ฿ · Child - 0 x 350฿",
      discount: "0",
      amount: "3800",
    },
  ],
  subtotal: "23,800",
  totalDiscount: "0",
  total: "23,800",
  deposit: "16,800",
  balanceDue: "7,000",
  paymentStatus: "Not Paid",
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
