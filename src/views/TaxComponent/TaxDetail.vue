<template>
  <div>
    <div>
      <div>
        <div class="pt-2 relative flex justify-between items-center">
          <div
            class="flex justify-start items-center gap-x-3 cursor-pointer"
            @click="part = 'receipt'"
          >
            <div
              v-if="!state.receipt"
              @click="part = 'receipt'"
              class="w-6 h-6 flex justify-center shadow hover:shadow-nano cursor-pointer items-center text-[10px] rounded-full relative z-10"
              :class="
                part == 'receipt' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
              "
            >
              1
            </div>
            <div
              v-if="state.receipt"
              class="w-6 h-6 flex justify-center shadow hover:shadow-nano cursor-pointer items-center text-[10px] rounded-full relative z-10"
              :class="part == 'receipt' ? 'bg-white text-white' : ''"
              @click="part = 'receipt'"
            >
              <img :src="checkImage" alt="" />
            </div>
            <p
              class="text-xs"
              :class="state.receipt ? 'text-[#04BA00]' : 'text-gray-800'"
            >
              Tax Receipt
            </p>
          </div>
          <div
            class="relative z-10"
            :class="state.receipt ? 'text-[#04BA00]' : 'text-gray-800'"
          >
            <ChevronRightIcon class="w-4 h-4" />
          </div>
          <div
            class="flex justify-start items-center gap-x-3 cursor-pointer"
            @click="part = 'connect'"
          >
            <div
              v-if="!state.connect"
              @click="part = 'connect'"
              class="w-6 h-6 flex justify-center cursor-pointer items-center text-[10px] rounded-full relative z-10"
              :class="
                part == 'connect' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
              "
            >
              2
            </div>
            <div
              v-if="state.connect"
              @click="part = 'connect'"
              class="w-6 h-6 flex justify-center cursor-pointer shadow hover:shadow-none items-center text-[10px] rounded-full relative z-10"
              :class="part == 'connect' ? 'bg-white text-white' : ''"
            >
              <img :src="checkImage" alt="" />
            </div>
            <p
              class="text-xs"
              :class="state.connect ? 'text-[#04BA00]' : 'text-gray-800'"
            >
              connect
            </p>
          </div>
          <div
            class="relative z-10"
            :class="state.connect ? 'text-[#04BA00]' : 'text-gray-800'"
          >
            <ChevronRightIcon class="w-4 h-4" />
          </div>

          <div
            class="flex justify-start items-center gap-x-3 cursor-pointer"
            @click="part = 'clean_data'"
          >
            <div
              v-if="!state.clean_data"
              @click="part = 'clean_data'"
              class="w-6 h-6 flex justify-center cursor-pointer items-center text-[10px] rounded-full relative z-10"
              :class="
                part == 'clean_data' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
              "
            >
              3
            </div>
            <div
              v-if="state.clean_data"
              @click="part = 'clean_data'"
              class="w-6 h-6 flex justify-center cursor-pointer shadow hover:shadow-none items-center text-[10px] rounded-full relative z-10"
              :class="part == 'clean_data' ? 'bg-white text-white' : ''"
            >
              <img :src="checkImage" alt="" />
            </div>
            <p
              class="text-xs"
              :class="state.clean_data ? 'text-[#04BA00]' : 'text-gray-800'"
            >
              clean_data
            </p>
          </div>
          <div
            class="relative z-10"
            :class="state.clean_data ? 'text-[#04BA00]' : 'text-gray-800'"
          >
            <ChevronRightIcon class="w-4 h-4" />
          </div>
          <div
            class="flex justify-start items-center gap-x-3 cursor-pointer"
            @click="part = 'validation'"
          >
            <div
              v-if="!state.validation"
              @click="part = 'validation'"
              class="w-6 h-6 flex justify-center items-center shadow hover:shadow-nano cursor-pointer text-[10px] rounded-full relative z-10"
              :class="
                part == 'validation' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
              "
            >
              4
            </div>
            <div
              v-if="state.validation"
              @click="part = 'validation'"
              class="w-6 h-6 flex justify-center shadow hover:shadow-nano cursor-pointer items-center text-[10px] rounded-full relative z-10"
              :class="part == 'validation' ? 'bg-white text-white' : ''"
            >
              <img :src="checkImage" alt="" />
            </div>
            <p
              class="text-xs"
              :class="state.validation ? 'text-[#04BA00]' : 'text-gray-800'"
            >
              validation
            </p>
          </div>
          <div
            class="relative z-10"
            :class="state.download ? 'text-[#04BA00]' : 'text-gray-800'"
          >
            <ChevronRightIcon class="w-4 h-4" />
          </div>
          <div
            class="flex justify-start items-center gap-x-3 cursor-pointer"
            @click="part = 'download'"
          >
            <div
              v-if="!state.download"
              @click="part = 'download'"
              class="w-6 h-6 flex justify-center items-center shadow hover:shadow-nano cursor-pointer text-[10px] rounded-full relative z-10"
              :class="
                part == 'download' ? 'bg-[#FF613c] text-white' : 'bg-gray-200'
              "
            >
              5
            </div>
            <div
              v-if="state.download"
              @click="part = 'download'"
              class="w-6 h-6 flex justify-center shadow hover:shadow-nano cursor-pointer items-center text-[10px] rounded-full relative z-10"
              :class="part == 'download' ? 'bg-white text-white' : ''"
            >
              <img :src="checkImage" alt="" />
            </div>
            <p
              class="text-xs"
              :class="state.download ? 'text-[#04BA00]' : 'text-gray-800'"
            >
              download
            </p>
          </div>
        </div>

        <div class="pt-2 flex justify-between items-center gap-x-6">
          <p
            class="w-full rounded-lg h-1"
            :class="{
              'bg-green-500': part === 'receipt' && state.receipt,
              'bg-[#FF613c]': part === 'receipt' && !state.receipt,
              'opacity-0': part !== 'receipt',
            }"
          ></p>
          <p
            class="w-full rounded-lg h-1"
            :class="{
              'bg-green-500': part === 'connect' && state.connect,
              'bg-[#FF613c]': part === 'connect' && !state.connect,
              'opacity-0': part !== 'connect',
            }"
          ></p>
          <p
            class="w-full rounded-lg h-1"
            :class="{
              'bg-green-500': part === 'clean_data' && state.clean_data,
              'bg-[#FF613c]': part === 'clean_data' && !state.clean_data,
              'opacity-0': part !== 'clean_data',
            }"
          ></p>
          <p
            class="w-full rounded-lg h-1"
            :class="{
              'bg-green-500': part === 'validation' && state.validation,
              'bg-[#FF613c]': part === 'validation' && !state.validation,
              'opacity-0': part !== 'validation',
            }"
          ></p>
          <p
            class="w-full rounded-lg h-1"
            :class="{
              'bg-green-500': part === 'download' && state.download,
              'bg-[#FF613c]': part === 'download' && !state.download,
              'opacity-0': part !== 'download',
            }"
          ></p>
        </div>

        <div class="relative" v-if="show != 3">
          <Transition :name="transition" mode="out-in">
            <div class="pt-6" :key="part">
              <component
                :is="getComponent(part)"
                :detail="detail"
                :getDetailAction="getDetailAction"
              />
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ReceiptPage from "./ReceiptPage.vue";
import { ChevronRightIcon } from "@heroicons/vue/24/outline";
import ConnectPage from "./ConnectPage.vue";
import CleanDataPage from "./CleanDataPage.vue";
import ValidationPage from "./ValidationPage.vue";
import DownloadPage from "./DownloadPage.vue";
const route = useRoute();
const router = useRouter();

