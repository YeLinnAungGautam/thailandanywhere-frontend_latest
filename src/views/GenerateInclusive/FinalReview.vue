<template>
  <div class="mx-auto space-y-6 text-sm select-none">
    <!-- Hotel cross-day warning toast -->
    <Transition name="toast">
      <div
        v-if="showHotelWarning"
        class="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] bg-amber-500 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-semibold"
      >
        <span class="text-lg">🏨</span>
        Hotels cannot be moved to a different day — only reordered within the
        same day.
        <button
          @click="showHotelWarning = false"
          class="ml-2 text-white/80 hover:text-white text-xl leading-none"
        >
          ×
        </button>
      </div>
    </Transition>

    <!-- Drag hint -->
    <div
      class="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 rounded-xl px-4 py-2 border border-slate-200"
    >
      <span>⠿</span>
      <span
        >Drag to reorder. Van tours &amp; attractions can move between days.
        Hotels can only be reordered within the same day.</span
      >
    </div>

    <div class="bg-white rounded-lg border-2 border-slate-200 overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="bg-[#FF613c] text-white">
            <th
              class="px-3 py-3 text-left font-semibold border-r border-slate-300 w-6"
            ></th>
            <th
              class="px-4 py-3 text-left font-semibold border-r border-slate-300"
            >
              SERVICE
            </th>
            <th
              class="px-4 py-3 text-left font-semibold border-r border-slate-300"
            >
              DESCRIPTION
            </th>
            <th
              class="px-4 py-3 text-center font-semibold border-r border-slate-300 w-32"
            >
              SELLING
            </th>
            <th
              class="px-4 py-3 text-center font-semibold border-r border-slate-300 w-20"
            >
              QTY
            </th>
            <th
              class="px-4 py-3 text-center font-semibold border-r border-slate-300 w-32"
            >
              TOTAL SELL
            </th>
            <th
              class="px-4 py-3 text-center font-semibold border-r border-slate-300 w-32"
            >
              COST
            </th>
            <th class="px-4 py-3 text-center font-semibold w-32">TOTAL COST</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="day in totalDays" :key="`day-${day}`">
            <!-- Day header — drop zone for non-hotel items -->
            <tr
              class="border-t-2 border-slate-300 transition"
              :class="
                dropTargetDay === day &&
                dragging &&
                draggingItem?._type !== 'hotel'
                  ? 'bg-blue-50'
                  : 'bg-slate-50'
              "
              @dragover.prevent="onDragOverDay(day)"
              @dragleave="onDragLeaveDay"
              @drop.prevent="onDropToDay(day)"
            >
              <td colspan="8" class="px-4 py-2">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-black">
                    Day {{ day }} : {{ formatTableDate(getDayDateRaw(day)) }}
                  </span>
                  <span class="text-black font-semibold"
                    >({{ getDayCitiesLabel(day) }})</span
                  >
                  <span
                    v-if="
                      dropTargetDay === day &&
                      dragging &&
                      draggingItem?._type !== 'hotel'
                    "
                    class="ml-auto text-xs text-blue-600 font-semibold animate-pulse"
                  >
                    ↓ Move to Day {{ day }}
                  </span>
                </div>
              </td>
            </tr>

            <!-- Items -->
            <template
              v-for="(item, itemIdx) in getDayItems(day)"
              :key="item._uid"
            >
              <!-- Drop line before item -->
              <tr
                v-if="
                  dragging &&
                  dropTargetDay === day &&
                  dropTargetIndex === itemIdx
                "
                class="pointer-events-none"
              >
                <td colspan="8" class="h-0.5 p-0 bg-blue-400" />
              </tr>

              <tr
                :draggable="true"
                @dragstart="onDragStart($event, item, day, itemIdx)"
                @dragend="onDragEnd"
                @dragover.prevent="onDragOverItem($event, day, itemIdx)"
                @drop.prevent="onDropToItem(day, itemIdx)"
                class="border-b border-slate-100 transition"
                :class="[
                  draggingItem?._uid === item._uid
                    ? 'opacity-40 bg-blue-50'
                    : 'hover:bg-slate-50',
                  item._type === 'hotel'
                    ? 'cursor-ns-resize'
                    : 'cursor-grab active:cursor-grabbing',
                ]"
              >
                <!-- Handle -->
                <td class="px-2 py-2 border-r border-slate-200 text-center">
                  <span
                    :class="
                      item._type === 'hotel'
                        ? 'text-amber-300'
                        : 'text-slate-300'
                    "
                    class="text-lg leading-none select-none"
                    :title="
                      item._type === 'hotel'
                        ? 'Hotels can only be reordered within the same day'
                        : 'Drag to move'
                    "
                    >⠿</span
                  >
                </td>

                <!-- Van Tour -->
                <template v-if="item._type === 'van'">
                  <td class="px-4 py-2 border-r border-slate-200">
                    <span class="font-medium text-green-700">Van Tour</span>
                  </td>
                  <td class="px-4 py-2 border-r border-slate-200">
                    <div class="font-medium">{{ item.vanTourName }}</div>
                    <div class="text-xs text-slate-500">
                      {{ item.carName }} · {{ item.city }}
                    </div>
                  </td>
                  <td
                    class="px-4 py-2 text-right border-r border-slate-200 font-semibold"
                  >
                    {{
                      (
                        (item.sellingPrice ?? 0) / (item.cars || 1)
                      ).toLocaleString()
                    }}
                    ฿
                  </td>
                  <td class="px-4 py-2 text-center border-r border-slate-200">
                    {{ item.cars }}
                  </td>
                  <td
                    class="px-4 py-2 text-right border-r border-slate-200 font-bold text-green-700"
                  >
                    {{ (item.sellingPrice ?? 0).toLocaleString() }} ฿
                  </td>
                  <td
                    class="px-4 py-2 text-right border-r border-slate-200 text-slate-500"
                  >
                    {{
                      (
                        (item.costPrice ?? 0) / (item.cars || 1)
                      ).toLocaleString()
                    }}
                    ฿
                  </td>
                  <td class="px-4 py-2 text-right text-slate-500">
                    {{ (item.costPrice ?? 0).toLocaleString() }} ฿
                  </td>
                </template>

                <!-- Attraction -->
                <template v-else-if="item._type === 'attraction'">
                  <td class="px-4 py-2 border-r border-slate-200">
                    <span class="font-medium text-orange-700">Attraction</span>
                  </td>
                  <td class="px-4 py-2 border-r border-slate-200">
                    <div class="font-medium">{{ item.name }}</div>
                    <div class="text-xs text-slate-500">
                      {{ item.adults }}A<template v-if="item.children > 0">
                        + {{ item.children }}C</template
                      >
                      · {{ item.city }}
                    </div>
                  </td>
                  <td class="px-4 py-2 text-right border-r border-slate-200">
                    <div
                      v-if="item.productType === 'entrance_ticket'"
                      class="text-xs text-right space-y-0.5"
                    >
                      <div>A: ฿{{ item.adultPrice?.toLocaleString() }}</div>
                      <div v-if="item.children > 0">
                        C: ฿{{
                          item.childCostPrice != "null"
                            ? item.childPrice?.toLocaleString()
                            : "---"
                        }}
                      </div>
                    </div>
                    <div v-else>
                      ฿{{ item.unitSellingPrice?.toLocaleString() }}/pax
                    </div>
                  </td>
                  <td class="px-4 py-2 text-center border-r border-slate-200">
                    {{ item.adults + item.children }}
                  </td>
                  <td
                    class="px-4 py-2 text-right border-r border-slate-200 font-bold text-orange-700"
                  >
                    {{ (item.sellingPrice ?? 0).toLocaleString() }} ฿
                  </td>
                  <td
                    class="px-4 py-2 text-right border-r border-slate-200 text-slate-500 text-xs"
                  >
                    <div>A: ฿{{ item.adultCostPrice?.toLocaleString() }}</div>
                    <div v-if="item.children > 0">
                      C: ฿{{
                        item.childCostPrice == "null"
                          ? "---"
                          : item.childCostPrice?.toLocaleString()
                      }}
                    </div>
                  </td>
                  <td class="px-4 py-2 text-right text-slate-500">
                    {{ (item.costPrice ?? 0).toLocaleString() }} ฿
                  </td>
                </template>

                <!-- Hotel -->
                <template v-else-if="item._type === 'hotel'">
                  <td class="px-4 py-2 border-r border-slate-200">
                    <div class="flex items-center gap-1.5">
                      <span class="font-medium text-purple-700">Hotel</span>
                      <span
                        class="text-[10px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded font-medium"
                        >order</span
                      >
                    </div>
                  </td>
                  <td class="px-4 py-2 border-r border-slate-200">
                    <div class="font-medium">{{ item.name }}</div>
                    <div class="text-xs text-slate-500">
                      {{ item.roomName }} · {{ item.nights }} night{{
                        item.nights > 1 ? "s" : ""
                      }}
                      · {{ item.rooms ?? 1 }} room{{
                        (item.rooms ?? 1) > 1 ? "s" : ""
                      }}
                    </div>
                  </td>
                  <td
                    class="px-4 py-2 text-right border-r border-slate-200 font-semibold"
                  >
                    {{ (item.sellingPrice ?? 0).toLocaleString() }} ฿
                  </td>
                  <td class="px-4 py-2 text-center border-r border-slate-200">
                    {{ item.nights }}
                  </td>
                  <td
                    class="px-4 py-2 text-right border-r border-slate-200 font-bold text-purple-700"
                  >
                    {{ (item.sellingPrice ?? 0).toLocaleString() }} ฿
                  </td>
                  <td
                    class="px-4 py-2 text-right border-r border-slate-200 text-slate-500"
                  >
                    {{ (item.costPrice ?? 0).toLocaleString() }} ฿
                  </td>
                  <td class="px-4 py-2 text-right text-slate-500">
                    {{ (item.costPrice ?? 0).toLocaleString() }} ฿
                  </td>
                </template>
              </tr>
            </template>

            <!-- Drop line at end of day -->
            <tr
              v-if="
                dragging &&
                dropTargetDay === day &&
                dropTargetIndex >= getDayItems(day).length &&
                draggingItem?._type !== 'hotel'
              "
              class="pointer-events-none"
            >
              <td colspan="8" class="h-0.5 p-0 bg-blue-400" />
            </tr>

            <!-- Empty day placeholder -->
            <tr
              v-if="getDayItems(day).length === 0"
              @dragover.prevent="onDragOverDay(day)"
              @dragleave="onDragLeaveDay"
              @drop.prevent="onDropToDay(day)"
            >
              <td
                colspan="8"
                class="px-4 py-3 text-center italic text-xs transition"
                :class="
                  dropTargetDay === day &&
                  dragging &&
                  draggingItem?._type !== 'hotel'
                    ? 'bg-blue-50 text-blue-400'
                    : 'text-slate-400'
                "
              >
                {{
                  dropTargetDay === day &&
                  dragging &&
                  draggingItem?._type !== "hotel"
                    ? "↓ Drop here"
                    : "No services for this day"
                }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <!-- Totals -->
      <div class="bg-white px-6 py-4 border-t-2 border-slate-300">
        <div class="flex justify-end">
          <div class="text-right space-y-2">
            <div class="flex items-center justify-end gap-4">
              <span class="font-medium">Total Selling =</span>
              <span
                class="inline-block border-2 border-slate-800 px-4 py-1 font-bold min-w-[140px] text-right text-orange-600"
              >
                {{ grandTotalSelling.toLocaleString() }} THB
              </span>
              <div
                @click="percent = 10"
                class="bg-orange-100 text-orange-600 py-1 px-4 border-2 border-orange-800"
              >
                10%
              </div>
              <div
                @click="percent = 20"
                class="bg-orange-100 text-orange-600 py-1 px-4 border-2 border-orange-800"
              >
                20%
              </div>
              <div
                @click="percent = 30"
                class="bg-orange-100 text-orange-600 py-1 px-4 border-2 border-orange-800"
              >
                30%
              </div>
              <input
                type="number"
                v-model="percent"
                name=""
                id=""
                class="border-2 border-slate-800 py-1 px-4 w-20"
              />
              % =
              <span
                class="inline-block border-2 border-slate-800 px-4 py-1 font-bold min-w-[140px] text-right text-orange-600"
              >
                {{ (grandTotalSelling / (1 - percent / 100)).toFixed(0) }} THB
              </span>
            </div>
            <div class="flex items-center justify-end gap-4">
              <span class="font-medium">Total Cost =</span>
              <span
                class="inline-block border-2 border-slate-800 px-4 py-1 font-bold min-w-[140px] text-right text-slate-600"
              >
                {{ grandTotalCost.toLocaleString() }} THB
              </span>
            </div>
            <div class="flex items-center justify-end gap-4">
              <span class="font-medium">Gross Profit =</span>
              <span
                class="inline-block border-2 border-green-600 px-4 py-1 font-bold min-w-[140px] text-right text-green-700"
              >
                {{
                  (
                    grandTotalSelling / (1 - percent / 100) -
                    grandTotalCost
                  ).toFixed(0)
                }}
                THB
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex justify-end items-center gap-3">
      <Transition name="fade">
        <span v-if="copied" class="text-green-600 font-semibold text-sm"
          >✓ Copied!</span
        >
      </Transition>
      <button
        @click="copyToClipboard"
        class="px-8 py-3 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-800 transition"
      >
        📋 Copy Text
      </button>
      <!-- <button
        @click="$emit('finalize')"
        class="px-10 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 shadow-lg transition"
      >
        ✓ Finalize Package
      </button> -->
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  totalDays: Number,
  startDate: String,
  dayCityMap: Object,
  orderedItems: { type: Array, default: () => [] },
});

