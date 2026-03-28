<template>
  <div class="wizard-wrap">
    <!-- ── Progress bar ── -->
    <div class="progress-bar">
      <div
        v-for="i in totalSteps"
        :key="i"
        class="progress-segment"
        :class="{ done: i < step, active: i === step }"
      />
    </div>

    <!-- ══════════════════════════════════════════════════════════
         STEP 1 — Room Classification
         User sees ALL rooms: name, qty, checkin, checkout
         + checkboxes: Main / Extra / Breakfast
    ═══════════════════════════════════════════════════════════════ -->
    <template v-if="isHotel && step === 1">
      <div class="step-header">
        <div class="badge">1</div>
        <div>
          <p class="step-title">
            {{ detail?.items[0]?.product?.name }} of Room Classification
          </p>
          <p class="step-sub">
            Review each room and mark its type. Defaults are auto-detected from
            the booking.
          </p>
        </div>
      </div>

      <!-- Live summary chips -->
      <div class="summary-chips">
        <div class="chip chip-main">
          <span class="chip-dot bg-gray-400" />
          Main <b>{{ mainCount }}</b>
        </div>
        <div class="chip chip-extra">
          <span class="chip-dot bg-amber-400" />
          Extra <b>{{ extraCount }}</b>
        </div>
        <div class="chip chip-bfast">
          <span class="chip-dot bg-emerald-400" />
          Breakfast <b>{{ bfastCount }}</b>
        </div>
      </div>

      <!-- Table header -->
      <div class="room-table">
        <div class="room-row room-header">
          <span class="col-name">Room</span>
          <span class="col-qty">Qty</span>
          <span class="col-date">In</span>
          <span class="col-date">Out</span>
          <span class="col-check">Main</span>
          <span class="col-check">Extra</span>
          <span class="col-check">Bfast</span>
        </div>

        <!-- Table body rows -->
        <div
          v-for="room in rooms"
          :key="room.id"
          class="room-row room-body"
          :class="{
            'row-bfast': room.isBfast,
            'row-extra': room.isExtra && !room.isBfast,
            'row-main': room.isMain && !room.isExtra,
          }"
        >
          <!-- Name + CRM -->
          <span class="col-name">
            <span
              class="room-name-text underline text-blue-500"
              @click="goToBooking(room)"
              >{{ room.room?.name ?? "Room" }}</span
            >
            <span
              class="flex justify-start pt-2 items-center gap-x-2 divide-x divide-gray-800"
            >
              <span class="crm-badge">{{ room.crm_id }}</span>
              <span
                class="crm-badge pl-2"
                :class="room.isExtra == 1 ? 'bg-green-300' : 'bg-gray-200'"
                >{{ room.isExtra == 1 ? "Extra" : "No Ext" }}</span
              >
              <span
                class="crm-badge pl-2"
                :class="room.isBfast == 1 ? 'bg-green-300' : 'bg-gray-200'"
                >{{ room.isBfast == 1 ? "Has Bkf" : "No Bkf" }}</span
              >
            </span>
          </span>

          <!-- Qty -->
          <span class="col-qty">{{ room.quantity }}</span>

          <!-- Dates -->
          <span class="col-date">{{ formatDate(room.checkin_date) }}</span>
          <span class="col-date">{{ formatDate(room.checkout_date) }}</span>

          <!-- Main checkbox -->
          <span class="col-check">
            <input
              type="checkbox"
              :checked="room.isMain"
              class="w-4 h-4 cursor-pointer accent-gray-500"
              @change="toggleMain(room.id)"
            />
          </span>

          <!-- Extra checkbox -->
          <span class="col-check">
            <input
              type="checkbox"
              :checked="room.isExtra"
              class="w-4 h-4 cursor-pointer accent-amber-500"
              @change="toggleExtra(room.id)"
            />
          </span>

          <!-- Breakfast checkbox — only enabled if isExtra -->
          <span class="col-check">
            <input
              type="checkbox"
              :checked="room.isBfast"
              class="w-4 h-4 accent-emerald-500 cursor-pointer"
              @change="toggleBfast(room.id)"
            />
          </span>
        </div>
      </div>

      <div class="actions">
        <button class="btn-primary" @click="step = 2">Next →</button>
      </div>
    </template>

    <!-- ══════════════════════════════════════════════════════════
         STEP 2 — Assign Extra Beds to Main Rooms
    ═══════════════════════════════════════════════════════════════ -->
    <template v-if="isHotel && step === 2">
      <div class="step-header">
        <div class="badge">2</div>
        <div>
          <p class="step-title">Extra Bed Assignment</p>
          <p class="step-sub">
            Assign extra beds to main rooms (max 1 per room). Quota:
            {{ extraCount }}.
          </p>
        </div>
      </div>

      <div class="quota-bar">
        <span
          >Extra <b>{{ extraCount }}</b></span
        >
        <span
          >Used <b>{{ totalExtraUsed }}</b></span
        >
        <span
          >Remaining <b>{{ extraCount - totalExtraUsed }}</b></span
        >
      </div>

      <div v-if="mainRooms.length === 0" class="empty-state">
        No main rooms found. ← Go back to Step 1 and check Main.
      </div>

      <div v-for="room in mainRooms" :key="room.id" class="card">
        <div class="card-head">
          <div style="display: flex; align-items: center; gap: 8px">
            <span class="card-name">{{ room.room?.name ?? "Room" }}</span>
            <span class="tag main-tag">main</span>
          </div>
          <span class="crm-id">{{ room.crm_id }}</span>
        </div>
        <div class="row-between">
          <span class="label-sm">Extra bed</span>
          <div class="counter">
            <button
              class="cnt-btn"
              :disabled="room.extraBed <= 0"
              @click="changeExtra(room.id, -1)"
            >
              −
            </button>
            <span class="cnt-val">{{ room.extraBed }}</span>
            <button
              class="cnt-btn"
              :disabled="!canAddExtra(room)"
              @click="changeExtra(room.id, 1)"
            >
              +
            </button>
          </div>
        </div>
        <p
          v-if="
            !canAddExtra(room) &&
            room.extraBed === 0 &&
            totalExtraUsed >= extraCount
          "
          class="hint warn"
        >
          Quota full — remove from another room first.
        </p>
      </div>

      <div class="actions">
        <button class="btn-secondary" @click="step = 1">← Back</button>
        <button class="btn-primary" @click="step = 3">Next →</button>
      </div>
    </template>

    <!-- ══════════════════════════════════════════════════════════
         STEP 3 — Assign Child Breakfast to Main Rooms
    ═══════════════════════════════════════════════════════════════ -->
    <template v-if="isHotel && step === 3">
      <div class="step-header">
        <div class="badge">3</div>
        <div>
          <p class="step-title">Child Breakfast</p>
          <p class="step-sub">
            Assign child breakfast count to main rooms. Quota: {{ bfastCount }}.
          </p>
        </div>
      </div>

      <div class="quota-bar">
        <span
          >Breakfast <b>{{ bfastCount }}</b></span
        >
        <span
          >Used <b>{{ totalBfastUsed }}</b></span
        >
        <span
          >Remaining <b>{{ bfastCount - totalBfastUsed }}</b></span
        >
      </div>

      <div v-if="bfastCount === 0" class="empty-state">
        No breakfast items. ← Go back to Step 1, mark a room as Extra +
        Breakfast.
      </div>

      <div v-if="mainRooms.length === 0" class="empty-state">
        No main rooms found.
      </div>

      <div v-for="room in mainRooms" :key="room.id" class="card">
        <div class="card-head">
          <div style="display: flex; align-items: center; gap: 8px">
            <span class="card-name">{{ room.room?.name ?? "Room" }}</span>
            <span class="tag main-tag">main</span>
          </div>
          <span class="crm-id">{{ room.crm_id }}</span>
        </div>
        <div class="row-between" style="margin-top: 8px">
          <span class="label-sm">Child breakfast</span>
          <div class="counter">
            <button
              class="cnt-btn"
              :disabled="room.childBfast <= 0"
              @click="changeChildBfast(room.id, -1)"
            >
              −
            </button>
            <span class="cnt-val">{{ room.childBfast }}</span>
            <button
              class="cnt-btn"
              :disabled="!canAddChildBfast()"
              @click="changeChildBfast(room.id, 1)"
            >
              +
            </button>
          </div>
        </div>
        <p
          v-if="!canAddChildBfast() && room.childBfast === 0"
          class="hint warn"
        >
          Quota full.
        </p>
      </div>

      <div class="actions">
        <button class="btn-secondary" @click="step = 2">← Back</button>
        <button class="btn-primary" @click="step = 4">Next →</button>
      </div>
    </template>

    <!-- ══════════════════════════════════════════════════════════
         STEP 4 (Hotel) / STEP 1 (Attraction) — Passport Name
    ═══════════════════════════════════════════════════════════════ -->
    <template v-if="(isHotel && step === 4) || (!isHotel && step === 1)">
      <div
        v-if="!isHotel && step == 1"
        @click="showLine"
        class="w-full text-center py-4 border border-gray-400 rounded-2xl bg-orange-600 text-white"
      >
        Line Copy
      </div>
      <div class="step-header">
        <div :class="['badge', passportName.trim() ? 'badge-done' : '']">
          <svg
            v-if="passportName.trim()"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span v-else>{{ isHotel ? 4 : 1 }}</span>
        </div>
        <div>
          <p class="step-title">Passenger Name</p>
          <p class="step-sub">
            One name shown under Booking Code in the email.
          </p>
        </div>
      </div>

      <div class="card">
        <p class="label-sm" style="margin-bottom: 4px">
          Passport name / Guest name
        </p>
        <input
          type="text"
          class="text-input"
          placeholder="e.g. John Smith"
          :value="passportName"
          @input="passportName = ($event.target as HTMLInputElement).value"
        />
        <p class="label-sm" style="margin-top: 12px; margin-bottom: 8px">
          Quick fill:
        </p>
        <div style="display: flex; flex-wrap: wrap; gap: 6px">
          <button
            v-for="p in allPassports"
            :key="p"
            :class="['pill', passportName === p ? 'pill-active' : '']"
            @click="passportName = p"
          >
            {{ p === bookingCustomerName ? "★ " : "" }}{{ p }}
          </button>
        </div>
      </div>

      <div class="actions">
        <button v-if="isHotel" class="btn-secondary" @click="step = 3">
          ← Back
        </button>
        <button
          class="btn-primary"
          :disabled="!passportName.trim()"
          :class="{ 'opacity-40 cursor-not-allowed': !passportName.trim() }"
          @click="goToEmail"
        >
          Generate email →
        </button>
      </div>
    </template>

    <div
      v-if="pricingLoading"
      class="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-2 flex items-center gap-2"
    >
      <svg class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-dasharray="32"
          stroke-dashoffset="12"
        />
      </svg>
      Fetching partner discount data...
    </div>

    <!-- ══════════════════════════════════════════════════════════
         STEP 5 (Hotel) / STEP 2 (Attraction) — Email Preview
    ═══════════════════════════════════════════════════════════════ -->
    <template v-if="(isHotel && step === 5) || (!isHotel && step === 2)">
      <div class="step-header">
        <div class="badge badge-done">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <p class="step-title">Email Ready</p>
          <p class="step-sub">Review and copy each section below.</p>
        </div>
      </div>

      <!-- To -->
      <div class="copy-row">
        <span class="copy-label">To:</span>
        <span class="copy-value">{{
          emailRecipients.join(", ") || "No email found"
        }}</span>
        <button
          :class="['copy-btn', copied.mail ? 'copy-done' : '']"
          @click="copyText(emailRecipients.join(', '), 'mail')"
        >
          {{ copied.mail ? "✓" : "Copy" }}
        </button>
      </div>

      <!-- Subject -->
      <div class="copy-row">
        <span class="copy-label">Subject:</span>
        <span
          class="copy-value"
          style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
          >{{ emailSubject }}</span
        >
        <button
          :class="['copy-btn', copied.subj ? 'copy-done' : '']"
          @click="copyText(emailSubject, 'subj')"
        >
          {{ copied.subj ? "✓" : "Copy" }}
        </button>
      </div>

      <hr class="divider" />

      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        "
      >
        <span class="label-sm">Body</span>
        <button
          :class="['copy-body-btn', copied.body ? 'copy-body-done' : '']"
          @click="copyBody"
        >
          {{ copied.body ? "✓ Copied!" : "Copy body" }}
        </button>
      </div>
      <div class="email-preview">{{ emailBody }}</div>

      <div class="actions">
        <button class="btn-secondary" @click="step = isHotel ? 4 : 1">
          ← Edit name
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { format } from "date-fns";
import { useHotelStore } from "../../stores/hotel";
import { useGroupStore } from "../../stores/group";

