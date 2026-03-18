<!-- ItemSummaryTable.vue -->
<template>
  <div class="text-sm">
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
              class="px-4 py-3 text-center font-semibold border-r border-slate-300 w-20"
            >
              QTY
            </th>
            <th class="px-4 py-3 text-center font-semibold w-36">AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(group, date) in groupedByDate" :key="date">
            <!-- Date header -->
            <tr class="bg-slate-50 border-t-2 border-slate-300">
              <td colspan="5" class="px-4 py-2">
                <span class="font-bold text-black">
                  📅 {{ formatDate(date) }}
                </span>
              </td>
            </tr>

            <!-- Items -->
            <template v-for="(item, idx) in group" :key="item._uid">
              <!-- Drop indicator line -->
              <tr
                v-if="dragging && dropKey === date && dropIndex === idx"
                class="pointer-events-none"
              >
                <td colspan="5" class="h-0.5 p-0 bg-[#ff613c]" />
              </tr>

              <tr
                draggable="true"
                @dragstart="onDragStart($event, date, idx)"
                @dragend="onDragEnd"
                @dragover.prevent="onDragOver($event, date, idx)"
                @drop.prevent="onDrop(date, idx)"
                class="border-b border-slate-100 transition cursor-grab active:cursor-grabbing"
                :class="
                  draggingKey === date && draggingIndex === idx
                    ? 'opacity-40 bg-blue-50'
                    : 'hover:bg-slate-50'
                "
              >
                <!-- Drag handle -->
                <td class="px-2 py-2 border-r border-slate-200 text-center">
                  <span class="text-slate-300 text-lg leading-none select-none"
                    >⠿</span
                  >
                </td>

                <!-- SERVICE label -->
                <td class="px-4 py-2 border-r border-slate-200 align-top">
                  <span
                    class="font-medium text-xs px-2 py-0.5 rounded-full"
                    :class="serviceClass(item._type)"
                  >
                    {{ serviceLabel(item._type) }}
                  </span>
                </td>

                <!-- DESCRIPTION -->
                <td class="px-4 py-2 border-r border-slate-200">
                  <template v-if="item._type === 'van'">
                    <div class="font-medium">{{ item.vanTourName }}</div>
                    <div class="text-xs text-slate-400">{{ item.carName }}</div>
                  </template>
                  <template v-else-if="item._type === 'attraction'">
                    <div class="font-medium">{{ item.name }}</div>
                    <div class="text-xs text-slate-400">
                      {{ item.item_name }}
                      <span v-if="item.children > 0"
                        >· {{ item.adults }}A + {{ item.children }}C</span
                      >
                      <span v-else>· {{ item.adults }} pax</span>
                    </div>
                  </template>
                  <template v-else-if="item._type === 'hotel'">
                    <div class="font-medium">{{ item.name }}</div>
                    <div class="text-xs text-slate-400">
                      {{ item.roomName }} · {{ item.nights }} night{{
                        item.nights > 1 ? "s" : ""
                      }}
                      · {{ item.rooms ?? 1 }} room{{
                        (item.rooms ?? 1) > 1 ? "s" : ""
                      }}
                    </div>
                    <div class="text-xs text-slate-400">
                      {{ item.checkIn }} → {{ item.checkOut }}
                    </div>
                  </template>
                </td>

                <!-- QTY -->
                <td
                  class="px-4 py-2 text-center border-r border-slate-200 align-top"
                >
                  <template v-if="item._type === 'van'">{{
                    item.cars
                  }}</template>
                  <template v-else-if="item._type === 'hotel'">{{
                    item.nights
                  }}</template>
                  <template v-else>{{
                    item.adults * 1 + item.children * 1
                  }}</template>
                </td>

                <!-- AMOUNT: sell stacked over cost -->
                <td class="px-4 py-2 text-right align-top">
                  <div class="font-bold text-orange-600 text-sm">
                    {{ Number(item.sellingPrice || 0).toLocaleString() }} ฿
                  </div>
                  <div
                    class="text-xs text-slate-400 mt-0.5 border-t border-slate-200 pt-0.5"
                  >
                    {{ Number(item.costPrice || 0).toLocaleString() }} ฿
                  </div>
                </td>
              </tr>
            </template>

            <!-- Drop indicator at end of day -->
            <tr
              v-if="dragging && dropKey === date && dropIndex >= group.length"
              class="pointer-events-none"
            >
              <td colspan="5" class="h-0.5 p-0 bg-[#ff613c]" />
            </tr>

            <!-- Empty drop zone at end of each day's list -->
            <tr
              @dragover.prevent="onDragOverEnd(date)"
              @drop.prevent="onDropEnd(date)"
              class="h-2"
            >
              <td colspan="5" />
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  items: { type: Array, default: () => [] },
});

const emit = defineEmits(["update:items"]);

