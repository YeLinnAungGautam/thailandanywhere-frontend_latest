<template>
  <div class="bg-gray-50 py-6 min-h-screen font-sans">
    <!-- Header -->
    <div class="flex items-center justify-between mb-5 flex-wrap gap-3">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-[#FF613c] inline-block"></span>
        <h1 class="text-xl font-bold text-[#FF613c] tracking-tight">
          Income Print PDF
        </h1>
        <!-- <span
          class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full"
        >
          {{ cashImages?.total ?? 0 }} records
        </span> -->
      </div>
      <div class="flex items-center gap-2">
        <YearPickerVue @year-change="handleYearChange" />
        <select
          v-model="selectedMonth"
          @change="handleMonthChange"
          class="text-xs px-3 py-2 border border-gray-200 rounded-lg bg-white outline-none cursor-pointer"
        >
          <option :value="m.id" v-for="m in monthArray" :key="m.id">
            {{ m.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="flex items-center gap-2 mb-4 flex-wrap relative">
      <!-- Search -->
      <div class="relative flex-shrink-0 w-64">
        <MagnifyingGlassIcon
          class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
        />
        <input
          type="search"
          v-model="searchKey.crm_id"
          placeholder="Search CRM ID or Amount…"
          @keyup.enter="searchAction"
          class="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg bg-white outline-none focus:border-[#FF613c] transition-colors"
        />
      </div>

      <!-- Filter button -->
      <div class="relative">
        <button
          @click="filterShow = !filterShow"
          class="flex items-center gap-1.5 px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white hover:border-[#FF613c] hover:text-[#FF613c] transition-colors"
        >
          <FunnelIcon class="w-3.5 h-3.5" />
          Filter
          <span
            v-if="activeFilterCount > 0"
            class="bg-[#FF613c] text-white text-[10px] px-1.5 rounded-full leading-5"
          >
            {{ activeFilterCount }}
          </span>
        </button>

        <!-- Dropdown -->
        <transition
          enter-active-class="transition ease-out duration-150"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-100"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <div
            v-if="filterShow"
            class="absolute top-full left-0 mt-1.5 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-3 flex flex-col gap-2.5"
          >
            <div
              class="flex justify-between items-center pb-2 border-b border-gray-100"
            >
              <span class="text-xs font-semibold text-gray-700">Filters</span>
              <button
                @click="clearFilter"
                class="text-[11px] text-[#FF613c] hover:underline"
              >
                Clear all
              </button>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[11px] text-gray-500 font-medium"
                >Sender</label
              >
              <input
                type="text"
                v-model="searchKey.sender"
                placeholder="Sender name"
                class="px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#FF613c]"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[11px] text-gray-500 font-medium"
                >Receiver</label
              >
              <input
                type="text"
                v-model="searchKey.receiver"
                placeholder="Receiver name"
                class="px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#FF613c]"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-[11px] text-gray-500 font-medium"
                >Currency</label
              >
              <select
                v-model="searchKey.currency"
                class="px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#FF613c] bg-white"
              >
                <option value="">All</option>
                <option value="THB">THB</option>
                <option value="MMK">MMK</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div class="pt-1.5 border-t border-gray-100">
              <button
                @click="searchAction"
                class="w-full py-2 bg-[#FF613c] text-white text-xs font-semibold rounded-lg hover:bg-[#e84e2a] transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </transition>
      </div>

      <!-- Active filter chips -->
      <div class="flex gap-1.5 flex-wrap items-center">
        <span
          v-for="chip in activeChips"
          :key="chip.key"
          class="flex items-center gap-1 text-[11px] px-2 py-0.5 bg-orange-50 border border-orange-200 text-[#FF613c] rounded-full"
        >
          {{ chip.label }}
          <XMarkIcon
            class="w-3 h-3 cursor-pointer"
            @click="removeFilter(chip.key)"
          />
        </span>
      </div>
    </div>

    <!-- Table card -->
    <div
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <!-- Skeleton -->
      <template v-if="loading">
        <div class="divide-y divide-gray-100">
          <div
            v-for="i in 8"
            :key="i"
            class="flex gap-4 px-5 py-3.5 items-center"
          >
            <div class="h-3 bg-gray-100 rounded-full w-20 animate-pulse"></div>
            <div class="h-3 bg-gray-100 rounded-full w-36 animate-pulse"></div>
            <div class="h-3 bg-gray-100 rounded-full w-28 animate-pulse"></div>
            <div
              class="h-3 bg-gray-100 rounded-full w-20 animate-pulse ml-auto"
            ></div>
            <div class="h-3 bg-gray-100 rounded-full w-16 animate-pulse"></div>
            <div class="h-7 bg-gray-100 rounded-lg w-20 animate-pulse"></div>
          </div>
        </div>
      </template>

      <table v-else class="w-full text-sm">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th
              class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
            >
              Cash Unit
            </th>
            <th
              class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
            >
              Sender → Receiver
            </th>
            <th
              class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
            >
              Date
            </th>
            <th
              class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
            >
              Amount
            </th>
            <th
              class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide"
            >
              Currency
            </th>
            <th
              class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide"
            >
              Status
            </th>
            <th
              class="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="item in cashImages?.data ?? []"
            :key="item.id"
            class="bg-green-50/60 hover:bg-green-100/60 transition-colors"
          >
            <td class="px-5 py-3.5">
              <span class="font-semibold text-gray-800 text-xs">{{
                `${item.unit}`
              }}</span>
            </td>
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-1.5 text-xs">
                <span class="font-medium text-gray-700">{{ item.sender }}</span>
                <ArrowRightIcon class="w-3 h-3 text-gray-400 shrink-0" />
                <span class="text-gray-500">{{ item.receiver }}</span>
              </div>
            </td>
            <td class="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
              {{ item.date }}
            </td>
            <td
              class="px-5 py-3.5 text-xs font-bold text-gray-900 tabular-nums"
            >
              {{ item.amount }}
            </td>
            <td class="px-5 py-3.5">
              <span
                class="inline-block text-[11px] font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md"
              >
                {{ item.currency }}
              </span>
            </td>
            <td class="px-5 py-3.5">
              <span
                class="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap bg-green-100 text-green-700"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Verified
              </span>
            </td>
            <td class="px-5 py-3.5 flex justify-start items-center gap-x-2">
              <button
                @click="openPrintModal(item)"
                :disabled="printLoading === item.id"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-[11px] font-semibold rounded-lg transition-all hover:-translate-y-px hover:shadow-md active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span
                  v-if="printLoading === item.id"
                  class="w-3.5 h-3.5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"
                ></span>
                <PrinterIcon v-else class="w-3.5 h-3.5" />
                {{ printLoading === item.id ? "Loading…" : "Print" }}
              </button>
              <button
                @click="goToBooking(item)"
                class="inline-flex items-center whitespace-nowrap gap-1.5 px-3 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-[11px] font-semibold rounded-lg transition-all hover:-translate-y-px hover:shadow-md active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Go Booking
              </button>
            </td>
          </tr>
          <tr v-if="(cashImages?.data ?? []).length === 0">
            <td colspan="7" class="text-center text-gray-400 text-sm py-16">
              No records found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-3" v-if="!loading">
      <Pagination :data="cashImages" @change-page="changePage" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import {
  ArrowRightIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PrinterIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import Pagination from "../components/PaginationExpense.vue";
import YearPickerVue from "./AccountingComponent/yearPicker.vue";
import { useCashImageStore } from "../stores/cashImage";

const route = useRoute();
const cashImageStore = useCashImageStore();
const { cashImages, loading } = storeToRefs(cashImageStore);

const currentDate = new Date();
const year = ref(currentDate.getFullYear());
const selectedMonth = ref(currentDate.getMonth() + 1);
const filterShow = ref(false);
const saveUrl = ref("");

const searchKey = ref({ crm_id: "", sender: "", receiver: "", currency: "" });

// Print state
const printModal = ref(false);
const printHtml = ref("");
const printCrmId = ref("");
const printLoading = ref(null);

const monthArray = [
  { id: 1, name: "January" },
  { id: 2, name: "February" },
  { id: 3, name: "March" },
  { id: 4, name: "April" },
  { id: 5, name: "May" },
  { id: 6, name: "June" },
  { id: 7, name: "July" },
  { id: 8, name: "August" },
  { id: 9, name: "September" },
  { id: 10, name: "October" },
  { id: 11, name: "November" },
  { id: 12, name: "December" },
];

const chipLabels = {
  sender: "Sender",
  receiver: "Receiver",
  currency: "Currency",
};

const activeChips = computed(() =>
  Object.entries(searchKey.value)
    .filter(([k, v]) => k !== "crm_id" && v)
    .map(([k, v]) => ({ key: k, label: `${chipLabels[k]}: ${v}` })),
);

const activeFilterCount = computed(() => activeChips.value.length);

const queryParams = computed(() => {
  const result = Object.fromEntries(
    Object.entries(searchKey.value).filter(([, v]) => v),
  );
  const start = new Date(year.value, selectedMonth.value - 1, 1);
  const end = new Date(year.value, selectedMonth.value, 0);
  const fmt = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate(),
    ).padStart(2, "0")}`;
  result.date = `${fmt(start)},${fmt(end)}`;
  result.limit = 20;
  result.data_verify = 1;
  result.bank_verify = 1;
  result.interact_bank = "company";
  result.relatable_type = "App\\Models\\Booking";
  return result;
});

const getList = async () => {
  if (saveUrl.value) {
    await cashImageStore.getChangePage(saveUrl.value, queryParams.value);
  } else {
    await cashImageStore.getListAction(queryParams.value);
  }
};

const changePage = async (url) => {
  saveUrl.value = url;
  await cashImageStore.getChangePage(url, queryParams.value);
};

const searchAction = () => {
  filterShow.value = false;
  saveUrl.value = "";
  getList();
};

const clearFilter = () => {
  searchKey.value = { crm_id: "", sender: "", receiver: "", currency: "" };
  filterShow.value = false;
  getList();
};

const removeFilter = (key) => {
  searchKey.value[key] = "";
  searchAction();
};

const handleYearChange = (y) => {
  year.value = y;
  getList();
};

const handleMonthChange = () => {
  saveUrl.value = "";
  getList();
};

// ─── Helpers ──────────────────────────────────────────────

const fmt = (n) =>
  n != null ? new Intl.NumberFormat().format(Math.round(Number(n))) : "0";

/**
 * Resolve display name for a booking item.
 * Rules:
 *  - room / hotel type  → "Hotel Service"
 *  - ticket / entrance  → "Entrance Ticket Service"
 *  - anything else      → original name (append " Service" if missing)
 */
const resolveProductName = (bi) => {
  const rawType = (bi.product_type ?? "").split("\\").pop().toLowerCase();
  const rawName = (bi.product?.name ?? bi.room?.name ?? "").toLowerCase();

  if (bi.room || rawType.includes("hotel") || rawName.includes("hotel")) {
    return "Hotel Service";
  }
  if (
    rawType.includes("ticket") ||
    rawType.includes("entrance") ||
    rawName.includes("ticket") ||
    rawName.includes("entrance")
  ) {
    return "Entrance Ticket Service";
  }

  const base =
    bi.product?.name ??
    bi.room?.name ??
    bi.product_type?.split("\\").pop() ??
    "Service";
  return base.toLowerCase().includes("service") ? base : `${base} Service`;
};

// ─── Build print HTML ─────────────────────────────────────

const injectPrintStyles = () => {
  if (document.getElementById("print-styles")) return;
  const style = document.createElement("style");
  style.id = "print-styles";
  style.textContent = `
    @media print {
      body > *:not(#print-portal-root) {
        display: none !important;
      }
      #print-content {
        display: block !important;
        width: 100% !important;
        box-shadow: none !important;
        margin: 0 !important;
      }
    }
  `;
  document.head.appendChild(style);
};

const removePrintStyles = () => {
  document.getElementById("print-styles")?.remove();
};

const buildPrintHtml = (
  detail,
  booking,
  customer,
  bookingItems,
  cashAmount,
) => {
  const currency = booking?.payment_currency ?? detail.currency ?? "THB";

  // Scale factor: make item totals sum to cashAmount
  const bookingTotal = bookingItems.reduce(
    (sum, bi) => sum + Number(bi.amount ?? 0),
    0,
  );
  const scaleFactor =
    bookingTotal > 0 && cashAmount > 0 ? cashAmount / bookingTotal : 1;

  const itemRows = bookingItems
    .map((bi) => {
      const productName = resolveProductName(bi);
      const qty = Number(bi.quantity ?? 1);
      const scaledTotal = Number(bi.amount ?? 0) * scaleFactor;
      const scaledUnit = qty > 0 ? scaledTotal / qty : scaledTotal;

      return `
      <tr>
        <td>${productName}</td>
        <td>-</td>
        <td style="text-align:right">${qty}</td>
        <td style="text-align:right">${fmt(scaledUnit)} ${currency}</td>
        <td style="text-align:right">${fmt(scaledTotal)} ${currency}</td>
      </tr>`;
    })
    .join("");

  const grandTotal = fmt(cashAmount);

  const customerName = customer?.name ?? detail.sender ?? "—";
  const customerPhone = customer?.phone_number ?? "—";
  const customerEmail = customer?.email ?? "";

  const cashImageUrl = detail.image ? `${detail.image}` : null;

  console.log(cashImageUrl);

  return `
    <style>
      #print-content * { box-sizing: border-box; }
      #print-content .page { padding: 36px 44px; page-break-after: always; }
      #print-content .page:last-child { page-break-after: auto; }
      #print-content .header-row { display: flex; justify-content: space-between; margin-bottom: 28px; gap: 24px; }
      #print-content .label { font-weight: 700; font-size: 11px; letter-spacing: .06em; margin-bottom: 5px; text-transform: uppercase; color: #555; }
      #print-content .val { font-size: 13px; line-height: 1.7; }
      #print-content hr.divider { border: none; border-top: 2px solid #111; margin: 0 0 0; }
      #print-content .meta-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 12px; color: #444; border-bottom: 1px solid #eee; }
      #print-content .meta-row span:first-child { font-weight: 600; color: #111; }
      #print-content table.items { width: 100%; border-collapse: collapse; margin-top: 22px; }
      #print-content table.items thead tr { border-top: 2px solid #111; border-bottom: 2px solid #111; }
      #print-content table.items th { padding: 8px 6px; font-size: 10px; font-weight: 700; letter-spacing: .07em; text-align: left; }
      #print-content table.items th:nth-child(3),
      #print-content table.items th:nth-child(4),
      #print-content table.items th:nth-child(5) { text-align: right; }
      #print-content table.items td { padding: 10px 6px; font-size: 12px; border-bottom: 1px solid #eee; vertical-align: top; }
      #print-content table.items td:nth-child(3),
      #print-content table.items td:nth-child(4),
      #print-content table.items td:nth-child(5) { text-align: right; }
      #print-content .total-row { display: flex; justify-content: flex-end; gap: 40px; padding: 14px 6px 0; border-top: 2px solid #111; margin-top: 8px; font-weight: 700; font-size: 15px; }
      #print-content .receipt-section { margin-top: 28px; padding-top: 18px; border-top: 1px solid #ddd; font-size: 12px; }
      #print-content .r-row { display: flex; gap: 12px; margin-bottom: 5px; }
      #print-content .r-label { width: 140px; font-weight: 600; color: #333; }
      #print-content .slip-page { padding: 36px 44px; display: flex; flex-direction: column; align-items: center; }
      #print-content .slip-img { width: 100%; border: 1px solid #ddd; border-radius: 6px; }
      @media print {
        #print-content .page { padding: 18mm 22mm; min-height: 297mm; }
        #print-content .slip-page { padding: 18mm 22mm; min-height: 297mm; }
      }
    </style>

    <!-- PAGE 1: INVOICE -->
    <div class="page">
      <div class="header-row" style="align-items: flex-start; margin-bottom: 24px;">
        <div>
          <div style="font-size: 22px; font-weight: 900; color: #111; margin-bottom: 6px; letter-spacing: -0.3px;">TH ANYWHERE CO., LTD.</div>
          <div style="font-size: 12px; color: #333; line-height: 2;">
            TH Anywhere (Head Office)<br>
            100, 151 Huay Kaew Rd, Chiang Mai<br>
            <strong>Tax ID:</strong> 0105555809643B<br>
            <strong>Tel:</strong> 020042354
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 20px; font-weight: 900; color: #111; margin-bottom: 10px;">PAYMENT</div>
          <div style="font-size: 12px; color: #333; line-height: 2;">
            <strong>Date:</strong> ${detail.date ?? "—"}<br>
            <strong>Payment No.:</strong> ${detail?.unit ?? "—"}<br>
            <strong>Agency Sold by:</strong> TH Anywhere Myanmar
          </div>
        </div>
      </div>
      <div class="header-row">
        <div>
          <div class="label">Customer Detail</div>
          <div class="val">
            <strong>${customerName}</strong><br>
            ${customerPhone}${customerEmail ? "<br>" + customerEmail : ""}
          </div>
        </div>
        <div style="text-align:right">
          <div class="label">Agency Sold From</div>
          <div class="val">
            TH Anywhere Co., Ltd.<br>
            Alan Pya Phaya Lan, Yangon<br>
            Myanmar
          </div>
        </div>
      </div>

      <table class="items">
        <thead>
          <tr>
            <th>PRODUCT</th>
            <th>DESCRIPTION</th>
            <th>QUANTITY</th>
            <th>UNIT PRICE</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${
            itemRows ||
            `<tr><td colspan="5" style="padding:14px 6px;color:#888">No items</td></tr>`
          }
        </tbody>
      </table>

      <div class="total-row">
        <span>Total</span>
        <span>${grandTotal} ${currency}</span>
      </div>

      
    </div>

    <!-- PAGE 2: CASH SLIP -->
    <div class="slip-page">
      
      ${
        cashImageUrl
          ? `<img class="slip-img" src="${cashImageUrl}" alt="Cash slip" />`
          : `<p style="color:#888;font-size:13px;margin-top:40px">No slip image available.</p>`
      }
    </div>`;
};

// ─── Open modal ───────────────────────────────────────────

const goToBooking = async (item) => {
  const res = await cashImageStore.getDetailAction(item.id);
  console.log(res, "this is booking");
  window.open(
    `/bookings/new-update/${res.result?.attached_bookings[0]?.booking?.id}`,
    "_blink",
  );
};

const openPrintModal = async (item) => {
  printLoading.value = item.id;
  try {
    const res = await cashImageStore.getDetailAction(item.id);
    console.log(res);

    const detail = res?.result ?? {};
    const booking = detail.attached_bookings?.[0]?.booking ?? null;
    const customer = booking?.customer ?? null;
    const bookingItems = booking?.items ?? [];
    const cashAmount = Number(detail.amount ?? 0);

    printCrmId.value = booking?.crm_id ?? item.crm_id ?? `#${item.id}`;
    printHtml.value = buildPrintHtml(
      detail,
      booking,
      customer,
      bookingItems,
      cashAmount,
    );
    // printModal.value = true;
    triggerPrint();
    injectPrintStyles();
  } catch (e) {
    console.error("Failed to load print detail", e);
  } finally {
    printLoading.value = null;
  }
};

const closePrintModal = () => {
  printModal.value = false;
  removePrintStyles();
};

// ─── Trigger browser print ────────────────────────────────

const triggerPrint = () => {
  // Hide everything except #print-content for the print dialog
  const style = document.createElement("style");
  style.id = "__bank-verify-print-override__";
  style.textContent = `
    @media print {
      body > * { display: none !important; }
      #__print_portal__ { display: block !important; position: fixed; top: 0; left: 0; width: 100%; }
    }
  `;

  // Build a dedicated print iframe for clean output
  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;top:0;left:0;width:0;height:0;border:none;";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Receipt — ${printCrmId.value}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 13px; color: #111; background: #fff; }
    @page { size: A4; margin: 0; }
  </style>
</head>
<body>
  <div id="print-content">${printHtml.value}</div>
  <script>
    window.onload = function() {
      var img = document.querySelector('.slip-img');
      if (img && !img.complete) {
        img.onload = function() { window.print(); window.onafterprint = function() { window.close(); }; };
        img.onerror = function() { window.print(); window.onafterprint = function() { window.close(); }; };
      } else {
        window.print();
        window.onafterprint = function() { window.close(); };
      }
    };
  <\/script>
</body>
</html>`);
  doc.close();

  // Clean up iframe after printing
  iframe.contentWindow.onafterprint = () => {
    document.body.removeChild(iframe);
  };
};

onMounted(() => {
  if (route.query.month) selectedMonth.value = parseInt(route.query.month);
  if (route.query.year) year.value = parseInt(route.query.year);
  getList();
});
</script>
