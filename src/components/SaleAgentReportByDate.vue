<template>
  <div>
    <div v-if="part == 'sale'">
      <div
        class="text-sm flex justify-between cursor-pointer items-center px-4 py-2 rounded-md hover:bg-gray-100"
        @click="show = !show"
      >
        <div class="flex justify-start items-center gap-4">
          <img
            src="https://img.freepik.com/free-psd/3d-illustration-person_23-2149436182.jpg?t=st=1709107594~exp=1709111194~hmac=719ca64b61d1a37f5d78b41a7b08ae7ebcc1a32aa8a5ca144d29b607535ab609&w=740"
            class="w-10 h-10 rounded-full"
            alt=""
          />
          <div>
            <p class="text-xs font-semibold">{{ data?.created_by?.name }}</p>
            <p class="text-xs text-gray-800">
              {{ data.total_booking }} Booking
            </p>
          </div>
        </div>
        <div>
          <p
            class="text-[#FF5B00] text-xs flex justify-end items-center font-medium gap-3"
            v-if="data?.over_target_count"
          >
            count - {{ data?.over_target_count }} -
            {{ data?.over_target_count * 2000 }}
          </p>
          <p
            class="text-[#FF5B00] text-sm flex justify-end font-semibold items-center gap-3"
            v-if="data.total"
          >
            {{ data.total }} thb
            <ChevronDownIcon class="w-4 h-4" />
          </p>
        </div>
      </div>
      <div
        class="px-4 py-2 bg-gray-50 text-sm rounded-md space-y-2 divide-y-2 divide-y-gray-400"
        v-if="show"
      >
        <p class="text-xs font-semibold text-center">Show Agent Sales List</p>
        <div
          v-for="(l, index) in dataArray"
          :key="index"
          @click="router.push('/bookings/update/' + l + '/edit')"
          class="cursor-pointer hover:bg-orange-100/50 px-2 pt-2 text-xs flex justify-between items-center"
        >
          <div class="space-y-1">
            <p>{{ index + 1 }}</p>
          </div>
          <p>Go To Sale Detail</p>
        </div>
      </div>
    </div>
    <div v-if="part != 'sale'">
      <div class="grid grid-cols-2 gap-y-2">
        <p class="text-xs font-semibold">{{ data?.created_by?.name }}</p>
        <div
          class="text-xs text-start py-1 rounded-lg flex justify-between gap-x-1 items-center col-span-2"
        >
          <p
            class="bg-gray-200 text-gray-800 text-[10px] text-start pl-3 w-full py-0.5 rounded-lg"
          >
            TG : {{ data?.created_by?.target_amount }}
          </p>
          <p
            class="bg-gray-200 text-gray-800 text-[10px] text-start pl-3 w-full py-0.5 rounded-lg"
          >
            AVG : {{ (data.total / today).toFixed(0) }}
          </p>
          <p
            :class="
              data?.created_by?.target_amount < (data.total / today).toFixed(2)
                ? 'bg-green-200 text-green-800'
                : 'bg-red-200 text-red-800'
            "
            class="bg-gray-200 text-gray-800 text-[10px] px-1 text-center w-full py-0.5 rounded-lg"
          >
            {{
              data?.created_by?.target_amount < (data.total / today).toFixed(2)
                ? "over target"
                : "under target"
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import { useAdminStore } from "../stores/admin";

const router = useRouter();
const adminStore = useAdminStore();

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  part: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

const dataArray = computed(() => {
  if (props.data && props.data.booking_ids) {
    const array = props.data.booking_ids.split(",").map(Number);
    return array;
  } else {
    return [];
  }
});

const show = ref(false);
const today = ref(0);

// const getUserData = async () => {
//   let res = await adminStore.getDetailAction(props?.data.created_by.id);
//   console.log(res, "this is a new user");
// };

onMounted(() => {
  const currentDate = new Date();
  today.value = currentDate.getDate().toString().padStart(2, "0");
  // console.log(new Date(props.date[1]).getDate());
});

// watch(
//   () => props.date,
//   () => {
//     if (props.date) {
//       today.value = new Date(props.date[1]).getDate() * 1;
//       console.log(today.value, "====================================");
//       // console.log(
//       //   new Date(props.date[1]).getDate(),
//       //   new Date(props.date[0]).getDate()
//       // );
//       // console.log("====================================");
//     }
//   }
// );
</script>