const hotelStore = useHotelStore();
const itemPricingData = ref<Record<string, any>>({});
const pricingLoading = ref(false);

const groupStore = useGroupStore();
const passportLoading = ref(false);
const fetchedPassportNames = ref<string[]>([]);

const props = defineProps<{
  detail: Record<string, any>;
  activeTag: string;
  showLine: Function;
}>();

// ─── Hotel vs Attraction ──────────────────────────────────────────────────────
const isHotel = computed(() => {
  const first = props.detail?.items?.[0];
  if (!first) return true;
  return first.product_type !== "App\\Models\\EntranceTicket";
});

// Hotel: 5 steps | Attraction: 2 steps
const totalSteps = computed(() => (isHotel.value ? 5 : 2));
const step = ref(1);

function goToEmail() {
  if (!passportName.value.trim()) return;
  step.value = isHotel.value ? 5 : 2;
}

// ─── WizardRoom ───────────────────────────────────────────────────────────────
interface WizardRoom {
  id: number;
  crm_id: string;
  room: {
    id: number;
    name: string;
    is_extra: number;
    has_breakfast: number;
  } | null;
  checkin_date: string;
  checkout_date: string;
  quantity: number;
  special_request: string | null;
  service_date: string;
  // Step 1 — user-controlled (seeded from item.room fields)
  isMain: boolean;
  isExtra: boolean;
  isBfast: boolean;
  // Step 2 & 3 — assignment counts
  extraBed: number;
  childBfast: number;
}

