<template>
  <div class="">
    <input
      type="search"
      v-model="search"
      name=""
      placeholder="search hotel"
      class="px-4 py-2 w-full text-[10px] shadow rounded-lg focus:outline-none"
      id=""
    />
    <div
      class="h-[200px] overflow-y-scroll pt-2"
      ref="scroll"
      @scroll="handleScroll"
    >
      <div
        v-for="i in scrollList ?? []"
        :key="i.id"
        @click="selectionAction(i)"
        class="flex justify-start items-center cursor-pointer"
      >
        <input
          type="checkbox"
          name="attraction"
          :id="i.id"
          :checked="selectId == i.id"
        />
        <p
          class="text-xs py-2 px-4"
          :class="selectId == i.id ? 'text-[#FF613c]' : ''"
        >
          {{ i.name }}
        </p>
      </div>
      <p
        class="text-xs w-full h-6 py-2 animate-pulse px-4 bg-gray-200 rounded-md"
        v-if="loading"
      ></p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineEmits } from "vue";
import { storeToRefs } from "pinia";
import debounce from "lodash/debounce";
import { useHotelStore } from "../../stores/hotel";

const scroll = ref(null);
const hotelStore = useHotelStore();
const { hotels, loading } = storeToRefs(hotelStore);
const scrollList = ref([]);
const bottomOfList = ref(false);
const search = ref("");
const selectItem = ref("");
const selectId = ref("");

const handleScroll = () => {
  if (
    scroll.value &&
    scroll.value.scrollTop + scroll.value.clientHeight >=
      scroll.value.scrollHeight
  ) {
    // Handle infinite scroll logic
    // console.log("Reached the end of the scroll");
    bottomOfList.value = true;
  }
};

const emit = defineEmits("selectAction");

const selectionAction = (data) => {
  selectItem.value = data.name;
  selectId.value = data.id;
  emit("selectAction", selectItem.value);
};

const changePage = async (url) => {
  if (url != null) {
    let data = {
      search: search.value,
    };
    await hotelStore.getChangePage(url, data);
  }
};

watch(bottomOfList, (newVal) => {
  if (bottomOfList.value == true) {
    let changePageCalled = false;
    if (newVal && !changePageCalled) {
      console.log("This is the bottom of the window");
      if (hotels?.value?.meta?.current_page < hotels?.value?.meta?.last_page) {
        changePageCalled = true; // Set the flag to true
        changePage(
          hotels?.value?.meta?.links[hotels?.value?.meta?.current_page + 1].url
        );
      }
      bottomOfList.value = false; // Reset the flag to false after the call is made
    }
  }
});

// Optional: Attach the scroll event listener after the component is mounted
onMounted(async () => {
  if (scroll.value) {
    scroll.value.addEventListener("scroll", handleScroll);
  }
  // Optional: Detach the scroll event listener when the component is unmounted
  await hotelStore.getListAction();
});

watch(
  search,
  debounce(async (newValue) => {
    scrollList.value = [];
    await hotelStore.getListAction({ search: newValue, page: 1 });
  }, 500)
);

watch(hotels, async (newValue) => {
  if (newValue) {
    scrollList.value = [...scrollList.value, ...newValue.data];
  }

  console.log(scrollList.value, "this is add new");
});
</script>
