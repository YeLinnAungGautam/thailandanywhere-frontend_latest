<template>
  <div class="py-10">
    <div class="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
      <div class="md:grid md:grid-cols-1">
        <div class="">
          <div class="flex items-center">
            <h2 class="flex-auto font-semibold text-gray-900">
              {{ format(firstDayCurrentMonth, "MMMM yyyy") }}
            </h2>
            <button
              type="button"
              @click="previousMonth"
              class="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span class="sr-only">Previous month</span>
              <ChevronLeftIcon class="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              @click="nextMonth"
              type="button"
              class="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span class="sr-only">Next month</span>
              <ChevronRightIcon class="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
          <div
            class="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500"
          >
            <div>S</div>
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
          </div>
          <div class="grid grid-cols-7 mt-2 text-sm">
            <div
              v-for="(day, dayIdx) in days"
              :key="day.toString()"
              :class="
                classNames(
                  dayIdx === 0 && colStartClasses[getDay(day)],
                  'py-1.5'
                )
              "
            >
              <button
                type="button"
                @click="setSelectedDay(day)"
                :class="
                  classNames(
                    isEqual(day, selectedDay) &&
                      'text-white border border-white rounded-full',
                    !isEqual(day, selectedDay) &&
                      isToday(day) &&
                      'text-red-500 ',
                    !isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      isSameMonth(day, firstDayCurrentMonth) &&
                      'text-gray-900',
                    !isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      !isSameMonth(day, firstDayCurrentMonth) &&
                      'text-gray-400',
                    isEqual(day, selectedDay) && isToday(day) && 'bg-red-500',
                    isEqual(day, selectedDay) && !isToday(day) && 'bg-gray-900',
                    !isEqual(day, selectedDay) && 'hover:bg-gray-200',
                    (isEqual(day, selectedDay) || isToday(day)) &&
                      'font-semibold',
                    'mx-auto flex h-8 w-8 items-center justify-center rounded-full',
                    isPastOrToday(day) && 'opacity-20'
                  )
                "
                :disabled="isPastOrToday(day)"
              >
                <time :dateTime="format(day, 'yyyy-MM-dd')">
                  {{ format(day, "d") }}
                </time>
              </button>

              <div class="w-1 h-1 mx-auto mt-1">
                <div
                  v-if="
                    meetings.some((meeting) =>
                      isSameDay(parseISO(meeting.startDatetime), day)
                    )
                  "
                  class="w-1 h-1 rounded-full bg-sky-500"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <!-- <section class="mt-12 md:mt-0">
          <div class="flex justify-between items-center">
            <h2 class="font-semibold text-gray-800">
              <time :dateTime="format(selectedDay, 'yyyy-MM-dd')">
                {{ format(selectedDay, "MMM dd, yyyy") }}
              </time>
            </h2>
            <button
              @click="goToMainPage"
              class="text-center bg-[#ff613c] rounded-full py-2 w-[30%] text-sm text-white font-semibold"
            >
              choose
            </button>
          </div>
          <ol class="mt-4 space-y-1 text-sm leading-6 text-gray-500">
            <template v-if="selectedDayMeetings.length > 0">
              <Meeting
                v-for="meeting in selectedDayMeetings"
                :key="meeting.id"
                :meeting="meeting"
              />
            </template>
          </ol>
        </section> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits } from "vue";
// import { Menu, Transition } from '@headlessui/vue';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  isBefore,
  startOfToday,
} from "date-fns";

const emit = defineEmits(["change"]);

const meetings = [
  {
    id: 1,
    name: "Leslie Alexander",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    startDatetime: "2022-05-11T13:00",
    endDatetime: "2022-05-11T14:30",
  },
  {
    id: 2,
    name: "Michael Foster",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    startDatetime: "2022-05-20T09:00",
    endDatetime: "2022-05-20T11:30",
  },
  {
    id: 3,
    name: "Dries Vincent",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    startDatetime: "2022-05-20T17:00",
    endDatetime: "2022-05-20T18:30",
  },
  {
    id: 4,
    name: "Leslie Alexander",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    startDatetime: "2022-06-09T13:00",
    endDatetime: "2022-06-09T14:30",
  },
  {
    id: 5,
    name: "Michael Foster",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    startDatetime: "2022-05-13T14:00",
    endDatetime: "2022-05-13T14:30",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const today = startOfToday();
const selectedDay = ref(today);
const currentMonth = ref(format(today, "MMM-yyyy"));
const firstDayCurrentMonth = computed(() =>
  parse(currentMonth.value, "MMM-yyyy", new Date())
);

const days = computed(() =>
  eachDayOfInterval({
    start: firstDayCurrentMonth.value,
    end: endOfMonth(firstDayCurrentMonth.value),
  })
);

// Helper function to determine if a date is past or today
function isPastOrToday(day) {
  return isBefore(day, today);
}

function previousMonth() {
  const firstDayNextMonth = add(firstDayCurrentMonth.value, { months: -1 });
  currentMonth.value = format(firstDayNextMonth, "MMM-yyyy");
}

function nextMonth() {
  const firstDayNextMonth = add(firstDayCurrentMonth.value, { months: 1 });
  currentMonth.value = format(firstDayNextMonth, "MMM-yyyy");
}

const selectedDayMeetings = computed(() =>
  meetings.filter((meeting) =>
    isSameDay(parseISO(meeting.startDatetime), selectedDay.value)
  )
);

function setSelectedDay(day) {
  selectedDay.value = day;

  const formatter = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const formattedDate = formatter.format(selectedDay.value); // Format as "2025-01-02"

  emit("change", formattedDate);
  console.log("====================================");
  console.log(formattedDate);
  console.log("====================================");
}

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];
</script>

<style scoped>
/* Add any additional CSS here */
</style>
