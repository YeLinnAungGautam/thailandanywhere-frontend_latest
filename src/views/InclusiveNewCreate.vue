<script setup>
import Layout from "./Layout.vue";
import { ref } from "vue";
import { CheckCircleIcon } from "@heroicons/vue/24/solid";
import GeneralDetailVue from "./InclusiveComponent/GeneralDetail.vue";
import ItemDetail from "./InclusiveComponent/ItemDetail.vue";
import ContentDetail from "./InclusiveComponent/ContentDetail.vue";
import OtherMaterial from "./InclusiveComponent/OtherMaterial.vue";

const session = ref(1);
const finish = ref({
  session1: false,
  session2: false,
  session3: false,
  session4: false,
});
</script>

<template>
  <Layout>
    <!-- header part -->
    <div
      class="flex justify-start py-3 bg-white border-b border-gray-200 px-8 gap-x-2 items-center"
    >
      <div
        class="flex justify-start items-center gap-2 cursor-pointer"
        :class="session == 1 ? '' : 'opacity-40'"
      >
        <CheckCircleIcon
          class="text-green-500 w-6 h-6"
          v-if="finish.session1"
        />
        <div
          v-if="!finish.session1"
          class="w-5 h-5 border border-red-300 rounded-full flex justify-center items-center"
        >
          <p class="pb-9 text-red-500 text-6xl">.</p>
        </div>
        <p class="text-sm">General details</p>
        <p class="px-4 text-gray-400">-----</p>
      </div>
      <div
        class="flex justify-start items-center gap-2 cursor-pointer"
        :class="session == 2 ? '' : 'opacity-40'"
      >
        <CheckCircleIcon
          class="text-green-500 w-6 h-6"
          v-if="finish.session2"
        />
        <div
          v-if="!finish.session2"
          class="w-5 h-5 border border-red-300 rounded-full flex justify-center items-center"
        >
          <p class="pb-9 text-red-500 text-6xl">.</p>
        </div>
        <p class="text-sm">Item details</p>
        <p class="px-4 text-gray-400">-----</p>
      </div>
      <div
        class="flex justify-start items-center gap-2 cursor-pointer"
        :class="session == 3 ? '' : 'opacity-40'"
      >
        <CheckCircleIcon
          class="text-green-500 w-6 h-6"
          v-if="finish.session3"
        />
        <div
          v-if="!finish.session3"
          class="w-5 h-5 border border-red-300 rounded-full flex justify-center items-center"
        >
          <p class="pb-9 text-red-500 text-6xl">.</p>
        </div>
        <p class="text-sm">Content details</p>
        <p class="px-4 text-gray-400">-----</p>
      </div>
      <div
        class="flex justify-start items-center gap-2 cursor-pointer"
        :class="session == 4 ? '' : 'opacity-40'"
      >
        <CheckCircleIcon
          class="text-green-500 w-6 h-6"
          v-if="finish.session4"
        />
        <div
          v-if="!finish.session4"
          class="w-5 h-5 border border-red-300 rounded-full flex justify-center items-center"
        >
          <p class="pb-9 text-red-500 text-6xl">.</p>
        </div>
        <p class="text-sm">Other Materials</p>
      </div>
    </div>

    <!-- body part -->
    <div class="px-8 py-6 bg-white" v-if="session == 1">
      <div class="flex justify-between items-center">
        <p class="text-base">General Details</p>
        <div class="flex gap-x-2 justify-end items-center">
          <p
            @click="finish.session1 = true"
            class="bg-green-500 text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Save
          </p>
          <p
            @click="session = 2"
            class="bg-[#FF613C] text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Next
          </p>
        </div>
      </div>
      <div>
        <GeneralDetailVue />
      </div>
    </div>
    <div class="px-8 py-6 bg-white" v-if="session == 2">
      <div class="flex justify-between items-center">
        <p class="text-base pb-4">Item details</p>
        <div class="flex gap-x-2 justify-end items-center">
          <p
            @click="session = 1"
            class="bg-gray-500 text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Back
          </p>
          <p
            @click="finish.session2 = true"
            class="bg-green-500 text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Save
          </p>
          <p
            @click="session = 3"
            class="bg-[#FF613C] text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Next
          </p>
        </div>
      </div>
      <div>
        <ItemDetail />
      </div>
    </div>
    <div class="px-8 py-6 bg-white" v-if="session == 3">
      <div class="flex justify-between items-center">
        <p class="text-base">Content Details</p>
        <div class="flex gap-x-2 justify-end items-center">
          <p
            @click="session = 2"
            class="bg-gray-500 text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Back
          </p>
          <p
            @click="finish.session3 = true"
            class="bg-green-500 text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Save
          </p>
          <p
            @click="session = 4"
            class="bg-[#FF613C] text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Next
          </p>
        </div>
      </div>
      <div>
        <ContentDetail />
      </div>
    </div>
    <div class="px-8 py-6 bg-white" v-if="session == 4">
      <div class="flex justify-between items-center">
        <p class="text-base">Other Materials</p>
        <div class="flex gap-x-2 justify-end items-center">
          <p
            @click="session = 3"
            class="bg-gray-500 text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Back
          </p>
          <p
            @click="finish.session4 = true"
            class="bg-green-500 text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Save
          </p>
          <p
            @click="session = 1"
            class="bg-[#FF613C] text-white px-6 py-2 rounded-lg text-xs cursor-pointer"
          >
            Create
          </p>
        </div>
      </div>
      <div>
        <OtherMaterial />
      </div>
    </div>
  </Layout>
</template>
