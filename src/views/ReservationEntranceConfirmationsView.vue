<script setup>
import { useRoute, useRouter } from "vue-router";
import { useReservationStore } from "../stores/reservation";
import { onMounted, ref } from "vue";
import { ArrowLeftCircleIcon } from "@heroicons/vue/24/outline";
import QrCode from "../components/QrCode.vue";
import html2canvas from "html2canvas";
import logoIcon from "../assets/web-logo.png";
import Layout from "./Layout.vue";

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
  <Layout>
    <div class="bg-[#edecec] min-h-screen px-6">
      <div class="flex justify-end items-center">
        <!-- <ArrowLeftCircleIcon class="w-8 h-8" @click="router.back()" /> -->
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

      <div class="p-6 bg-[#edecec] max-w-[400px] mx-auto" ref="captureArea">
        <div id="mySvg" class="bg-white rounded-xl pt-4 mt-4">
          <div class="flex justify-between items-center pb-4 px-5">
            <img :src="logoIcon" class="w-8 h-8" alt="" />
            <div
              class="bg-[#FF613c] h-[25px] w-[120px] relative overflow-hidden px-3 rounded-lg"
            >
              <p class="text-sm text-white font-semibold absolute -top-1">
                THANYWHERE
              </p>
            </div>
          </div>

          <div class="px-5">
            <img
              :src="details?.product?.cover_image"
              class="rounded-lg w-full h-[160px] object-cover"
              alt=""
            />
          </div>

          <div class="py-3 border-b px-5 border-black/10 space-y-1">
            <p class="font-medium text-[#ff613c]">
              {{ details?.product?.name }}
            </p>
            <div class="flex justify-start items-center gap-x-1">
              <p class="text-sm">
                {{ details?.product?.categories[0]?.name }}
              </p>
              <p class="text-black font-bold text-xl mb-3">.</p>
              <p class="text-sm">{{ details?.product?.cities[0]?.name }}</p>
            </div>
          </div>
          <div class="py-3 grid px-5 grid-cols-2 gap-4">
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
              <p class="text-sm">
                {{
                  details?.quantity +
                  (details?.individual_pricing != "null" &&
                  details?.individual_pricing?.adult?.quantity
                    ? JSON.parse(details?.individual_pricing?.child?.quantity)
                    : 0)
                }}
              </p>
            </div>
            <div class="grid grid-cols-2 gap-x-2">
              <div class="space-y-1.5">
                <p class="text-xs text-black/40">Adult:</p>
                <p class="text-sm">
                  {{ details?.quantity }}
                </p>
              </div>
              <div class="space-y-1.5">
                <p class="text-xs text-black/40">Child:</p>
                <p class="text-sm">
                  {{
                    details?.individual_pricing != null &&
                    details?.individual_pricing?.child
                      ? JSON.parse(details?.individual_pricing.child.quantity)
                      : "-"
                  }}
                </p>
              </div>
            </div>
            <div class="space-y-1.5 col-span-2">
              <p class="text-xs text-black/40">Ticket Type:</p>
              <p class="text-sm font-medium">{{ details?.variation?.name }}</p>
            </div>
          </div>
          <div
            class="space-y-2 pb-6 border-b-[2px] border-dashed border-black/50 w-full relative"
          >
            <div
              class="w-20 h-20 bg-[#edecec] rounded-full absolute top-[35px] -left-[60px]"
            ></div>
            <div
              class="w-20 h-20 bg-[#edecec] rounded-full absolute top-[30px] -right-[60px]"
            ></div>
            <p class="text-center text-xs text-black/40">Customer Name:</p>
            <p class="text-xl font-semibold text-[#ff613c] text-center">
              {{ details?.customer_info.name }}
            </p>
          </div>
          <div class="pt-4 flex px-5 justify-center items-center">
            <QrCode :id="route.params.id" />
          </div>
          <p
            class="text-[12px] font-medium text-start px-5 pt-1 mt-4 pb-5 leading-6 rounded-b-2xl bg-[#FF613c] text-white"
          >
            မှတ်ချက်။ ။ လက်မှတ် ထုတ်ပုံ ထုတ်နည်း ၊ သွားရမည့်နေရာ ၊မှန်ကန်ကြောင်း
            ၊ နှင့် အထင်ကရနေရာ ၏ Video ကို QR Scan လုပ်ပြီး ကြည့်ရှု နိုင်ပါပြီ။
          </p>
        </div>
      </div>
    </div>
  </Layout>
</template>