const rooms = ref<WizardRoom[]>(
  (props.detail?.items ?? []).map((item: any): WizardRoom => {
    const r = item.room ?? {};
    const isExtraDefault = Number(r.is_extra) === 1;
    const isBfastDefault = isExtraDefault && Number(r.has_breakfast) === 1;
    const isMainDefault = !isExtraDefault;
    return {
      id: item.id,
      crm_id: item.crm_id,
      room: item.room ?? null,
      checkin_date: item.checkin_date,
      checkout_date: item.checkout_date,
      quantity: item.quantity ?? 1,
      special_request: item.special_request ?? null,
      service_date: item.service_date ?? item.checkin_date,
      isMain: isMainDefault,
      isExtra: isExtraDefault,
      isBfast: isBfastDefault,
      extraBed: 0,
      childBfast: 0,
    };
  }),
);

function buildPartnerDiscountNote(item: WizardRoom): string {
  const pricing = itemPricingData.value[item.id];
  if (!pricing?.daily_pricing) return "";

  const discountDays = pricing.daily_pricing.filter(
    (d: any) => d.partner_discount > 0,
  );

  if (discountDays.length === 0) {
    return "";
  }

  const totalDiscount = discountDays.reduce((sum: number, d: any) => {
    return sum + Math.round(d.partner_discount) * item.quantity;
  }, 0);

  const dates = discountDays.map((d: any) => d.date).join(", ");

  return [
    `Partner Discount    : ฿${totalDiscount.toLocaleString()} THB included`,
    `Discount Dates      : ${dates}`,
    `Note                : Price includes discount via partner website`,
  ].join("\n");
}

