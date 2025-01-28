<script setup>
import { useRoute, useRouter } from "vue-router";
import { useReservationStore } from "../stores/reservation";
import { onMounted, ref } from "vue";
import { ArrowLeftCircleIcon } from "@heroicons/vue/24/outline";
import QrCode from "../components/QrCode.vue";
import html2canvas from "html2canvas";

const route = useRoute();
const router = useRouter();
const reservationStore = useReservationStore();

const details = ref(null);

const getDetail = async () => {
  try {
    const response = await reservationStore.getDetailAction(route.params.id);
    console.log(response.result, "this is response");
    details.value = response.result;
  } catch (error) {
    console.log(error);
  }
};

const captureArea = ref(null);

const saveAsJpeg = async () => {
  if (!captureArea.value) {
    console.error("Capture area not found!");
    return;
  }

  try {
    const canvas = await html2canvas(captureArea.value, {
      backgroundColor: "#fff", // Ensure a white background for the image
      useCORS: true,
      allowTaint: true,
    });

    const link = document.createElement("a");
    link.download = `${details?.value.crm_id}.jpeg`; // Name of the saved file
    link.href = canvas.toDataURL("image/jpeg");
    link.click();
  } catch (error) {
    console.error("Error capturing the view:", error);
  }
};

const saveAsPng = async () => {
  if (!captureArea.value) {
    console.error("Capture area not found!");
    return;
  }

  try {
    const canvas = await html2canvas(captureArea.value, {
      backgroundColor: "#fff", // Ensure a white background for the image
      useCORS: true,
      allowTaint: true,
    });

    const link = document.createElement("a");
    link.download = `${details?.value.crm_id}.png`; // Name of the saved file
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (error) {
    console.error("Error capturing the view:", error);
  }
};

const goToSvg = () => {
  router.push(`/reservation/confirmations/svg/entrance/${route.params.id}`);
};

onMounted(async () => {
  await getDetail();
  const svgElement = captureArea.value?.querySelector("svg");
  console.log("SVG element after mount:", svgElement);
});
</script>

<template>
  <div class="bg-[#F6F6F6] min-h-screen px-6 py-4">
    <div class="flex justify-between items-center">
      <ArrowLeftCircleIcon class="w-8 h-8" @click="router.back()" />
      <div class="flex justify-center items-center mt-4 gap-x-3">
        <button
          @click="saveAsJpeg()"
          class="py-3 px-4 mt-4 rounded-lg text-white bg-[#FF613c] hover:bg-[#ff613c]/70 text-xs font-medium"
        >
          Save as JPEG
        </button>
        <button
          @click="saveAsPng()"
          class="py-3 px-4 mt-4 rounded-lg text-white bg-[#FF613c] hover:bg-[#ff613c]/70 text-xs font-medium"
        >
          Save as PNG
        </button>
        <button
          @click="goToSvg()"
          class="py-3 px-4 mt-4 rounded-lg text-white bg-gray-500/30 hover:bg-[#ff613c]/70 text-xs font-medium"
        >
          Save as SVG
        </button>
      </div>
    </div>

    <div class="p-6 bg-[#F6F6F6] max-w-[400px] mx-auto" ref="captureArea">
      <div id="mySvg" class="bg-white rounded-xl p-5 mt-4">
        <img
          :src="details?.product?.cover_image"
          class="rounded-lg w-full h-[160px] object-cover"
          alt=""
        />

        <div class="py-3 border-b border-black/10 space-y-1">
          <p class="font-medium text-[#ff613c]">{{ details?.product?.name }}</p>
          <div class="flex justify-start items-center gap-x-1">
            <p class="text-sm">
              {{ details?.product?.categories[0].name }}
            </p>
            <p class="text-black font-bold text-xl mb-3">.</p>
            <p class="text-sm">{{ details?.product?.cities[0].name }}</p>
          </div>
        </div>
        <div class="py-3 grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <p class="text-xs text-black/40">Booking ID:</p>
            <p class="text-sm">{{ details?.crm_id }}</p>
          </div>
          <div class="space-y-1.5">
            <p class="text-xs text-black/40">Service Date:</p>
            <p class="text-sm text-[#ff613c]">{{ details?.service_date }}</p>
          </div>
          <div class="space-y-1.5">
            <p class="text-xs text-black/40">Quantity:</p>
            <p class="text-sm">{{ details?.quantity }}</p>
          </div>
          <div class="grid grid-cols-2 gap-x-2">
            <div class="space-y-1.5">
              <p class="text-xs text-black/40">Adult:</p>
              <p class="text-sm">-</p>
            </div>
            <div class="space-y-1.5">
              <p class="text-xs text-black/40">Child:</p>
              <p class="text-sm">-</p>
            </div>
          </div>
          <div class="space-y-1.5 col-span-2">
            <p class="text-xs text-black/40">Ticket Type:</p>
            <p class="text-sm font-medium">{{ details?.variation?.name }}</p>
          </div>
        </div>
        <div
          class="space-y-2 pt-8 pb-6 border-b-4 border-dashed border-black/30 w-full relative"
        >
          <div
            class="w-20 h-20 bg-[#F6F6F6] rounded-full absolute top-[75px] -left-[60px]"
          ></div>
          <div
            class="w-20 h-20 bg-[#F6F6F6] rounded-full absolute top-[70px] -right-[60px]"
          ></div>
          <p class="text-center text-xs text-black/40">Customer Name:</p>
          <p class="text-xl font-semibold text-[#ff613c] text-center">
            {{ details?.customer_info.name }}
          </p>
        </div>
        <div class="pt-4 flex justify-center items-center">
          <QrCode :id="route.params.id" />
        </div>
      </div>
    </div>
  </div>
</template>