// ── Map raw itemList → table shape ──
const mappedItems = ref(
  props.items
    .filter((i) => i?.product_type !== undefined)
    .map((i, idx) => {
      const type =
        String(i.product_type) === "1"
          ? "van"
          : String(i.product_type) === "6"
          ? "hotel"
          : "attraction";

      const base = {
        _uid: `item-${idx}`,
        _type: type,
        _order: idx,
        serviceDate: i.service_date || i.checkin_date || "No Date",
        sellingPrice: Number(i.total_amount) || 0,
        costPrice: Number(i.total_cost_price) || 0,
        item_name: i.item_name ?? "",
      };

      if (type === "van")
        return {
          ...base,
          vanTourName: i.product_name,
          carName: i.item_name,
          cars: i.quantity ?? 1,
        };

      if (type === "hotel")
        return {
          ...base,
          name: i.product_name,
          roomName: i.item_name,
          nights: i.days ?? 1,
          rooms: i.quantity ?? 1,
          checkIn: i.checkin_date ?? i.service_date ?? "",
          checkOut: i.checkout_date ?? "",
        };

      return {
        ...base,
        name: i.product_name,
        adults: i.quantity ?? 1,
        children: i.individual_pricing?.child?.quantity ?? 0,
        productType: "entrance_ticket",
      };
    }),
);

// ── Group by date, sorted ascending ──
const groupedByDate = computed(() => {
  const groups = {};
  mappedItems.value.forEach((item) => {
    const key = item.serviceDate || "No Date";
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  return Object.fromEntries(
    Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)),
  );
});

// ── Drag state ──
const dragging = ref(false);
const draggingKey = ref(null); // date string of dragged item
const draggingIndex = ref(null); // index within that date group
const dropKey = ref(null);
const dropIndex = ref(null);

const onDragStart = (event, date, idx) => {
  dragging.value = true;
  draggingKey.value = date;
  draggingIndex.value = idx;
  event.dataTransfer.effectAllowed = "move";
};

const onDragEnd = () => {
  dragging.value = false;
  draggingKey.value = null;
  draggingIndex.value = null;
  dropKey.value = null;
  dropIndex.value = null;
};

const onDragOver = (event, date, idx) => {
  // Block cross-day drag
  if (draggingKey.value !== date) {
    event.dataTransfer.dropEffect = "none";
    return;
  }
  dropKey.value = date;
  const rect = event.currentTarget.getBoundingClientRect();
  dropIndex.value = event.clientY < rect.top + rect.height / 2 ? idx : idx + 1;
};

const onDragOverEnd = (date) => {
  if (draggingKey.value !== date) return;
  dropKey.value = date;
  dropIndex.value = groupedByDate.value[date]?.length ?? 0;
};

const onDrop = (date) => {
  if (draggingKey.value !== date) {
    onDragEnd();
    return;
  }
  reorder(date);
};

const onDropEnd = (date) => {
  if (draggingKey.value !== date) {
    onDragEnd();
    return;
  }
  reorder(date);
};

const reorder = (date) => {
  const fromIdx = draggingIndex.value;
  let toIdx = dropIndex.value ?? 0;
  if (fromIdx === null || fromIdx === toIdx || fromIdx === toIdx - 1) {
    onDragEnd();
    return;
  }

  // Work on a flat copy, isolate the date group
  const all = [...mappedItems.value];
  const group = all.filter((i) => i.serviceDate === date);
  const others = all.filter((i) => i.serviceDate !== date);

  // Move within group
  const [moved] = group.splice(fromIdx, 1);
  if (toIdx > fromIdx) toIdx--;
  group.splice(toIdx, 0, moved);

  // Rebuild _order
  group.forEach((item, i) => {
    item._order = i;
  });

  // Merge back — keep original date ordering for other groups
  mappedItems.value = [
    ...others.filter((i) => {
      const d = i.serviceDate;
      return Object.keys(groupedByDate.value).indexOf(d);
      Object.keys(groupedByDate.value).indexOf(date);
    }),
    ...group,
    ...others.filter((i) => {
      const d = i.serviceDate;
      return (
        Object.keys(groupedByDate.value).indexOf(d) >
        Object.keys(groupedByDate.value).indexOf(date)
      );
    }),
  ];

  emit("update:items", mappedItems.value);
  onDragEnd();
};

// ── Helpers ──
const formatDate = (dateStr) => {
  if (!dateStr || dateStr === "No Date") return "No Date";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const serviceLabel = (type) =>
  ({
    van: "🚐 Van Tour",
    hotel: "🏨 Hotel",
    attraction: "🎫 Attraction",
  }[type] ?? type);

const serviceClass = (type) =>
  ({
    van: "bg-green-100 text-green-700",
    hotel: "bg-purple-100 text-purple-700",
    attraction: "bg-amber-100 text-amber-700",
  }[type] ?? "bg-gray-100 text-gray-600");
</script>