// ─── Step 1 toggle handlers ───────────────────────────────────────────────────
function toggleMain(id: number) {
  const r = rooms.value.find((x) => x.id === id);
  if (r) r.isMain = !r.isMain;
}

function toggleExtra(id: number) {
  const r = rooms.value.find((x) => x.id === id);
  if (!r) return;
  r.isExtra = !r.isExtra;
  if (!r.isExtra) r.isBfast = false; // cascade: no extra → no breakfast
}

function toggleBfast(id: number) {
  const r = rooms.value.find((x) => x.id === id);
  // if (!r || !r.isExtra) return;
  r.isBfast = !r.isBfast;
}

// ─── Counts derived from Step 1 checkboxes ───────────────────────────────────
const mainCount = computed(() =>
  rooms.value.filter((r) => r.isMain).reduce((sum, r) => sum + r.quantity, 0),
);
const extraCount = computed(() =>
  rooms.value.filter((r) => r.isExtra).reduce((sum, r) => sum + r.quantity, 0),
);
const bfastCount = computed(() =>
  rooms.value.filter((r) => r.isBfast).reduce((sum, r) => sum + r.quantity, 0),
);
const mainRooms = computed(() => rooms.value.filter((r) => r.isMain));

// ─── Step 2: extra bed ────────────────────────────────────────────────────────
const totalExtraUsed = computed(() =>
  mainRooms.value.reduce((s, r) => s + r.extraBed, 0),
);

