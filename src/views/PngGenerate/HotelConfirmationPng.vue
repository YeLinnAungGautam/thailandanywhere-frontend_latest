<script setup>
import { useRoute, useRouter } from "vue-router";
import { useReservationStore } from "../../stores/reservation";
import { onMounted, ref, defineProps } from "vue";
import { ArrowLeftCircleIcon } from "@heroicons/vue/24/outline";
import html2canvas from "html2canvas";

const captureArea = ref(null);

const props = defineProps({
  data: Object,
});

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
    link.download = `confirmation-${props.data.crm_id}.jpeg`; // Name of the saved file
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
    link.download = `confirmation-${props.data.crm_id}.png`; // Name of the saved file
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (error) {
    console.error("Error capturing the view:", error);
  }
};

onMounted(async () => {
  const svgElement = captureArea.value?.querySelector("svg");
  console.log("SVG element after mount:", svgElement);
});
</script>

<template>
  <div class="bg-white pb-6">
    <div class="flex justify-between items-center pb-5">
      <div class="flex justify-center items-center gap-x-3">
        <button
          @click="saveAsJpeg()"
          class="py-2 px-4 mt-4 rounded-lg text-white bg-[#FF613c] hover:bg-[#ff613c]/70 text-xs font-medium"
        >
          Save as JPEG
        </button>
        <button
          @click="saveAsPng()"
          class="py-2 px-4 mt-4 rounded-lg text-white bg-[#FF613c] hover:bg-[#ff613c]/70 text-xs font-medium"
        >
          Save as PNG
        </button>
      </div>
    </div>

    <div class="mx-auto">
      <div
        class="w-[794px] h-[1123px] p-12 mx-auto bg-white shadow"
        ref="captureArea"
      >
        <p class="w-full h-3 bg-black"></p>
        <div class="p-6">
          <div class="flex justify-between items-start">
            <div class="space-y-2">
              <p class="text-lg font-medium text-black">
                {{ data?.product?.name }}
              </p>
              <p class="w-[217px] text-sm text-gray-700">
                {{ data?.product?.official_address }}
              </p>
              <p class="text-sm text-gray-700">
                Tel: {{ data?.product?.official_phone_number }} Email:
                {{ data?.product?.official_email }}
              </p>
            </div>
            <div>
              <img
                :src="data?.product?.official_logo"
                class="w-[100px]"
                alt=""
              />
            </div>
          </div>
          <p class="text-xl text-black pt-2 pb-2 font-bold">
            Hotel Confirmation Letter
          </p>
          <p class="font-semibold text-red-500 pb-5">
            Submitted on {{ data?.receipt_images[0].date }}
          </p>
          <div class="">
            <div class="relative flex flex-col w-full h-full">
              <table class="w-full text-left table-auto min-w-max">
                <thead>
                  <tr>
                    <th class="p-1 border border-black">
                      <p class="block whitespace-nowrap pb-3 px-1 w-2/5">
                        Hotel Confirmation
                      </p>
                    </th>
                    <th class="p-1 border border-black w-3/5">
                      <p class="block pb-3 px-1">60095</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="p-1 border border-black">
                      <p
                        class="block text-sm pb-3 px-1 font-normal leading-normal text-blue-gray-900"
                      >
                        Guest name:
                      </p>
                    </td>
                    <td class="p-1 border border-black">
                      <div
                        class="block text-sm font-normal pb-3 px-1 leading-normal text-blue-gray-900"
                      >
                        <p
                          v-for="(i, index) in data?.customer_passports"
                          :key="index"
                        >
                          {{ index + 1 }}. {{ i.name }}
                        </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="p-1 border border-black">
                      <p
                        class="block text-sm font-normal pb-3 px-1 leading-normal text-blue-gray-900"
                      >
                        Check in date:
                      </p>
                    </td>
                    <td class="p-1 border border-black">
                      <p
                        class="block text-sm font-normal pb-3 px-1 leading-normal text-blue-gray-900"
                      >
                        {{ data?.checkin_date }}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td class="p-1 border border-black">
                      <p
                        class="block text-sm font-normal pb-3 px-1 leading-normal text-blue-gray-900"
                      >
                        Check out date:
                      </p>
                    </td>
                    <td class="p-1 border border-black">
                      <p
                        class="block text-sm font-normal pb-3 px-1 leading-normal text-blue-gray-900"
                      >
                        {{ data.checkout_date }}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td class="p-1 border border-black">
                      <p
                        class="block text-sm font-normal pb-3 px-1 leading-normal text-blue-gray-900"
                      >
                        Number of room:
                      </p>
                    </td>
                    <td class="p-1 border border-black">
                      <p
                        class="block text-sm font-normal pb-3 px-1 leading-normal text-blue-gray-900"
                      >
                        {{ data?.quantity }} room
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td class="p-1 border border-black">
                      <p
                        class="block text-sm font-normal pb-3 px-1 leading-normal text-blue-gray-900"
                      >
                        Payment detail:
                      </p>
                    </td>
                    <td class="p-1 border border-black">
                      <p
                        class="block text-sm font-normal pb-3 px-1 leading-normal text-blue-gray-900"
                      >
                        {{ data?.payment_status }}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td class="p-1 border border-black">
                      <p
                        class="block text-sm font-normal pb-3 px-1 leading-normal text-blue-gray-900"
                      >
                        Remark:
                      </p>
                    </td>
                    <td class="p-1 border border-black">
                      <p
                        class="block text-sm font-normal pb-3 px-1 leading-normal text-blue-gray-900"
                      >
                        {{ data?.product?.official_remark }}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="space-y-2 text-sm py-3">
            <p>We are pleased to inform you as following:</p>
            <p>
              <span
                class="w-1.5 h-1.5 bg-black rounded-full inline-block mr-2"
              ></span>
              Check-In time: Our check-in time is from
              {{ data?.product?.check_in }}
            </p>
            <p>
              <span
                class="w-1.5 h-1.5 bg-black rounded-full inline-block mr-2"
              ></span>
              Check-Out time: Our check-out time is before
              {{ data?.product?.check_out }}
            </p>
            <p>
              <span
                class="w-1.5 h-1.5 bg-black rounded-full inline-block mr-2"
              ></span>
              Passport/ID card: Government-issued photo identification (must be
              same person on room reservation) upon check-in.
            </p>
            <p>We look forward to welcoming you soon.</p>
            <p>
              Should there be any further assistance or more information you
              require, please do not hesitate to contact
            </p>
          </div>

          <p class="text-sm">Yours faithfully,</p>
          <p class="text-sm font-semibold pt-2 italic">Reservation Teams.</p>
        </div>
      </div>
    </div>
  </div>
</template>
