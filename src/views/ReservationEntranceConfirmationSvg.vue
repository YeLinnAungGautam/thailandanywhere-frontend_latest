<template>
  <div class="bg-[#F6F6F6] min-h-screen px-6 py-4">
    <div class="flex justify-between items-center">
      <ArrowLeftCircleIcon class="w-8 h-8" @click="router.back()" />
      <div class="flex justify-center items-center mt-4 gap-x-3">
        <button
          @click="saveAsSVG()"
          class="py-3 px-4 mt-4 rounded-lg text-white bg-[#FF613c] hover:bg-[#ff613c]/70 text-xs font-medium"
        >
          Save as SVG
        </button>
      </div>
    </div>

    <div class="p-6 bg-[#F6F6F6] max-w-[400px] mx-auto" ref="captureArea">
      <svg
        width="400"
        height="800"
        viewBox="0 0 400 800"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- White Background Card -->
        <rect x="0" y="0" width="400" height="800" rx="12" fill="white" />

        <!-- Cover Image -->
        <image
          v-if="details?.product?.cover_image"
          :href="details?.product?.cover_image"
          x="20"
          y="20"
          width="360"
          height="160"
          preserveAspectRatio="xMidYMid slice"
        />
        <rect
          x="20"
          y="20"
          width="360"
          height="160"
          rx="8"
          fill="transparent"
          stroke="#E5E7EB"
        />

        <!-- Product Details -->
        <text x="20" y="220" fill="#FF613C" font-size="16" font-weight="500">
          {{ details?.product?.name }}
        </text>

        <!-- Category and City -->
        <text x="20" y="250" fill="#374151" font-size="14">
          {{ details?.product?.categories[0]?.name }}
          <tspan x="160" font-weight="bold">•</tspan>
          <tspan x="180">{{ details?.product?.cities[0]?.name }}</tspan>
        </text>

        <!-- Booking Details Grid -->
        <g transform="translate(20, 280)">
          <!-- Booking ID -->
          <text fill="#6B7280" font-size="12">Booking ID:</text>
          <text y="20" fill="#374151" font-size="14">
            {{ details?.crm_id }}
          </text>

          <!-- Service Date -->
          <text x="200" fill="#6B7280" font-size="12">Service Date:</text>
          <text x="200" y="20" fill="#FF613C" font-size="14">
            {{ details?.service_date }}
          </text>

          <!-- Quantity -->
          <text y="60" fill="#6B7280" font-size="12">Quantity:</text>
          <text y="80" fill="#374151" font-size="14">
            {{ details?.quantity }}
          </text>

          <!-- Adult/Child -->
          <text x="200" y="60" fill="#6B7280" font-size="12">Adult:</text>
          <text x="200" y="80" fill="#374151" font-size="14">-</text>
          <text x="280" y="60" fill="#6B7280" font-size="12">Child:</text>
          <text x="280" y="80" fill="#374151" font-size="14">-</text>

          <!-- Ticket Type -->
          <text y="120" fill="#6B7280" font-size="12">Ticket Type:</text>
          <text y="140" fill="#374151" font-size="14" font-weight="500">
            {{ details?.variation?.name }}
          </text>
        </g>

        <!-- Divider with Circles -->
        <path
          d="M0 480 L400 480"
          stroke="#374151"
          stroke-width="2"
          stroke-dasharray="4 4"
        />
        <circle cx="-20" cy="480" r="50" fill="#F6F6F6" />
        <circle cx="420" cy="480" r="50" fill="#F6F6F6" />

        <!-- Customer Name -->
        <text
          x="200"
          y="520"
          text-anchor="middle"
          fill="#6B7280"
          font-size="12"
        >
          Customer Name:
        </text>
        <text
          x="200"
          y="550"
          text-anchor="middle"
          fill="#FF613C"
          font-size="20"
          font-weight="600"
        >
          {{ details?.customer_info.name }}
        </text>

        <!-- QR Code -->
        <g transform="translate(100, 600)">
          <QrCode :id="route.params.id" ref="qrCodeRef" />
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useReservationStore } from "../stores/reservation";
import { onMounted, ref } from "vue";
import { ArrowLeftCircleIcon } from "@heroicons/vue/24/outline";
import QrCode from "../components/QrCode.vue";
// import QRCodeVue3 from "qrcode-vue3";

const route = useRoute();
const router = useRouter();
const reservationStore = useReservationStore();
const captureArea = ref(null);
const qrCodeRef = ref(null);

const details = ref(null);

const getDetail = async () => {
  try {
    const response = await reservationStore.getDetailAction(route.params.id);
    details.value = response.result;
  } catch (error) {
    console.log(error);
  }
};

const saveAsSVG = () => {
  if (!captureArea.value) {
    console.error("Capture area not found!");
    return;
  }

  const svgElement = captureArea.value.querySelector("svg");

  if (!svgElement) {
    console.error("No SVG element found!");
    return;
  }

  try {
    const clonedSvg = svgElement.cloneNode(true);

    // Add necessary attributes
    clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clonedSvg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

    // Serialize and create blob
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clonedSvg);
    const svgBlob = new Blob(
      [
        '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n',
        '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n',
        svgString,
      ],
      { type: "image/svg+xml;charset=utf-8" }
    );

    // Download
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement("a");
    link.download = `ticket-${details.value?.crm_id || "download"}.svg`;
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error saving the SVG:", error);
  }
};

onMounted(async () => {
  await getDetail();
});
</script>