// function canAddExtra(room: WizardRoom): boolean {
//   return totalExtraUsed.value < extraCount.value && room.extraBed < 1;
// }

function canAddExtra(room: WizardRoom): boolean {
  return totalExtraUsed.value < extraCount.value;
  // removed: && room.extraBed < 1
}

function changeExtra(id: number, delta: number) {
  const room = rooms.value.find((r) => r.id === id);
  if (!room) return;
  const next = room.extraBed + delta;
  if (next < 0 || (delta > 0 && !canAddExtra(room))) return;
  room.extraBed = next;
}

// ─── Step 3: child breakfast ──────────────────────────────────────────────────
const totalBfastUsed = computed(() =>
  mainRooms.value.reduce((s, r) => s + r.childBfast, 0),
);

function canAddChildBfast(): boolean {
  return totalBfastUsed.value < bfastCount.value;
}

function changeChildBfast(id: number, delta: number) {
  const room = rooms.value.find((r) => r.id === id);
  if (!room) return;
  const next = room.childBfast + delta;
  if (next < 0 || (delta > 0 && !canAddChildBfast())) return;
  room.childBfast = next;
}

// ─── Passport name ────────────────────────────────────────────────────────────
const bookingCustomerName = computed(() => props.detail?.customer_name ?? "");

const allPassports = computed((): string[] => {
  const names = new Set<string>();
  if (bookingCustomerName.value) names.add(bookingCustomerName.value);
  (props.detail?.questionnaire?.passport_names ?? []).forEach((n: string) =>
    names.add(n),
  );
  // ✅ Add fetched passport names from CustomerDocument
  fetchedPassportNames.value.forEach((n) => names.add(n));
  return Array.from(names);
});

const passportName = ref("");

// ─── Email recipients ─────────────────────────────────────────────────────────
const emailRecipients = computed((): string[] => {
  const raw = props.detail?.items?.[0]?.product?.email;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch {
    /* not json array */
  }
  return String(raw)
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
});

// ─── Email subject ────────────────────────────────────────────────────────────
const emailSubject = computed(() => {
  const item = props.detail?.items?.[0];
  if (!item) return "";
  const dateStr = item.service_date || item.checkin_date;
  const crmId = props.detail.booking_crm_id || props.detail.crm_id;
  return `Booking for ${format(new Date(dateStr), "dd MMMM, yyyy")}: ${crmId}`;
});

// ─── Email body ───────────────────────────────────────────────────────────────
const SEP = "━".repeat(32);

function todayStr() {
  return format(new Date(), "dd/MM/yyyy");
}

function daysBetween(a: string, b: string): number {
  return Math.abs(
    Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000),
  );
}

function formatDate(d: string): string {
  try {
    return format(new Date(d), "dd MMM");
  } catch {
    return d;
  }
}

