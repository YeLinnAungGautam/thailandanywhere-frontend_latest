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
    ═══════════════════════════════════════════════════════════════ -->
    <template v-if="isHotel && step === 1">
      <div class="step-header">
        <div class="badge">1</div>
        <div>
          <p class="step-title">
            {{ detail?.items[0]?.product?.name }} — Room Classification
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
              >
                {{ room.isExtra == 1 ? "Extra" : "No Ext" }}
              </span>
              <span
                class="crm-badge pl-2"
                :class="room.isBfast == 1 ? 'bg-green-300' : 'bg-gray-200'"
              >
                {{ room.isBfast == 1 ? "Has Bkf" : "No Bkf" }}
              </span>
            </span>
          </span>

          <span class="col-qty">{{ room.quantity }}</span>
          <span class="col-date">{{ formatDate(room.checkin_date) }}</span>
          <span class="col-date">{{ formatDate(room.checkout_date) }}</span>

          <span class="col-check">
            <input
              type="checkbox"
              :checked="room.isMain"
              class="w-4 h-4 cursor-pointer accent-gray-500"
              @change="toggleMain(room.id)"
            />
          </span>
          <span class="col-check">
            <input
              type="checkbox"
              :checked="room.isExtra"
              class="w-4 h-4 cursor-pointer accent-amber-500"
              @change="toggleExtra(room.id)"
            />
          </span>
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
         STEP 2 — Assign Extra Beds
    ═══════════════════════════════════════════════════════════════ -->
    <template v-if="isHotel && step === 2">
      <div class="step-header">
        <div class="badge">2</div>
        <div>
          <p class="step-title">Extra Bed Assignment</p>
          <p class="step-sub">
            Assign extra beds to main rooms. Quota: {{ extraCount }}.
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
         STEP 3 — Child Breakfast
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
         STEP 4 (Hotel) / STEP 1 (Attraction) — Passenger Names
         Multi-select with comma-joined Name line
    ═══════════════════════════════════════════════════════════════ -->
    <template v-if="(isHotel && step === 4) || (!isHotel && step === 1)">
      <!-- Line Copy button for attractions -->
      <div
        v-if="!isHotel && step == 1"
        @click="showLine"
        class="w-full text-center py-4 border border-gray-400 rounded-2xl bg-orange-600 text-white cursor-pointer"
      >
        Line Copy
      </div>

      <div class="step-header">
        <div
          :class="[
            'badge',
            selectedPassportNames.length > 0 ? 'badge-done' : '',
          ]"
        >
          <svg
            v-if="selectedPassportNames.length > 0"
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
          <p class="step-title">Passenger Names</p>
          <p class="step-sub">
            Select one or more names — all will appear comma-separated under
            Booking Code.
          </p>
        </div>
      </div>

      <div class="card">
        <!-- Manual input -->
        <p class="label-sm" style="margin-bottom: 4px">
          Type a name or select below
        </p>
        <div class="name-input-row">
          <input
            type="text"
            class="text-input"
            placeholder="e.g. John Smith"
            v-model="nameInputValue"
            @keydown.enter.prevent="addTypedName"
          />
          <button class="btn-add-name" @click="addTypedName">+ Add</button>
        </div>

        <!-- Quick-select pills -->
        <p class="label-sm" style="margin-top: 12px; margin-bottom: 8px">
          Quick select (tap to toggle):
        </p>
        <div style="display: flex; flex-wrap: wrap; gap: 6px">
          <button
            v-for="p in allPassports"
            :key="p"
            :class="[
              'pill',
              selectedPassportNames.includes(p) ? 'pill-active' : '',
            ]"
            @click="togglePassportName(p)"
          >
            {{ p === bookingCustomerName ? "★ " : "" }}{{ p }}
            <span v-if="selectedPassportNames.includes(p)" class="pill-check"
              >✓</span
            >
          </button>
        </div>

        <!-- Selected names preview -->
        <div
          v-if="selectedPassportNames.length > 0"
          class="selected-names-preview"
        >
          <p class="label-sm" style="margin-bottom: 6px">
            Selected ({{ selectedPassportNames.length }}):
          </p>
          <div class="selected-chips">
            <div
              v-for="(name, idx) in selectedPassportNames"
              :key="name"
              class="selected-chip"
            >
              {{ name }}
              <button
                class="chip-remove"
                @click="selectedPassportNames.splice(idx, 1)"
              >
                ×
              </button>
            </div>
          </div>
          <p class="names-joined-preview">
            <span class="label-sm">Name line: </span>
            <span class="names-joined-text">{{ selectedNamesString }}</span>
          </p>
        </div>
      </div>

      <div class="actions">
        <button v-if="isHotel" class="btn-secondary" @click="step = 3">
          ← Back
        </button>
        <button
          class="btn-primary"
          :disabled="selectedPassportNames.length === 0"
          :class="{
            'opacity-40 cursor-not-allowed': selectedPassportNames.length === 0,
          }"
          @click="goToEmail"
        >
          Generate email →
        </button>
      </div>
    </template>

    <!-- Pricing loading indicator -->
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
         STEP 5 (Hotel) / STEP 2 (Attraction) — Email Editor
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
          <p class="step-sub">
            Edit recipients, subject and body before sending.
          </p>
        </div>
      </div>

      <!-- ── Recipients ── -->
      <div class="email-field-block">
        <div class="email-field-label">To</div>
        <div class="recipients-wrap">
          <div
            v-for="(addr, idx) in editableRecipients"
            :key="idx"
            class="recipient-chip"
          >
            {{ addr }}
            <button
              class="chip-remove"
              @click="editableRecipients.splice(idx, 1)"
            >
              ×
            </button>
          </div>
          <input
            v-model="newRecipient"
            class="recipient-input"
            type="email"
            placeholder="Add email…"
            @keydown.enter.prevent="addRecipient"
            @keydown.188.prevent="addRecipient"
          />
          <button class="chip-add-btn" @click="addRecipient">+</button>
        </div>
      </div>

      <!-- ── Subject ── -->
      <div class="email-field-block">
        <div class="email-field-label">Subject</div>
        <input
          v-model="editableSubject"
          class="subject-input"
          type="text"
          placeholder="Email Subject"
        />
      </div>

      <!-- ── Sender selector ── -->
      <div class="email-field-block" style="padding: 8px 12px">
        <select
          v-model="editableSender"
          class="text-[10px] border border-gray-200 px-2 py-1 rounded-lg w-full"
        >
          <option value="hotel">From: negyi.partnership@</option>
          <option value="default">From: noreply.system@</option>
        </select>
      </div>

      <!-- ── Body editor ── -->
      <div class="email-field-block">
        <!-- Toolbar -->
        <div class="editor-toolbar">
          <select
            class="tb-select"
            @change="
              execEditorCmd(
                'formatBlock',
                ($event.target as HTMLSelectElement).value,
              );
              ($event.target as HTMLSelectElement).value = 'p';
            "
          >
            <option value="p">Normal</option>
            <option value="h2">Heading</option>
            <option value="h3">Sub</option>
          </select>
          <span class="tb-sep" />
          <button
            class="tb-btn"
            title="Bold"
            @mousedown.prevent="execEditorCmd('bold')"
          >
            <b>B</b>
          </button>
          <button
            class="tb-btn"
            title="Italic"
            @mousedown.prevent="execEditorCmd('italic')"
          >
            <i>I</i>
          </button>
          <button
            class="tb-btn"
            title="Underline"
            @mousedown.prevent="execEditorCmd('underline')"
            style="text-decoration: underline"
          >
            U
          </button>
          <span class="tb-sep" />
          <button
            class="tb-btn"
            title="Ordered list"
            @mousedown.prevent="execEditorCmd('insertOrderedList')"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="10" y1="6" x2="21" y2="6" />
              <line x1="10" y1="12" x2="21" y2="12" />
              <line x1="10" y1="18" x2="21" y2="18" />
              <polyline points="3 6 4 5 4 10" />
              <path d="M3 16.5a2 1.5 0 0 1 4 0c0 .9-1 1.5-2 2.5H7" />
            </svg>
          </button>
          <button
            class="tb-btn"
            title="Bullet list"
            @mousedown.prevent="execEditorCmd('insertUnorderedList')"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="9" y1="6" x2="20" y2="6" />
              <line x1="9" y1="12" x2="20" y2="12" />
              <line x1="9" y1="18" x2="20" y2="18" />
              <circle cx="4" cy="6" r="1.5" fill="currentColor" />
              <circle cx="4" cy="12" r="1.5" fill="currentColor" />
              <circle cx="4" cy="18" r="1.5" fill="currentColor" />
            </svg>
          </button>
          <span class="tb-sep" />
          <button
            class="tb-btn"
            title="Undo"
            @mousedown.prevent="execEditorCmd('undo')"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 .49-4.99" />
            </svg>
          </button>
          <button
            class="tb-btn"
            title="Redo"
            @mousedown.prevent="execEditorCmd('redo')"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-.49-4.99" />
            </svg>
          </button>
          <span class="tb-sep" />
          <button
            class="tb-btn"
            title="Clear formatting"
            style="font-size: 10px; font-weight: 700"
            @mousedown.prevent="execEditorCmd('removeFormat')"
          >
            T×
          </button>
        </div>

        <!-- Contenteditable body -->
        <div
          ref="editorRef"
          class="editor-body"
          contenteditable="true"
          spellcheck="true"
          @input="onEditorInput"
        />

        <div class="editor-footer">
          <span class="char-count"
            >{{ editorCharCount.toLocaleString() }} chars</span
          >
          <span class="editor-hint">Editable — changes reflected in send</span>
        </div>
      </div>

      <!-- Success banner -->
      <div
        v-if="emailSentSuccess"
        class="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center gap-2"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Email sent successfully to {{ editableRecipients.join(", ") }}
      </div>

      <!-- Error banner -->
      <div
        v-if="emailSendError"
        class="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
      >
        {{ emailSendError }}
      </div>

      <!-- Actions -->
      <div class="actions">
        <button class="btn-secondary" @click="step = isHotel ? 4 : 1">
          ← Edit names
        </button>

        <button
          :class="['copy-body-btn', copied.body ? 'copy-body-done' : '']"
          @click="copyBody"
        >
          {{ copied.body ? "✓ Copied!" : "Copy body" }}
        </button>

        <button
          class="send-email-btn"
          :class="{ sending: emailSending }"
          :disabled="emailSending || editableRecipients.length === 0"
          @click="sendEmailFromWizard"
        >
          <svg
            v-if="emailSending"
            class="animate-spin"
            style="
              width: 12px;
              height: 12px;
              display: inline;
              margin-right: 4px;
            "
            fill="none"
            viewBox="0 0 24 24"
          >
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
          <svg
            v-else
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            style="display: inline; margin-right: 4px"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          {{ emailSending ? "Sending…" : "Send Email" }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from "vue";
import { format } from "date-fns";
import { useHotelStore } from "../../stores/hotel";
import { useGroupStore } from "../../stores/group";
import { useReservationStore } from "../../stores/reservation";
import { useRoute } from "vue-router";
import Swal from "sweetalert2";

const hotelStore = useHotelStore();
const groupStore = useGroupStore();
const reservationStore = useReservationStore();
const route = useRoute();

const itemPricingData = ref<Record<string, any>>({});
const pricingLoading = ref(false);
const passportLoading = ref(false);
const fetchedPassportNames = ref<string[]>([]);

// ── Send email state ─────────────────────────────────────────────────────────
const emailSending = ref(false);
const emailSentSuccess = ref(false);
const emailSendError = ref("");

const props = defineProps<{
  detail: Record<string, any>;
  activeTag: string;
  showLine: Function;
}>();

// ── Hotel vs Attraction ──────────────────────────────────────────────────────
const isHotel = computed(() => {
  const first = props.detail?.items?.[0];
  if (!first) return true;
  return first.product_type !== "App\\Models\\EntranceTicket";
});

const totalSteps = computed(() => (isHotel.value ? 5 : 2));
const step = ref(1);

function goToEmail() {
  if (selectedPassportNames.value.length === 0) return;
  emailSentSuccess.value = false;
  emailSendError.value = "";
  step.value = isHotel.value ? 5 : 2;
}

// ── WizardRoom ────────────────────────────────────────────────────────────────
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
  isMain: boolean;
  isExtra: boolean;
  isBfast: boolean;
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
  if (discountDays.length === 0) return "";
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

function toggleMain(id: number) {
  const r = rooms.value.find((x) => x.id === id);
  if (r) r.isMain = !r.isMain;
}
function toggleExtra(id: number) {
  const r = rooms.value.find((x) => x.id === id);
  if (!r) return;
  r.isExtra = !r.isExtra;
  if (!r.isExtra) r.isBfast = false;
}
function toggleBfast(id: number) {
  const r = rooms.value.find((x) => x.id === id);
  if (r) r.isBfast = !r.isBfast;
}

const mainCount = computed(() =>
  rooms.value.filter((r) => r.isMain).reduce((s, r) => s + r.quantity, 0),
);
const extraCount = computed(() =>
  rooms.value.filter((r) => r.isExtra).reduce((s, r) => s + r.quantity, 0),
);
const bfastCount = computed(() =>
  rooms.value.filter((r) => r.isBfast).reduce((s, r) => s + r.quantity, 0),
);
const mainRooms = computed(() => rooms.value.filter((r) => r.isMain));

const totalExtraUsed = computed(() =>
  mainRooms.value.reduce((s, r) => s + r.extraBed, 0),
);
function canAddExtra(room: WizardRoom): boolean {
  return totalExtraUsed.value < extraCount.value;
}
function changeExtra(id: number, delta: number) {
  const room = rooms.value.find((r) => r.id === id);
  if (!room) return;
  const next = room.extraBed + delta;
  if (next < 0 || (delta > 0 && !canAddExtra(room))) return;
  room.extraBed = next;
}

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

// ── Passport / Multi-name ─────────────────────────────────────────────────────
const bookingCustomerName = computed(() => props.detail?.customer_name ?? "");
const allPassports = computed((): string[] => {
  const names = new Set<string>();
  if (bookingCustomerName.value) names.add(bookingCustomerName.value);
  (props.detail?.questionnaire?.passport_names ?? []).forEach((n: string) =>
    names.add(n),
  );
  fetchedPassportNames.value.forEach((n) => names.add(n));
  return Array.from(names);
});

// Multi-select: array of chosen names
const selectedPassportNames = ref<string[]>([]);

// Comma-joined string used in email body
const selectedNamesString = computed(() =>
  selectedPassportNames.value.join(", "),
);

function togglePassportName(name: string) {
  const idx = selectedPassportNames.value.indexOf(name);
  if (idx === -1) {
    selectedPassportNames.value.push(name);
  } else {
    selectedPassportNames.value.splice(idx, 1);
  }
}

// Manual typed name add
const nameInputValue = ref("");
function addTypedName() {
  const val = nameInputValue.value.trim();
  if (!val) return;
  if (!selectedPassportNames.value.includes(val)) {
    selectedPassportNames.value.push(val);
  }
  nameInputValue.value = "";
}

// ── Email recipients (computed source) ────────────────────────────────────────
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

// ── Email subject (computed source) ──────────────────────────────────────────
const emailSubject = computed(() => {
  const item = props.detail?.items?.[0];
  if (!item) return "";
  const dateStr = item.service_date || item.checkin_date;
  const crmId = props.detail.booking_crm_id || props.detail.crm_id;
  return `Booking for ${format(new Date(dateStr), "dd MMMM, yyyy")}: ${crmId}`;
});

// ── Email body (plain-text source — used to seed the editor) ─────────────────
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
    const allowment = props.detail?.items?.[0]?.product?.allowment;
    const partnerLink = allowment
      ? `Partner Web Link  : https://partners.thanywhere.com/bookings?id=${props.detail?.id}`
      : null;

    const roomBlocks = mainRooms.value
      .map((item, idx) => {
        const nights = daysBetween(item.checkin_date, item.checkout_date);
        const discountNote = buildPartnerDiscountNote(item);
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
          discountNote || null,
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
Name : ${selectedNamesString.value}

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
Name : ${selectedNamesString.value}

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

// ── Editable email fields (live editor state) ─────────────────────────────────
const editorRef = ref<HTMLElement | null>(null);
const editableRecipients = ref<string[]>([]);
const editableSubject = ref("");
const editableSender = ref("hotel");
const newRecipient = ref("");
const editorCharCount = ref(0);

// Seed editable fields when arriving at the email step
watch(
  () => step.value,
  async (s) => {
    const isEmailStep = isHotel.value ? s === 5 : s === 2;
    if (!isEmailStep) return;
    emailSentSuccess.value = false;
    emailSendError.value = "";
    editableRecipients.value = [...emailRecipients.value];
    editableSubject.value = emailSubject.value;
    await nextTick();
    if (editorRef.value) {
      editorRef.value.innerHTML = plainTextToHtml(emailBody.value);
      editorCharCount.value = editorRef.value.innerText.length;
    }
  },
);

// function plainTextToHtml(text: string): string {
//   return text
//     .split("\n")
//     .map((line) => {
//       const escaped = line
//         .replace(/&/g, "&amp;")
//         .replace(/</g, "&lt;")
//         .replace(/>/g, "&gt;");
//       return `<p>${escaped === "" ? "&nbsp;" : escaped}</p>`;
//     })
//     .join("");
// }

function plainTextToHtml(text: string): string {
  return text
    .split("\n")
    .map((line) => {
      const escaped = line
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return `<p>${escaped === "" ? "" : escaped}</p>`;
    })
    .join("");
}

function addRecipient() {
  const val = newRecipient.value.trim();
  if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return;
  editableRecipients.value.push(val);
  newRecipient.value = "";
}

function execEditorCmd(cmd: string, val?: string) {
  editorRef.value?.focus();
  document.execCommand(cmd, false, val ?? undefined);
  editorCharCount.value = editorRef.value?.innerText.length ?? 0;
}

function onEditorInput() {
  editorCharCount.value = editorRef.value?.innerText.length ?? 0;
}

// ── Send email ────────────────────────────────────────────────────────────────
async function sendEmailFromWizard() {
  if (editableRecipients.value.length === 0) return;

  const confirmed = await Swal.fire({
    title: "Send Booking Email?",
    html: `Send to: <b>${editableRecipients.value.join(", ")}</b>`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#FF6300",
    cancelButtonColor: "#C69B92",
    confirmButtonText: "Send",
  });
  if (!confirmed.isConfirmed) return;

  try {
    emailSending.value = true;
    emailSentSuccess.value = false;
    emailSendError.value = "";

    const groupId = props.detail?.items[0]?.group_id;
    // Use live editor HTML — preserves any edits the user made
    const htmlBody = editorRef.value?.innerHTML
      ? `<pre style="font-family:inherit;font-size:13px;line-height:1.7;white-space:pre-wrap;">${editorRef.value.innerText}</pre>`
      : `<pre style="font-family:inherit;font-size:13px;line-height:1.7;white-space:pre-wrap;">${emailBody.value}</pre>`;

    const frmData = new FormData();
    frmData.append("mail_tos", editableRecipients.value.join(","));
    frmData.append("mail_subject", editableSubject.value);
    frmData.append("mail_body", htmlBody);
    frmData.append("email_type", "booking");
    frmData.append("mail_sender", editableSender.value);

    const res = await reservationStore.emailSendReservation(groupId, frmData);

    if (res?.status === 1) {
      emailSentSuccess.value = true;
    } else {
      emailSendError.value =
        res?.message ?? "Failed to send email. Please try again.";
    }
  } catch (err) {
    console.error("Send email error:", err);
    emailSendError.value = "An error occurred while sending. Please try again.";
  } finally {
    emailSending.value = false;
  }
}

// ── Navigation ────────────────────────────────────────────────────────────────
const goToBooking = (room: any) => {
  window.open(
    `/products-v2/hotel/edit/${room.room?.hotel?.id}?room_id=${room.room?.id}&quiteSwitch=11`,
    "_blank",
  );
};

// ── Copy helpers ──────────────────────────────────────────────────────────────
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

// async function copyBody() {
//   // Copy the live editor plain text (reflects any user edits)
//   const text = editorRef.value?.innerText ?? emailBody.value;
//   await copyText(text, "body");
// }

async function copyBody() {
  let text: string;

  if (editorRef.value) {
    // Extract each <p> as a single line, avoiding double-newlines from innerText
    const paragraphs = editorRef.value.querySelectorAll("p");
    if (paragraphs.length > 0) {
      text = Array.from(paragraphs)
        .map((p) =>
          p.innerText === "\n" || p.innerText === "" ? "" : p.innerText,
        )
        .join("\n");
    } else {
      text = editorRef.value.innerText;
    }
  } else {
    text = emailBody.value;
  }

  await copyText(text, "body");
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

// ── Fetch passports ───────────────────────────────────────────────────────────
const fetchPassports = async () => {
  const groupId = props.detail?.items[0]?.group_id;
  if (!groupId) return;
  try {
    passportLoading.value = true;
    const response = await groupStore.groupDocumentList(groupId, {
      document_type: "passport",
    });
    if (response?.result) {
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
  await fetchPassports();

  // Auto-select the booking customer name as default
  if (bookingCustomerName.value) {
    selectedPassportNames.value = [bookingCustomerName.value];
  }

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

/* ── Progress bar ──────────────────────────────────────────── */
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

/* ── Step header ───────────────────────────────────────────── */
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

/* ── Summary chips ─────────────────────────────────────────── */
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
  @apply bg-gray-50   border-gray-200  text-gray-600;
}
.chip-extra {
  @apply bg-amber-50  border-amber-200 text-amber-700;
}
.chip-bfast {
  @apply bg-emerald-50 border-emerald-200 text-emerald-700;
}
.chip-dot {
  @apply w-2 h-2 rounded-full flex-shrink-0;
}

/* ── Room table ────────────────────────────────────────────── */
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
}
.row-bfast {
  background: #ecfdf5;
}
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
  @apply text-[10px] text-gray-800 px-1.5 py-0.5;
}

/* ── Quota bar ─────────────────────────────────────────────── */
.quota-bar {
  @apply flex gap-4 text-xs text-gray-500 bg-gray-50 border border-gray-200
         rounded-lg px-3 py-2 mb-3;
}
.quota-bar b {
  @apply text-[#FF613c];
}

/* ── Card ──────────────────────────────────────────────────── */
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

/* ── Counter ───────────────────────────────────────────────── */
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

/* ── Name step ─────────────────────────────────────────────── */
.name-input-row {
  @apply flex gap-2 items-center;
}
.text-input {
  @apply flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900
         focus:outline-none focus:ring-2 focus:ring-[#FF613c];
}
.btn-add-name {
  @apply bg-[#FF613c] text-white px-3 py-2 rounded-lg text-xs font-medium
         hover:bg-[#e55139] transition-colors cursor-pointer border-none flex-shrink-0;
}
.pill {
  @apply px-3 py-1 rounded-full text-xs border transition-all cursor-pointer
         bg-gray-50 text-gray-500 border-gray-200
         hover:border-[#FF613c] hover:text-[#FF613c]
         flex items-center gap-1;
}
.pill-active {
  @apply bg-[#FF613c] text-white border-[#FF613c];
}
.pill-check {
  @apply text-[10px] font-bold;
}
.selected-names-preview {
  @apply mt-3 pt-3 border-t border-gray-100;
}
.selected-chips {
  @apply flex flex-wrap gap-1.5 mb-2;
}
.selected-chip {
  @apply inline-flex items-center gap-1 px-2.5 py-1 rounded-full
         bg-[#FF613c] text-white text-[11px] font-medium;
}
.chip-remove {
  @apply bg-transparent border-none text-white/70 cursor-pointer text-sm
         leading-none p-0 hover:text-white ml-0.5;
}
.names-joined-preview {
  @apply text-xs text-gray-500 bg-gray-50 border border-gray-200
         rounded-lg px-3 py-2 leading-relaxed;
}
.names-joined-text {
  @apply text-gray-800 font-medium;
}

/* ── Actions ───────────────────────────────────────────────── */
.actions {
  @apply flex gap-2 mt-4 flex-wrap;
}
.btn-primary {
  @apply bg-[#FF613c] text-white px-5 py-2 rounded-full text-sm font-medium
         hover:bg-[#e55139] transition-colors disabled:opacity-40
         disabled:cursor-not-allowed cursor-pointer;
}
.btn-secondary {
  @apply bg-gray-100 text-gray-700 border border-gray-200 px-5 py-2 rounded-full text-sm
         hover:bg-gray-200 transition-colors cursor-pointer;
}

/* ── Email field blocks ────────────────────────────────────── */
.email-field-block {
  @apply border border-gray-200 rounded-xl overflow-hidden;
}
.email-field-label {
  @apply text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-3 pt-2 pb-0;
}
.recipients-wrap {
  @apply flex flex-wrap items-center gap-1.5 px-3 pb-2.5 pt-1.5 min-h-[44px];
}
.recipient-chip {
  @apply inline-flex items-center gap-1 px-2.5 py-1 rounded-full
         bg-[#FF613c] text-white text-[11px] font-medium;
}
.recipient-input {
  @apply border-none outline-none text-xs text-gray-700 bg-transparent
         flex-1 min-w-[120px];
}
.chip-add-btn {
  @apply w-5 h-5 rounded-full bg-[#FF613c] text-white border-none cursor-pointer
         text-base flex items-center justify-center hover:bg-[#e55139] transition-colors
         flex-shrink-0 leading-none;
}
.subject-input {
  @apply w-full border-none outline-none text-sm text-gray-900 px-3 py-2.5 bg-transparent;
}

/* ── Rich-text editor ──────────────────────────────────────── */
.editor-toolbar {
  @apply flex items-center gap-0.5 px-2.5 py-1.5 bg-gray-50
         border-b border-gray-200 flex-wrap;
}
.tb-btn {
  @apply w-7 h-7 border-none bg-transparent rounded-md cursor-pointer text-[13px]
         flex items-center justify-center text-gray-500
         hover:bg-gray-200 transition-colors;
}
.tb-sep {
  @apply w-px h-4 bg-gray-200 mx-1;
}
.tb-select {
  @apply border border-gray-200 rounded-md text-[11px] px-1.5 py-1
         bg-white text-gray-700 outline-none cursor-pointer h-[26px];
}
.editor-body {
  @apply min-h-[260px] max-h-[420px] overflow-y-auto px-3.5 py-3
         text-xs leading-relaxed text-gray-700 outline-none;
}
.editor-body:focus {
  @apply bg-gray-50/40;
}
.editor-body :deep(p) {
  @apply mb-0.5;
}
.editor-body :deep(strong) {
  @apply font-semibold;
}
.editor-body :deep(h2) {
  @apply text-sm font-semibold mt-2 mb-1;
}
.editor-body :deep(h3) {
  @apply text-xs font-semibold mt-1.5 mb-0.5;
}
.editor-body :deep(ul) {
  @apply list-disc pl-4 my-1;
}
.editor-body :deep(ol) {
  @apply list-decimal pl-4 my-1;
}

.editor-footer {
  @apply flex items-center justify-between px-3 py-1.5
         bg-gray-50 border-t border-gray-200;
}
.char-count {
  @apply text-[11px] text-gray-400;
}
.editor-hint {
  @apply text-[11px] text-gray-400;
}

/* ── Copy / Send buttons ───────────────────────────────────── */
.copy-body-btn {
  @apply px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors
         bg-[#FF613c] text-white hover:bg-[#e55139] border-none;
}
.copy-body-btn.copy-body-done {
  @apply bg-green-500;
}

.send-email-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  border: none;
  background: #2563eb;
  color: #fff;
}
.send-email-btn:hover:not(:disabled) {
  background: #1d4ed8;
}
.send-email-btn.sending {
  background: #93c5fd;
}
.send-email-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.opacity-40 {
  opacity: 0.4;
}
.cursor-not-allowed {
  cursor: not-allowed;
}
</style>
