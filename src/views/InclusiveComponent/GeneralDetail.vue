<script setup>
import { PlusIcon } from "@heroicons/vue/24/outline";
import { defineProps, computed, watch } from "vue";
import { ref } from "@vue/reactivity";
import { MinusIcon } from "@heroicons/vue/24/solid";

const props = defineProps({
  formData: Object,
});

// Local reactive state for day
const day = ref(props.formData.night * 1 + 1);

// Watch for changes in props.formData.night
watch(
  () => props.formData.night,
  (newVal) => {
    props.formData.day = newVal * 1 + 1;
  }
);

const price_range_item = ref({
  from: "",
  to: "",
  price: "",
});

const addPriceRange = () => {
  props.formData.price_range.push(price_range_item.value);
  price_range_item.value = {
    from: "",
    to: "",
    price: "",
  };
};

const removePriceRange = (index) => {
  props.formData.price_range.splice(index, 1);
};
</script>
<template>
  <div class="grid grid-cols-3 gap-6">
    <div class="col-span-2">
      <div class="grid grid-cols-2 gap-4 pt-2">
        <div class="space-y-2">
          <label for="" class="text-[12px] text-gray-500"
            >Product Name *
          </label>
          <input
            type="text"
            v-model="formData.name"
            class="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none text-xs w-full"
          />
        </div>
        <div class="space-y-2">
          <label for="" class="text-[12px] text-gray-500">SKU * </label>
          <input
            type="text"
            v-model="formData.sku_code"
            class="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none text-xs w-full"
          />
        </div>
        <div class="space-y-2">
          <label for="" class="text-[12px] text-gray-500"
            >Total Nights *
          </label>
          <input
            type="number"
            v-model="formData.night"
            class="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none text-xs w-full"
          />
        </div>
        <div class="space-y-2">
          <label for="" class="text-[12px] text-gray-500">Total Days * </label>
          <input
            type="number"
            disabled
            v-model="formData.day"
            class="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none text-xs w-full"
          />
        </div>
        <div class="space-y-2">
          <label for="" class="text-[12px] text-gray-500"
            >Display Price *
          </label>
          <input
            type="number"
            v-model="formData.price"
            class="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none text-xs w-full"
          />
        </div>
        <div class="space-y-2">
          <label for="" class="text-[12px] text-gray-500">Agent Price * </label>
          <input
            type="number"
            v-model="formData.agent_price"
            class="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none text-xs w-full"
          />
        </div>
        <div class="col-span-2 flex justify-start items-center gap-x-4 w-full">
          <div class="space-y-2">
            <label for="" class="text-[12px] text-gray-500"
              >Price Range *
            </label>
            <div class="flex justify-start items-center">
              <div
                class="flex justify-start items-center border px-3 py-1 border-gray-200 rounded-s-lg"
              >
                <p class="text-xs text-gray-400">from</p>
                <input
                  type="number"
                  v-model="price_range_item.from"
                  class="focus:outline-none w-[80px] px-2"
                  name=""
                  id=""
                />
                <p class="text-xs">pax</p>
              </div>
              <div
                class="flex justify-start items-center border px-3 py-1 border-gray-200 rounded-e-lg"
              >
                <p class="text-xs text-gray-400">to</p>
                <input
                  type="number"
                  v-model="price_range_item.to"
                  class="focus:outline-none w-[80px] px-2"
                  name=""
                  id=""
                />
                <p class="text-xs">pax</p>
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <label for="" class="text-[12px] text-gray-500">Price * </label>
            <div class="flex justify-start items-center gap-x-2">
              <input
                type="number"
                name=""
                v-model="price_range_item.price"
                class="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none text-xs w-[200px]"
                id=""
              />
              <div
                @click="addPriceRange"
                class="bg-green-500 rounded-full w-6 h-6 flex justify-center items-center"
              >
                <PlusIcon class="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
        <div
          class="col-span-2 flex justify-start items-center gap-x-4 w-full"
          v-for="(p, index) in formData.price_range"
          :key="index"
        >
          <div class="space-y-2">
            <div class="flex justify-start items-center">
              <div
                class="flex justify-start items-center border px-3 py-1 border-gray-200 rounded-s-lg"
              >
                <p class="text-xs text-gray-400">from</p>
                <input
                  type="number"
                  v-model="p.from"
                  class="focus:outline-none w-[80px] px-2"
                  name=""
                  id=""
                />
                <p class="text-xs">pax</p>
              </div>
              <div
                class="flex justify-start items-center border px-3 py-1 border-gray-200 rounded-e-lg"
              >
                <input
                  type="number"
                  v-model="p.to"
                  class="focus:outline-none w-[80px] px-2"
                  name=""
                  id=""
                />
                <p class="text-xs">pax</p>
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-start items-center gap-x-2">
              <input
                type="number"
                name=""
                v-model="p.price"
                class="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none text-xs w-[200px]"
                id=""
              />
              <div
                @click="removePriceRange(index)"
                class="bg-red-500 rounded-full w-6 h-6 flex justify-center items-center"
              >
                <MinusIcon class="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pt-4">
      <div
        class="w-full h-[500px] bg-gray-300 rounded-lg flex justify-center items-center"
      >
        <p class="text-gray-500">preview</p>
      </div>
    </div>
  </div>
</template>
