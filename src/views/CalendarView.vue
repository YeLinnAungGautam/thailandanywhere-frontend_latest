<script setup>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import Layout from "./Layout.vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { useReservationStore } from "../stores/reservation";
import { storeToRefs } from "pinia";

const reservationStore = useReservationStore();
const { reservations, loading } = storeToRefs(reservationStore);
const router = useRouter();
const fetchData = async (service_date) => {
  await reservationStore.getListAction({
    calender_filter: true,
    service_date: service_date ?? null,
    limit: 100,
  });
};

const currentTime = ref(null);
const currentDate = ref(null);

onMounted(async () => {
  currentTime.value = new Date().toISOString();
  currentDate.value = currentTime.value.split("T")[0];
  // currentDate.value = "2023-08-02";
  await fetchData(currentDate.value);
});

const events = computed(() => {
  if (!reservations.value) {
    return null;
  } else {
    const resultItems = [];

    reservations.value.data.forEach((entry) => {
      resultItems.push(entry);
    });

    return resultItems.map((r) => {
      return {
        title: r?.product?.name,
        start: new Date(r?.service_date).toISOString(),
        extendedProps: {
          data: r,
        },
      };
    });
  }
});

const calendarOptions = ref({
  plugins: [dayGridPlugin],
  displayEventTime: false,
  initialView: "dayGridMonth",
  headerToolbar: {
    left: "prev,next",
    center: "title",
    right: "dayGridMonth", // user can switch between the two
  },
  events: events,
  eventClick: function (info) {
    const d = info.event.extendedProps.data;
    router.push("/reservation/update/" + d.id + "/" + d.crm_id + "/" + null);
  },
});

const handleSelect = (e) => {
  console.log(e);
};
</script>
<template>
  <Layout>
    <!-- <pre>
      {{ events }}
    </pre> -->
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-2xl font-medium text-gray-600">Calendar</h3>
    </div>
    <div class="grid grid-cols-3 gap-3">
      <div></div>
      <div class="col-span-2">
        <FullCalendar
          :options="calendarOptions"
          :selectable="true"
          @select="handleSelect"
        >
        </FullCalendar>
      </div>
    </div>
  </Layout>
</template>

<style>
</style>
