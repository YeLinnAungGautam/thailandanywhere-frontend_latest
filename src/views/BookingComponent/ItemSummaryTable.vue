<!-- ItemSummaryTable.vue -->
<template>
  <div class="text-sm select-none">
    <div class="bg-white rounded-lg border-2 border-slate-200 overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="bg-[#FF613c] text-white">
            <!-- Drag handle col -->
            <th
              class="px-3 py-3 text-left font-semibold border-r border-white/20 w-8"
            ></th>
            <!-- Service -->
            <th
              class="px-4 py-3 text-left font-semibold border-r border-white/20 w-28"
            >
              SERVICE
            </th>
            <!-- Description -->
            <th
              class="px-4 py-3 text-left font-semibold border-r border-white/20"
            >
              DESCRIPTION
            </th>
            <!-- QTY -->
            <th
              class="px-4 py-3 text-center font-semibold border-r border-white/20 w-16"
            >
              QTY
            </th>
            <!-- COST -->
            <th
              class="px-4 py-3 text-right font-semibold border-r border-white/20 w-36"
            >
              COST
            </th>
            <!-- SELLING -->
            <th class="px-4 py-3 text-right font-semibold w-36">SELLING</th>
          </tr>
        </thead>

        <tbody>
          <template v-for="(group, date) in groupedByDate" :key="date">
            <!-- Date header row -->
            <tr class="bg-slate-50 border-t-2 border-slate-300">
              <td colspan="6" class="px-4 py-2">
                <span class="font-bold text-black text-xs">
                  📅 {{ formatDate(date) }}
                </span>
              </td>
            </tr>

            <!-- Items for this date -->
            <template v-for="(item, idx) in group" :key="item._uid">
              <!-- Drop indicator line (before item) -->
              <tr
                v-if="dragging && dropKey === date && dropIndex === idx"
                class="pointer-events-none"
              >
                <td colspan="6" class="h-0.5 p-0 bg-[#ff613c]" />
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
                <td class="px-2 py-3 border-r border-slate-200 text-center">
                  <span class="text-slate-300 text-lg leading-none select-none"
                    >⠿</span
                  >
                </td>

                <!-- SERVICE badge -->
                <td class="px-4 py-3 border-r border-slate-200 align-top">
                  <span
                    class="font-medium text-xs px-2 py-0.5 rounded-full"
                    :class="serviceClass(item._type)"
                  >
                    {{ serviceLabel(item._type) }}
                  </span>
                </td>

                <!-- DESCRIPTION -->
                <td class="px-4 py-3 border-r border-slate-200 align-top">
                  <template v-if="item._type === 'van'">
                    <div class="font-medium">{{ item.vanTourName }}</div>
                    <div class="text-xs text-slate-400">{{ item.carName }}</div>
                  </template>
                  <template v-else-if="item._type === 'attraction'">
                    <div class="font-medium">{{ item.name }}</div>
                    <div class="text-xs text-slate-400">
                      <span v-if="item.children > 0"
                        >{{ item.adults }}A + {{ item.children }}C</span
                      >
                      <span v-else>{{ item.adults }} pax</span>
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
                  class="px-4 py-3 text-center border-r border-slate-200 align-top font-medium"
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

                <!-- COST column: total on top, unit below -->
                <td
                  class="px-4 py-3 border-r border-slate-200 align-top text-right"
                >
                  <div class="font-medium text-slate-600 text-sm">
                    {{ Number(item.costPrice || 0).toLocaleString() }} ฿
                  </div>
                  <div
                    class="text-xs text-slate-400 mt-1 pt-1 border-t border-slate-200"
                  >
                    {{ unitCost(item).toLocaleString() }} ฿ /
                    {{ unitLabel(item) }}
                  </div>
                </td>

                <!-- SELLING column: total on top, unit below -->
                <td class="px-4 py-3 align-top text-right">
                  <div class="font-bold text-orange-600 text-sm">
                    {{ Number(item.sellingPrice || 0).toLocaleString() }} ฿
                  </div>
                  <div
                    class="text-xs text-slate-400 mt-1 pt-1 border-t border-slate-200"
                  >
                    {{ unitSell(item).toLocaleString() }} ฿ /
                    {{ unitLabel(item) }}
                  </div>
                </td>
              </tr>
            </template>

            <!-- Drop indicator at end of group -->
            <tr
              v-if="dragging && dropKey === date && dropIndex >= group.length"
              class="pointer-events-none"
            >
              <td colspan="6" class="h-0.5 p-0 bg-[#ff613c]" />
            </tr>

            <!-- Empty drop zone at bottom of each date group -->
            <tr
              @dragover.prevent="onDragOverEnd(date)"
              @drop.prevent="onDropEnd(date)"
              class="h-2"
            >
              <td colspan="6" />
            </tr>
          </template>
        </tbody>
      </table>

      <!-- ── Totals Footer ── -->
      <div class="bg-slate-50 border-t-2 border-slate-300 px-6 py-4">
        <div class="flex justify-end gap-6">
          <!-- Total Cost -->
          <div class="text-right">
            <div class="text-xs text-slate-400 mb-0.5">Total Cost</div>
            <div class="font-semibold text-slate-600 text-base">
              {{ grandTotalCost.toLocaleString() }} ฿
            </div>
          </div>

          <div class="w-px bg-slate-300 self-stretch"></div>

          <!-- Total Selling -->
          <div class="text-right">
            <div class="text-xs text-slate-400 mb-0.5">Total Selling</div>
            <div class="font-bold text-orange-600 text-base">
              {{ grandTotalSelling.toLocaleString() }} ฿
            </div>
          </div>
        </div>
      </div>
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

// ── Grand totals ──
const grandTotalSelling = computed(() =>
  mappedItems.value.reduce((s, i) => s + Number(i.sellingPrice || 0), 0),
);
const grandTotalCost = computed(() =>
  mappedItems.value.reduce((s, i) => s + Number(i.costPrice || 0), 0),
);

// ── Unit helpers ──
const qtyOf = (item) => {
  if (item._type === "van") return item.cars || 1;
  if (item._type === "hotel") return item.nights || 1;
  return (item.adults || 0) * 1 + (item.children || 0) * 1 || 1;
};

const unitLabel = (item) => {
  if (item._type === "van") return "car";
  if (item._type === "hotel") return "night";
  return "pax";
};

const unitCost = (item) => {
  const q = qtyOf(item);
  return Math.round(Number(item.costPrice || 0) / q);
};

const unitSell = (item) => {
  const q = qtyOf(item);
  return Math.round(Number(item.sellingPrice || 0) / q);
};

// ── Drag state ──
const dragging = ref(false);
const draggingKey = ref(null);
const draggingIndex = ref(null);
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

  const all = [...mappedItems.value];
  const group = all.filter((i) => i.serviceDate === date);
  const others = all.filter((i) => i.serviceDate !== date);

  const [moved] = group.splice(fromIdx, 1);
  if (toIdx > fromIdx) toIdx--;
  group.splice(toIdx, 0, moved);
  group.forEach((item, i) => {
    item._order = i;
  });

  const dateKeys = Object.keys(groupedByDate.value);
  const dateIdx = dateKeys.indexOf(date);

  mappedItems.value = [
    ...others.filter((i) => dateKeys.indexOf(i.serviceDate) < dateIdx),
    ...group,
    ...others.filter((i) => dateKeys.indexOf(i.serviceDate) > dateIdx),
  ];

  emit("update:items", mappedItems.value);
  onDragEnd();
};

// ── Date format ──
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
  ({ van: "Van Tour", hotel: "Hotel", attraction: "Attraction" }[type] ?? type);

const serviceClass = (type) =>
  ({
    van: "bg-green-100 text-green-700",
    hotel: "bg-purple-100 text-purple-700",
    attraction: "bg-amber-100 text-amber-700",
  }[type] ?? "bg-gray-100 text-gray-600");
</script>