const emailBody = computed((): string => {
  const detail = props.detail;
  if (!detail?.items?.[0]) return "";

  if (isHotel.value) {
    const productName = detail.items[0].product?.name ?? "Hotel";
    // ✅ Add this
    const allowment = props.detail?.items?.[0]?.product?.allowment;
    const partnerLink = allowment
      ? `Partner Web Link  : https://partners.thanywhere.com/bookings?id=${props.detail?.id}`
      : null;

    const roomBlocks = mainRooms.value
      .map((item, idx) => {
        const nights = daysBetween(item.checkin_date, item.checkout_date);
        const discountNote = buildPartnerDiscountNote(item); // ← add

        return [
          idx > 0 ? "─".repeat(32) : "",
          `Room Type         : ${item.room?.name ?? "N/A"}`,
          `Check-in Date     : ${item.checkin_date}`,
          `Check-out Date    : ${item.checkout_date}`,
          `Duration          : ${item.quantity} Room${
            item.quantity > 1 ? "s" : ""
          }, ${nights} Night${nights > 1 ? "s" : ""}`,
          `Special Request   : ${item.special_request || "None"}`,
          `Reservation Code  : ${item.crm_id}`,
          `Extra Bed         : ${item.extraBed}`,
          `Child Breakfast   : ${item.childBfast}`,
          discountNote || null, // ← add
        ]
          .filter(Boolean)
          .join("\n");
      })
      .join("\n\n");

    return `Dear ${productName},

Greetings from ThAnywhere Co., Ltd.

We would like to book the accommodation as per the following details. Please note the booking has been checked by phone.

${SEP}
BOOKING DETAILS
${SEP}
${partnerLink != null ? "Partner Link: " + partnerLink : ""}


${roomBlocks}

${SEP}

Booking Code: ${detail.booking_crm_id}
Name : ${passportName.value}


Passports for the bookings are attached to this email. Please arrange for the customer accordingly.

Payment transaction will be completed soon. Once the payment is received, please kindly issue a receipt with our Tax ID and send it to us by post or email.

If you have any questions or concerns, please feel free to call me at 063-760-2448 at any time.

${SEP}
COMPANY INFORMATION
${SEP}
Tax ID        : 0105565081822
Company       : TH ANYWHERE CO., LTD.
Invoice Date  : ${todayStr()}
${SEP}

Thank you for your cooperation.

Best regards,

Negyi @ Sunshine
Reservation Manager
TH ANYWHERE CO., LTD.

100/151 Huay Kaew Rd, Tambon Chang Phueak
Mueang Chiang Mai District, Chiang Mai 50300
Thailand`;
  } else {
    const productName = detail.items[0].product?.name ?? "Attraction";
    const ticketBlocks = detail.items
      .map((item: any, idx: number) => {
        const childQty = item.individual_pricing?.child?.quantity ?? 0;
        return [
          idx > 0 ? "─".repeat(32) : "",
          `Ticket Type       : ${item.variation?.name ?? "N/A"}`,
          `Service Date      : ${item.service_date}`,
          `Ticket Quantity   : ${item.quantity} Adult, ${childQty} Child`,
          `Special Request   : ${item.special_request || "None"}`,
        ]
          .filter(Boolean)
          .join("\n");
      })
      .join("\n\n");

    return `Dear ${productName},

Greetings from ThAnywhere Co., Ltd.

We would like to book the tickets as per the following details.

${SEP}
BOOKING DETAILS
${SEP}

${ticketBlocks}

${SEP}

Booking Code: ${detail.booking_crm_id}
Name : ${passportName.value}

Passports for the bookings are attached to this email. Please arrange for the customer accordingly.

Payment transaction will be completed soon. Once the payment is received, please kindly issue a receipt with our Tax ID and send it to us by post or email.

If you have any questions or concerns, please feel free to call me at 063-760-2448 at any time.

${SEP}
COMPANY INFORMATION
${SEP}
Tax ID        : 0105565081822
Company       : TH ANYWHERE CO., LTD.
Invoice Date  : ${todayStr()}
${SEP}

For any inquiries, please contact us at:
  Phone    : 095-042-3254
  LINE ID  : 0983498197

Thank you for your cooperation.

Best regards,

Negyi @ Sunshine
Reservation Manager
TH ANYWHERE CO., LTD.

100/151 Huay Kaew Rd, Tambon Chang Phueak
Mueang Chiang Mai District, Chiang Mai 50300
Thailand`;
  }
});

const goToBooking = (room) => {
  console.log("====================================");
  console.log(room);
  console.log("====================================");
  window.open(
    `/products-v2/hotel/edit/${room.room?.hotel?.id}?room_id=${room.room?.id}&quiteSwitch=11`,
    "_blank",
  );
};

