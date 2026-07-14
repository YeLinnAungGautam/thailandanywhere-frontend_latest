<template>
  <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
    <div
      v-for="card in cards"
      :key="card.label"
      class="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div class="flex items-start justify-between">
        <div>
          <p class="text-xs font-medium uppercase tracking-wide text-slate-400">
            {{ card.label }}
          </p>
          <p class="mt-1 text-2xl font-semibold text-slate-800">
            {{ card.value }}
          </p>
        </div>
        <span
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          :class="card.iconBg"
        >
          <component :is="card.icon" class="h-5 w-5" :class="card.iconColor" />
        </span>
      </div>
      <div class="absolute inset-x-0 bottom-0 h-1" :class="card.barColor" />
    </div>
  </div>
</template>

<script setup>
import { computed, h } from "vue";

const props = defineProps({
  total: { type: Number, default: 0 },
  active: { type: Number, default: 0 },
  expired: { type: Number, default: 0 },
  upcoming: { type: Number, default: 0 },
});

// tiny inline icon renderers so this component has zero external icon-lib dependency
const TagIcon = () =>
  h(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.8",
    },
    [
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        d: "M20.59 13.41 12 22 2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z",
      }),
      h("circle", {
        cx: "7",
        cy: "7",
        r: "1.5",
        fill: "currentColor",
        stroke: "none",
      }),
    ],
  );

const CheckCircleIcon = () =>
  h(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.8",
    },
    [
      h("circle", { cx: "12", cy: "12", r: "9" }),
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        d: "m8.5 12.5 2.5 2.5 5-5",
      }),
    ],
  );

const ClockIcon = () =>
  h(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.8",
    },
    [
      h("circle", { cx: "12", cy: "12", r: "9" }),
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        d: "M12 7v5l3 2",
      }),
    ],
  );

const XCircleIcon = () =>
  h(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.8",
    },
    [
      h("circle", { cx: "12", cy: "12", r: "9" }),
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        d: "m9.5 9.5 5 5m0-5-5 5",
      }),
    ],
  );

const cards = computed(() => [
  {
    label: "Total coupons",
    value: props.total,
    icon: TagIcon,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-500",
    barColor: "bg-indigo-500",
  },
  {
    label: "Active now",
    value: props.active,
    icon: CheckCircleIcon,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    barColor: "bg-emerald-500",
  },
  {
    label: "Upcoming",
    value: props.upcoming,
    icon: ClockIcon,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    barColor: "bg-amber-500",
  },
  {
    label: "Expired",
    value: props.expired,
    icon: XCircleIcon,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
    barColor: "bg-rose-500",
  },
]);
</script>