const part = ref("receipt");
const transition = ref("slide-right");

const detail = ref(null);
const getDetailAction = () => {};
const show = ref(0);

const state = ref({
  receipt: false,
  connect: false,
  clean_data: false,
  validation: false,
  download: false,
});

const getComponent = (part) => {
  const components = {
    receipt: ReceiptPage,
    connect: ConnectPage,
    clean_data: CleanDataPage,
    validation: ValidationPage,
    download: DownloadPage,
  };
  return components[part];
};

watch(
  () => route.query.new,
  (newPart) => {
    if (newPart == "new") {
      part.value = "receipt";
      router.push({
        name: "TaxReceipt",
      });
    }
  },
  { immediate: true }
);
</script>

<style scoped>
/* Slide Right (enter from right, leave to left) */
.slide-right-enter-active {
  transition: transform 0.4s ease-out, opacity 0.4s ease-out;
}
.slide-right-leave-active {
  transition: transform 0.3s ease-in, opacity 0.3s ease-in;
}
.slide-right-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-right-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* Slide Left (enter from left, leave to right) */
.slide-left-enter-active {
  transition: transform 0.4s ease-out, opacity 0.4s ease-out;
}
.slide-left-leave-active {
  transition: transform 0.3s ease-in, opacity 0.3s ease-in;
}
.slide-left-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-left-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
