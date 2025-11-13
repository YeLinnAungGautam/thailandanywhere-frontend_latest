import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    // Memory သက်သာစေဖို့
    sourcemap: false,
    chunkSizeWarningLimit: 1500,

    rollupOptions: {
      output: {
        // Libraries တွေကိုခွဲထုတ်ပါ
        manualChunks: {
          vue: ["vue", "vue-router", "pinia"],
          charts: ["apexcharts", "vue3-apexcharts", "chart.js", "vue-chart-3"],
          calendar: [
            "@fullcalendar/core",
            "@fullcalendar/daygrid",
            "@fullcalendar/interaction",
            "@fullcalendar/list",
            "@fullcalendar/timegrid",
            "@fullcalendar/vue3",
          ],
          imaging: [
            "cropperjs",
            "vue-cropperjs",
            "html2canvas",
            "tesseract.js",
            "mrz-detection",
            "qrcode",
            "qrcode-vue3",
          ],
          ui: [
            "@headlessui/vue",
            "@heroicons/vue",
            "v-tooltip",
            "vue-select",
            "sweetalert2",
            "vue-toastification",
          ],
          date: [
            "date-fns",
            "flatpickr",
            "@vuepic/vue-datepicker",
            "vue3-datepicker",
          ],
          utils: [
            "axios",
            "lodash",
            "uuid",
            "file-saver",
            "jszip",
            "class-variance-authority",
          ],
          maps: ["leaflet"],
          ai: ["openai"],
        },
      },
    },
    minify: "esbuild",
    target: "es2015",
  },

  optimizeDeps: {
    include: [
      "vue",
      "vue-router",
      "pinia",
      "axios",
      "lodash",
      "date-fns",
      "apexcharts",
    ],
    exclude: ["tesseract.js", "openai", "mrz-detection"],
  },
});