const emit = defineEmits(["finalize", "update:orderedItems"]);

const copied = ref(false);
const showHotelWarning = ref(false);
let warningTimer = null;

// ─── Local working copy — synced FROM parent only when parent adds new items ───
const items = ref(props.orderedItems.map((i) => ({ ...i })));

watch(
  () => props.orderedItems,
  (newVal) => {
    // Sync only when a new item was added from another tab (length change)
    // Never overwrite if parent is just echoing back our own emit
    if (newVal.length !== items.value.length) {
      // Preserve _order for items we already know, append new ones
      const existingUids = new Set(items.value.map((i) => i._uid));
      const merged = items.value.map((i) => ({ ...i }));
      newVal.forEach((item) => {
        if (!existingUids.has(item._uid)) {
          merged.push({ ...item });
        }
      });
      // Remove items deleted from other tabs
      const newUids = new Set(newVal.map((i) => i._uid));
      items.value = merged.filter((i) => newUids.has(i._uid));
    }
  },
  { deep: false },
);

const pushUpdate = () => {
  emit(
    "update:orderedItems",
    items.value.map((i) => ({ ...i })),
  );
};

// ─── Day filtering ───
const getDayItems = (day) =>
  items.value
    .filter((item) => {
      if (item._type === "hotel")
        return (item.checkInDay ?? getDayFromDate(item.checkIn)) === day;
      return item.dayNumber === day;
    })
    .sort((a, b) => a._order - b._order);

