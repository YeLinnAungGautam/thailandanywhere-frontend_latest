<script setup>
import { useRoute, useRouter } from "vue-router";
import { useReservationStore } from "../../stores/reservation";
import { onMounted, ref } from "vue";
import { ArrowLeftCircleIcon } from "@heroicons/vue/24/outline";
import html2canvas from "html2canvas";

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
    link.download = `confirmation.jpeg`; // Name of the saved file
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
    link.download = `confirmation.png`; // Name of the saved file
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
        <p class="w-full h-3 bg-violet-950"></p>
        <div class="p-6">
          <div class="flex justify-between items-start">
            <div class="space-y-2">
              <p class="text-lg font-medium text-violet-600">Hotel Name</p>
              <p class="w-[217px] text-sm text-gray-700">
                45 Soi Petchaburi 13 Petchaburi RD,Thanonphyathai Petchaburi,
                Bangkok, 1040
              </p>
              <p class="text-sm text-gray-700">
                Tel: +66 2 1234 5678 Email: YB0eT@example.com
              </p>
            </div>
            <div>image</div>
          </div>
          <p>Hotel Confirmation Letter</p>
          <p>Submitted on 14/03/2024</p>
          <div class="">
            <div
              class="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white border border-black bg-clip-border"
            >
              <table class="w-full text-left table-auto min-w-max">
                <thead>
                  <tr>
                    <th class="p-4 border-b border-r border-black">
                      <p class="block whitespace-nowrap w-2/5">
                        Hotel Confirmation
                      </p>
                    </th>
                    <th class="p-4 border-b border-black w-3/5">
                      <p class="block">Job</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="p-4 border-b border-blue-gray-50">
                      <p
                        class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900"
                      >
                        John Michael
                      </p>
                    </td>
                    <td class="p-4 border-b border-blue-gray-50">
                      <p
                        class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900"
                      >
                        Manager
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