// ─── Copy helpers ─────────────────────────────────────────────────────────────
const copied = ref({ body: false, subj: false, mail: false });

async function copyText(text: string, key: "body" | "subj" | "mail") {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    fallbackCopy(text);
  }
  copied.value[key] = true;
  setTimeout(() => {
    copied.value[key] = false;
  }, 2500);
}

async function copyBody() {
  await copyText(emailBody.value, "body");
}

function fallbackCopy(text: string) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
  } catch {
    /* ignore */
  }
  document.body.removeChild(ta);
}

const fetchPassports = async () => {
  const groupId = props.detail?.items[0]?.group_id; // BookingItemGroup id
  if (!groupId) return;

  try {
    passportLoading.value = true;
    const response = await groupStore.groupDocumentList(groupId, {
      document_type: "passport",
    });

    if (response?.result) {
      // extract name from meta
      fetchedPassportNames.value = response.result
        .map((doc: any) => doc.meta?.name ?? doc.meta?.passport_name ?? "")
        .filter(Boolean);
    }
  } catch (error) {
    console.error("Error fetching passports:", error);
  } finally {
    passportLoading.value = false;
  }
};

onMounted(async () => {
  console.log(props.detail, "this is detail");

  await fetchPassports();

  // Fetch daily pricing for all hotel items
  if (isHotel.value) {
    pricingLoading.value = true;
    try {
      const fetchPromises = (props.detail?.items ?? []).map(
        async (item: any) => {
          if (item.room?.id && item.checkin_date && item.checkout_date) {
            try {
              const res = await hotelStore.getRoomPrice(
                {
                  checkin_date: item.checkin_date,
                  checkout_date: item.checkout_date,
                },
                item.room.id,
              );
              itemPricingData.value[item.id] = res.data;
            } catch (e) {
              console.error(`Failed to fetch pricing for item ${item.id}`, e);
            }
          }
        },
      );
      await Promise.all(fetchPromises);
    } finally {
      pricingLoading.value = false;
    }
  }
});
</script>

<style scoped>
.wizard-wrap {
  @apply space-y-3;
}