const getDayFromDate = (dateStr) => {
  if (!props.startDate || !dateStr) return 1;
  const start = new Date(props.startDate);
  const d = new Date(dateStr);
  return Math.floor((d - start) / (1000 * 60 * 60 * 24)) + 1;
};

// ─── Drag state ───
const dragging = ref(false);
const draggingItem = ref(null);
const draggingFromDay = ref(null);
const dropTargetDay = ref(null);
const dropTargetIndex = ref(null);

const onDragStart = (event, item, day) => {
  dragging.value = true;
  draggingItem.value = item;
  draggingFromDay.value = day;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", item._uid);
};

const onDragEnd = () => {
  dragging.value = false;
  draggingItem.value = null;
  draggingFromDay.value = null;
  dropTargetDay.value = null;
  dropTargetIndex.value = null;
};

const onDragOverDay = (day) => {
  if (draggingItem.value?._type === "hotel" && day !== draggingFromDay.value)
    return;
  dropTargetDay.value = day;
  if (dropTargetIndex.value === null)
    dropTargetIndex.value = getDayItems(day).length;
};

const onDragLeaveDay = () => {};

const onDragOverItem = (event, day, idx) => {
  if (draggingItem.value?._type === "hotel" && day !== draggingFromDay.value)
    return;
  dropTargetDay.value = day;
  const rect = event.currentTarget.getBoundingClientRect();
  dropTargetIndex.value =
    event.clientY < rect.top + rect.height / 2 ? idx : idx + 1;
};

