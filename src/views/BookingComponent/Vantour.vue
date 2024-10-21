<script setup>
import { ref, onMounted, watch } from "vue";
import {
  MagnifyingGlassIcon,
  BarsArrowDownIcon,
} from "@heroicons/vue/24/outline";
import { useVantourStore } from "../../stores/vantour";
import { storeToRefs } from "pinia";
import debounce from "lodash/debounce";

const bottomOfWindow = ref(false);
const vantourStore = useVantourStore();
const { vantours, loading } = storeToRefs(vantourStore);
const destsList = ref([]);
const search = ref("");

const handleScroll = (event) => {
  const target = event.target;
  const isAtBottom =
    Math.floor(target.scrollTop + target.clientHeight) >=
    target.scrollHeight - 100;
  bottomOfWindow.value = isAtBottom;
};

const changePage = async (url) => {
  console.log(url);
  if (url != null) {
    await vantourStore.getChangePage(url, { search: search.value });
  }
};

watch(bottomOfWindow, (newVal) => {
  console.log("bottomOfWindow changed:", newVal);
  if (bottomOfWindow.value == true) {
    let changePageCalled = false;
    if (newVal && !changePageCalled) {
      console.log("This is the bottom of the window");

      if (
        vantours?.value?.meta?.current_page < vantours?.value?.meta?.last_page
      ) {
        changePageCalled = true; // Set the flag to true

        changePage(
          vantours?.value?.meta?.links[vantours?.value?.meta?.current_page + 1]
            .url
        );
      }
    }
  }
});

watch(vantours, async (newValue) => {
  if (newValue) {
    destsList.value = [...destsList.value, ...newValue?.data];
  }
});

watch(
  search,
  debounce(async (newValue) => {
    destsList.value = [];
    await vantourStore.getListAction({
      search: newValue,
    });
  }, 500)
);

onMounted(async () => {
  window.addEventListener("scroll", handleScroll);
  await vantourStore.getListAction({
    search: search.value,
  });
});
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-sm font-medium">Product Vantours</h1>
    <!-- search part -->
    <div class="flex justify-start items-center gap-x-2 flex-nowrap">
      <div class="relative w-[80%]">
        <input
          type="text"
          v-model="search"
          name=""
          class="bg-white w-full px-8 py-2 rounded-lg focus:outline-none text-xs"
          placeholder="Search for products here !"
          id=""
        />
        <MagnifyingGlassIcon
          class="w-4 h-4 absolute text-[#ff613c] top-2 left-2"
        />
      </div>
      <div class="bg-[#ff613c] p-2 rounded-full">
        <!-- filter icon -->
        <BarsArrowDownIcon class="w-4 h-4 text-white" />
      </div>
      <div
        class="bg-[#ff613c] py-2 px-4 cursor-pointer text-xs text-white rounded-xl"
      >
        search
      </div>
    </div>
    <!-- product part -->
    <div
      class="max-h-[50vh] grid grid-cols-3 gap-3 pr-4 overflow-y-scroll"
      @scroll="handleScroll"
    >
      <div
        class="bg-white p-2 rounded-lg shadow-sm space-y-2"
        v-for="i in destsList ?? []"
        :key="i"
      >
        <div class="flex justify-start items-start gap-x-2">
          <img
            :src="
              i?.cover_image != null
                ? i?.cover_image
                : 'https://placehold.co/400'
            "
            class="w-14 h-14 rounded-lg"
            alt=""
          />
          <div>
            <p class="text-xs font-medium">{{ i?.name }}</p>
            <p class="text-[10px]">{{ i?.type }}</p>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <p class="font-medium">{{ i?.lowest_car_price }} ฿</p>
          <button
            class="bg-blue-500 text-white px-2 py-1 rounded-full text-[10px]"
          >
            + Add item
          </button>
        </div>
      </div>
      <div v-if="loading" class="text-xs p-6 text-center">
        <p>loading , please wait ...</p>
      </div>
    </div>
  </div>
</template>