/* ── Progress ── */
.progress-bar {
  @apply flex gap-1.5 mb-4;
}
.progress-segment {
  @apply h-1 flex-1 rounded-full transition-all duration-300 bg-gray-200;
}
.progress-segment.done {
  @apply bg-green-500;
}
.progress-segment.active {
  @apply bg-[#FF613c];
}

/* ── Step header ── */
.step-header {
  @apply flex items-start gap-3 mb-3;
}
.badge {
  @apply w-7 h-7 rounded-full bg-[#FF613c] text-white flex items-center justify-center
         text-xs font-medium flex-shrink-0 mt-0.5;
}
.badge-done {
  @apply bg-green-500;
}
.step-title {
  @apply text-sm font-medium text-gray-900;
}
.step-sub {
  @apply text-xs text-gray-500 mt-0.5;
}

/* ── Summary chips ── */
.summary-chips {
  @apply flex gap-2 mb-3;
}
.chip {
  @apply flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-medium;
}
.chip b {
  @apply ml-0.5;
}
.chip-main {
  @apply bg-gray-50  border-gray-200  text-gray-600;
}
.chip-extra {
  @apply bg-amber-50 border-amber-200 text-amber-700;
}
.chip-bfast {
  @apply bg-emerald-50 border-emerald-200 text-emerald-700;
}
.chip-dot {
  @apply w-2 h-2 rounded-full flex-shrink-0;
}

/* ── Room table ── */
.room-table {
  @apply border border-gray-200 rounded-xl overflow-hidden;
}
.room-row {
  display: grid;
  grid-template-columns: 1fr 36px 60px 60px 42px 42px 42px;
  gap: 4px;
  padding: 8px 12px;
  align-items: center;
}
.room-header {
  @apply bg-gray-50 border-b border-gray-200 text-xs text-gray-500 font-medium;
}
.room-body {
  @apply border-b border-gray-100 last:border-0 text-xs transition-colors;
}
.row-main {
  @apply bg-white;
}
.row-extra {
  background: #fffbeb;
} /* amber-50 */
.row-bfast {
  background: #ecfdf5;
} /* emerald-50 */

.col-name {
  @apply flex flex-col gap-0.5;
}
.col-qty {
  @apply text-center text-gray-700 font-medium;
}
.col-date {
  @apply text-gray-600;
}
.col-check {
  @apply flex justify-center;
}

.room-name-text {
  @apply cursor-pointer font-medium leading-tight;
}
.crm-badge {
  @apply text-[10px] text-gray-800  px-1.5 py-0.5;
}

/* ── Hint note ── */
.hint-note {
  @apply text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mt-2;
}

/* ── Quota bar ── */
.quota-bar {
  @apply flex gap-4 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-3;
}
.quota-bar b {
  @apply text-[#FF613c];
}

/* ── Card ── */
.card {
  @apply border border-gray-200 rounded-xl p-4 mb-2 bg-white;
}
.card-head {
  @apply flex items-center justify-between mb-2;
}
.card-name {
  @apply text-sm font-medium text-gray-900;
}
.crm-id {
  @apply text-xs text-gray-400;
}

.tag {
  @apply text-[10px] px-2 py-0.5 rounded-full font-medium;
}
.main-tag {
  @apply bg-gray-100 text-gray-500;
}

.row-between {
  @apply flex items-center gap-3;
}
.label-sm {
  @apply text-xs text-gray-500 flex-1;
}

.counter {
  @apply flex items-center gap-2;
}
.cnt-btn {
  @apply w-7 h-7 rounded-full border border-gray-300 bg-gray-50 flex items-center justify-center
         text-base leading-none transition-colors hover:bg-gray-100
         disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer;
}
.cnt-val {
  @apply text-sm font-medium w-5 text-center text-gray-900;
}

.hint {
  @apply text-xs rounded-lg px-2 py-1 mt-2;
}
.hint.warn {
  @apply text-amber-600 bg-amber-50;
}

.empty-state {
  @apply border border-dashed border-gray-300 rounded-xl p-5 text-center text-xs text-gray-400 mb-2;
}

/* ── Passport step ── */
.text-input {
  @apply w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900
         focus:outline-none focus:ring-2 focus:ring-[#FF613c];
}
.pill {
  @apply px-3 py-1 rounded-full text-xs border transition-all cursor-pointer
         bg-gray-50 text-gray-500 border-gray-200
         hover:border-[#FF613c] hover:text-[#FF613c];
}
.pill-active {
  @apply bg-[#FF613c] text-white border-[#FF613c];
}

/* ── Actions ── */
.actions {
  @apply flex gap-2 mt-4;
}
.btn-primary {
  @apply bg-[#FF613c] text-white px-5 py-2 rounded-full text-sm font-medium
         hover:bg-[#e55139] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer;
}
.btn-secondary {
  @apply bg-gray-100 text-gray-700 border border-gray-200 px-5 py-2 rounded-full text-sm
         hover:bg-gray-200 transition-colors cursor-pointer;
}

/* ── Email preview ── */
.copy-row {
  @apply flex items-center gap-2 mb-2;
}
.copy-label {
  @apply text-xs text-gray-500 w-16 flex-shrink-0;
}
.copy-value {
  @apply flex-1 text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.copy-btn {
  @apply bg-gray-100 text-gray-600 border border-gray-200 px-3 py-1 rounded-full text-xs
         cursor-pointer transition-colors hover:bg-gray-200 whitespace-nowrap;
}
.copy-btn.copy-done {
  @apply bg-green-500 text-white border-green-500;
}

.divider {
  @apply border-gray-200 my-3;
}

.copy-body-btn {
  @apply px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors
         bg-[#FF613c] text-white hover:bg-[#e55139];
  border: none;
}
.copy-body-btn.copy-body-done {
  @apply bg-green-500;
}

.email-preview {
  @apply bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs leading-relaxed
         text-gray-700 whitespace-pre-wrap max-h-[360px] overflow-y-auto;
}

/* Opacity util */
.opacity-40 {
  opacity: 0.4;
}
.cursor-not-allowed {
  cursor: not-allowed;
}
</style>