const onDropToDay = (day) => {
  if (!draggingItem.value) return;
  if (draggingItem.value._type === "hotel" && day !== draggingFromDay.value) {
    fireHotelWarning();
    onDragEnd();
    return;
  }
  moveItem(day, getDayItems(day).length);
};

const onDropToItem = (day, idx) => {
  if (!draggingItem.value) return;
  if (draggingItem.value._type === "hotel" && day !== draggingFromDay.value) {
    fireHotelWarning();
    onDragEnd();
    return;
  }
  moveItem(day, dropTargetIndex.value ?? idx);
};

const fireHotelWarning = () => {
  showHotelWarning.value = true;
  clearTimeout(warningTimer);
  warningTimer = setTimeout(() => {
    showHotelWarning.value = false;
  }, 4000);
};

const moveItem = (toDay, toIndex) => {
  const uid = draggingItem.value?._uid;
  const fromDay = draggingFromDay.value;
  if (!uid) return;

  const itemInList = items.value.find((i) => i._uid === uid);
  if (!itemInList) return;

  // Update day for non-hotel items
  if (itemInList._type !== "hotel") {
    itemInList.dayNumber = toDay;
    itemInList.serviceDate = getDayDateRaw(toDay);
    itemInList.dayLabel = getDayDateShort(toDay);
  }

  // Re-order within toDay
  const targetItems = getDayItems(toDay).filter((i) => i._uid !== uid);
  const clampedIdx = Math.min(toIndex, targetItems.length);
  targetItems.splice(clampedIdx, 0, itemInList);
  targetItems.forEach((i, idx) => {
    i._order = idx;
  });

  // Re-order fromDay if different
  if (fromDay !== toDay) {
    getDayItems(fromDay).forEach((i, idx) => {
      i._order = idx;
    });
  }

  onDragEnd();
  pushUpdate();
};

// ─── Date helpers ───
const getDayDateRaw = (dayNumber) => {
  if (!props.startDate || !dayNumber) return "";
  const d = new Date(props.startDate);
  d.setDate(d.getDate() + dayNumber - 1);
  return d.toISOString().split("T")[0];
};

const getDayDateShort = (dayNumber) => {
  if (!props.startDate || !dayNumber) return "";
  const d = new Date(props.startDate);
  d.setDate(d.getDate() + dayNumber - 1);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const formatTableDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getDate()}-${d.toLocaleDateString("en-US", {
    month: "short",
  })}-${d.getFullYear()}`;
};

const getDayCitiesLabel = (day) => {
  const cities = props.dayCityMap[day];
  if (!cities?.length) return "";
  return cities.map((c) => c.name).join(" → ");
};

// ─── Totals ───
const grandTotalSelling = computed(() =>
  items.value.reduce((s, i) => s + (i.sellingPrice ?? 0), 0),
);
const grandTotalCost = computed(() =>
  items.value.reduce((s, i) => s + (i.costPrice ?? 0), 0),
);

// ─── Copy ───
const copyToClipboard = async () => {
  const lines = [];
  for (let day = 1; day <= props.totalDays; day++) {
    lines.push(
      `Day ${day} — ${formatTableDate(getDayDateRaw(day))}  ${getDayCitiesLabel(
        day,
      )}`,
    );
    lines.push("─".repeat(55));
    const dayItems = getDayItems(day);
    dayItems.forEach((item) => {
      if (item._type === "van") {
        lines.push(`  🚐 Van Tour  ${item.vanTourName} (${item.carName})`);
        lines.push(`     City: ${item.city}  |  Cars: ${item.cars}`);
        lines.push(
          `     Selling: ฿${(
            item.sellingPrice ?? 0
          ).toLocaleString()}  |  Cost: ฿${(
            item.costPrice ?? 0
          ).toLocaleString()}`,
        );
      } else if (item._type === "attraction") {
        lines.push(`  🎫 Attraction  ${item.name}`);
        lines.push(
          `     Adults: ${item.adults}  |  Children: ${item.children}  |  City: ${item.city}`,
        );
        lines.push(
          `     Selling: ฿${(
            item.sellingPrice ?? 0
          ).toLocaleString()}  |  Cost: ฿${(
            item.costPrice ?? 0
          ).toLocaleString()}`,
        );
      } else if (item._type === "hotel") {
        lines.push(`  🏨 Hotel  ${item.name}`);
        lines.push(
          `     Room: ${item.roomName}  |  ${item.nights} night${
            item.nights > 1 ? "s" : ""
          }  |  ${item.rooms ?? 1} room${(item.rooms ?? 1) > 1 ? "s" : ""}`,
        );
        lines.push(
          `     Check-in: ${item.checkIn}  →  Check-out: ${item.checkOut}`,
        );
        lines.push(
          `     Selling: ฿${(
            item.sellingPrice ?? 0
          ).toLocaleString()}  |  Cost: ฿${(
            item.costPrice ?? 0
          ).toLocaleString()}`,
        );
      }
    });
    if (!dayItems.length) lines.push("  (No services)");
    lines.push("");
  }
  lines.push("═".repeat(55));
  lines.push(`Total Selling  : ฿${grandTotalSelling.value.toLocaleString()}`);
  lines.push(`Total Cost     : ฿${grandTotalCost.value.toLocaleString()}`);
  lines.push(
    `Gross Profit   : ฿${(
      grandTotalSelling.value - grandTotalCost.value
    ).toLocaleString()}`,
  );
  try {
    await navigator.clipboard.writeText(lines.join("\n"));
  } catch {
    const ta = document.createElement("textarea");
    ta.value = lines.join("\n");
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2500);
};

const percent = ref(0);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.toast-enter-active {
  transition: all 0.3s ease;
}
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-16px);
}
tr[draggable="true"] {
  user-select: none;
}
</style>
