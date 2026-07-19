<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @keydown.esc="close"
    >
      <!-- backdrop -->
      <div class="absolute inset-0 bg-slate-900/50" @click="close" />

      <!-- panel -->
      <div
        class="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <!-- header -->
        <div
          class="flex items-center justify-between border-b border-slate-100 px-6 py-4"
        >
          <div>
            <h2 class="text-lg font-semibold text-slate-800">
              {{ isEdit ? "Edit coupon" : "Create coupon" }}
            </h2>
            <p class="text-sm text-slate-400">
              {{
                isEdit
                  ? "Update the details of this coupon code."
                  : "Set up a new coupon code for customers."
              }}
            </p>
          </div>
          <button
            type="button"
            class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            @click="close"
          >
            <svg
              viewBox="0 0 24 24"
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 6l12 12M18 6 6 18"
              />
            </svg>
          </button>
        </div>

        <!-- body -->
        <form
          id="promo-form"
          class="flex-1 space-y-6 overflow-y-auto px-6 py-5"
          @submit.prevent="submit"
        >
          <!-- general error -->
          <div
            v-if="generalError"
            class="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-600"
          >
            {{ generalError }}
          </div>

          <!-- name + code -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <!-- image -->
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700"
                >Promo image</label
              >
              <div class="flex items-center gap-4">
                <div
                  v-if="imagePreview"
                  class="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200"
                >
                  <img
                    :src="imagePreview"
                    class="h-full w-full object-cover"
                    alt=""
                  />
                  <button
                    type="button"
                    class="absolute right-1 top-1 rounded-full bg-white/90 p-0.5 text-slate-500 hover:text-rose-500"
                    @click="clearImage"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      class="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 6l12 12M18 6 6 18"
                      />
                    </svg>
                  </button>
                </div>
                <input
                  ref="fileInputRef"
                  type="file"
                  accept="image/*"
                  class="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-600 hover:file:bg-indigo-100"
                  @change="handleImageChange"
                />
              </div>
              <p v-if="errors.image" class="mt-1 text-xs text-rose-500">
                {{ errors.image[0] }}
              </p>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700"
                >Promo name</label
              >
              <input
                v-model="form.promo_name"
                type="text"
                placeholder="Facebook Launch Promo"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
              <p v-if="errors.promo_name" class="mt-1 text-xs text-rose-500">
                {{ errors.promo_name[0] }}
              </p>
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700"
                >Coupon code</label
              >
              <input
                v-model="form.promo_code"
                type="text"
                placeholder="FBPOST50"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm uppercase tracking-wide focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                @input="form.promo_code = form.promo_code.toUpperCase()"
              />
              <p v-if="errors.promo_code" class="mt-1 text-xs text-rose-500">
                {{ errors.promo_code[0] }}
              </p>
            </div>
          </div>

          <!-- description -->
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700"
              >Description</label
            >
            <textarea
              v-model="form.promo_des"
              rows="2"
              placeholder="Given out on our Facebook launch post"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <!-- discount type + amount + count -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700"
                >Discount type</label
              >
              <select
                v-model="form.promo_type"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="fixed">Fixed amount</option>
                <option value="percent">Percentage</option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">
                Amount {{ form.promo_type === "percent" ? "(%)" : "" }}
              </label>
              <input
                v-model.number="form.promo_amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 10"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
              <p v-if="errors.promo_amount" class="mt-1 text-xs text-rose-500">
                {{ errors.promo_amount[0] }}
              </p>
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700"
                >Usage limit</label
              >
              <input
                v-model.number="form.promo_count"
                type="number"
                min="1"
                placeholder="e.g. 100"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
              <p v-if="errors.promo_count" class="mt-1 text-xs text-rose-500">
                {{ errors.promo_count[0] }}
              </p>
            </div>
          </div>

          <!-- dates -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700"
                >Start date (optional)</label
              >
              <input
                v-model="form.promo_start_date"
                type="datetime-local"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700"
                >Expiry date</label
              >
              <input
                v-model="form.promo_end_date"
                type="datetime-local"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
              <p
                v-if="errors.promo_end_date"
                class="mt-1 text-xs text-rose-500"
              >
                {{ errors.promo_end_date[0] }}
              </p>
            </div>
          </div>

          <!-- active toggle -->
          <label class="flex items-center gap-2">
            <input
              v-model="form.promo_active"
              type="checkbox"
              class="h-4 w-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-400"
            />
            <span class="text-sm font-medium text-slate-700">Active</span>
          </label>

          <!-- applies to -->
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700"
              >Applies to</label
            >
            <div class="flex gap-3">
              <button
                type="button"
                class="flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition"
                :class="
                  form.promo_applies_to === 'all'
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-600'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                "
                @click="form.promo_applies_to = 'all'"
              >
                All products
              </button>
              <button
                type="button"
                class="flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition"
                :class="
                  form.promo_applies_to === 'specific'
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-600'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                "
                @click="form.promo_applies_to = 'specific'"
              >
                Specific products
              </button>
            </div>
            <p
              v-if="errors.promo_applies_to"
              class="mt-1 text-xs text-rose-500"
            >
              {{ errors.promo_applies_to[0] }}
            </p>
          </div>

          <!-- specific product targeting -->
          <div
            v-if="form.promo_applies_to === 'specific'"
            class="space-y-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4"
          >
            <div v-for="type in productTypes" :key="type.key" class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-slate-700">{{
                  type.label
                }}</span>
                <label class="flex items-center gap-1.5 text-xs text-slate-500">
                  <input
                    type="checkbox"
                    class="h-3.5 w-3.5 rounded border-slate-300 text-indigo-500 focus:ring-indigo-400"
                    v-model="form[type.allField]"
                  />
                  All {{ type.label.toLowerCase() }}
                </label>
              </div>
              <input
                v-if="!form[type.allField]"
                v-model="type.idsInput.value"
                type="text"
                :placeholder="`Comma-separated ${type.label.toLowerCase()} IDs e.g. 3,7,9`"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <p
              v-if="
                errors.promo_applies_to === undefined && specificSelectionError
              "
              class="text-xs text-rose-500"
            >
              {{ specificSelectionError }}
            </p>
          </div>
        </form>

        <!-- footer -->
        <div
          class="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4"
        >
          <button
            type="button"
            class="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
            @click="close"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="promo-form"
            :disabled="saving"
            class="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              v-if="saving"
              class="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                stroke-width="3"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M12 3a9 9 0 0 1 9 9h-3a6 6 0 0 0-6-6V3Z"
              />
            </svg>
            {{ isEdit ? "Save changes" : "Create coupon" }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";

const props = defineProps({
  open: { type: Boolean, default: false },
  promo: { type: Object, default: null }, // if set, we're editing
  saving: { type: Boolean, default: false },
  errors: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["close", "submit"]);

const isEdit = computed(() => !!props.promo);

const productTypes = [
  { key: "hotel", label: "Hotels", allField: "all_hotels", idsInput: ref("") },
  {
    key: "entrance_ticket",
    label: "Entrance tickets",
    allField: "all_entrance_tickets",
    idsInput: ref(""),
  },
  {
    key: "vantour",
    label: "Van tours",
    allField: "all_vantours",
    idsInput: ref(""),
  },
  {
    key: "inclusive",
    label: "Group tours / Inclusive",
    allField: "all_inclusive",
    idsInput: ref(""),
  },
];

const defaultForm = () => ({
  promo_name: "",
  promo_des: "",
  promo_code: "",
  promo_type: "fixed",
  promo_amount: null,
  promo_count: 1,
  promo_active: true,
  promo_start_date: "",
  promo_end_date: "",
  promo_applies_to: "all",
  all_hotels: false,
  all_entrance_tickets: false,
  all_vantours: false,
  all_inclusive: false,
});

const form = reactive(defaultForm());
const generalError = ref("");

const specificSelectionError = computed(() => {
  if (form.promo_applies_to !== "specific") return "";
  const anyAll =
    form.all_hotels ||
    form.all_entrance_tickets ||
    form.all_vantours ||
    form.all_inclusive;
  const anyIds = productTypes.some((t) => t.idsInput.value.trim().length > 0);
  return anyAll || anyIds
    ? ""
    : "Select at least one product type or enter product IDs.";
});

const fileInputRef = ref(null);
const imageFile = ref(null); // newly selected File, or null
const imagePreview = ref(""); // existing image URL or local object URL
const removeExistingImage = ref(false); // true if user clears an existing image

function handleImageChange(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  imageFile.value = file;
  removeExistingImage.value = false;
  // revoke any previous blob preview to avoid leaks
  if (imagePreview.value?.startsWith("blob:")) {
    URL.revokeObjectURL(imagePreview.value);
  }
  imagePreview.value = URL.createObjectURL(file);
}

function clearImage() {
  imageFile.value = null;
  if (imagePreview.value?.startsWith("blob:")) {
    URL.revokeObjectURL(imagePreview.value);
  }
  imagePreview.value = "";
  removeExistingImage.value = true;
  if (fileInputRef.value) fileInputRef.value.value = "";
}

function resetForm() {
  Object.assign(form, defaultForm());
  productTypes.forEach((t) => (t.idsInput.value = ""));
  generalError.value = "";
  imageFile.value = null;
  if (imagePreview.value?.startsWith("blob:")) {
    URL.revokeObjectURL(imagePreview.value);
  }
  imagePreview.value = "";
  removeExistingImage.value = false;
  if (fileInputRef.value) fileInputRef.value.value = "";
}

// function resetForm() {
//   Object.assign(form, defaultForm());
//   productTypes.forEach((t) => (t.idsInput.value = ""));
//   generalError.value = "";
// }

function toDatetimeLocal(value) {
  if (!value) return "";
  // handles "2026-08-01 00:00:00" or ISO strings
  const d = new Date(value.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

watch(
  () => props.promo,
  (promo) => {
    if (!promo) {
      resetForm();
      return;
    }
    Object.assign(form, {
      promo_name: promo.promo_name ?? "",
      promo_des: promo.promo_des ?? "",
      promo_code: promo.promo_code ?? "",
      promo_type: promo.promo_type ?? "fixed",
      promo_amount: Number(promo.promo_amount ?? 0),
      promo_count: promo.promo_count ?? 1,
      promo_active: !!promo.promo_active,
      promo_start_date: toDatetimeLocal(promo.promo_start_date),
      promo_end_date: toDatetimeLocal(promo.promo_end_date),
      promo_applies_to: promo.promo_applies_to ?? "all",
      all_hotels: false,
      all_entrance_tickets: false,
      all_vantours: false,
      all_inclusive: false,
    });

    imageFile.value = null;
    removeExistingImage.value = false;
    imagePreview.value = promo.image_url || promo.image || "";

    const ap = promo.applicable_products || {};
    productTypes.forEach((t) => {
      const entry = ap[t.key];
      if (!entry) {
        t.idsInput.value = "";
        return;
      }
      const mode = entry.mode ?? (entry === "all" ? "all" : "specific_ids");
      const ids = entry.product_ids ?? (Array.isArray(entry) ? entry : []);
      if (mode === "all") {
        form[t.allField] = true;
        t.idsInput.value = "";
      } else {
        form[t.allField] = false;
        t.idsInput.value = ids.join(",");
      }
    });
  },
  { immediate: true },
);

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && !props.promo) resetForm();
  },
);

function close() {
  emit("close");
}

function parseIds(str) {
  return str
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length)
    .map(Number)
    .filter((n) => !Number.isNaN(n));
}

function submit() {
  generalError.value = "";

  if (form.promo_applies_to === "specific" && specificSelectionError.value) {
    generalError.value = specificSelectionError.value;
    return;
  }

  const fd = new FormData();

  fd.append("promo_name", form.promo_name);
  if (form.promo_des) fd.append("promo_des", form.promo_des);
  fd.append("promo_code", form.promo_code);
  fd.append("promo_type", form.promo_type);
  fd.append("promo_amount", form.promo_amount);
  fd.append("promo_count", form.promo_count);
  fd.append("promo_active", form.promo_active ? "1" : "0");
  if (form.promo_start_date) {
    fd.append(
      "promo_start_date",
      form.promo_start_date.replace("T", " ") + ":00",
    );
  }
  if (form.promo_end_date) {
    fd.append("promo_end_date", form.promo_end_date.replace("T", " ") + ":00");
  }
  fd.append("promo_applies_to", form.promo_applies_to);

  if (form.promo_applies_to === "specific") {
    fd.append("all_hotels", form.all_hotels ? "1" : "0");
    fd.append("all_entrance_tickets", form.all_entrance_tickets ? "1" : "0");
    fd.append("all_vantours", form.all_vantours ? "1" : "0");
    fd.append("all_inclusive", form.all_inclusive ? "1" : "0");

    const idFields = [
      ["hotel_ids", 0, form.all_hotels],
      ["entrance_ticket_ids", 1, form.all_entrance_tickets],
      ["vantour_ids", 2, form.all_vantours],
      ["inclusive_ids", 3, form.all_inclusive],
    ];
    idFields.forEach(([fieldName, idx, allFlag]) => {
      const ids = allFlag ? [] : parseIds(productTypes[idx].idsInput.value);
      ids.forEach((id) => fd.append(`${fieldName}[]`, id));
    });
  }

  // image: only append if a new file was picked
  if (imageFile.value) {
    fd.append("image", imageFile.value);
  }
  // let the backend know to clear an existing image, if you support that
  if (removeExistingImage.value) {
    fd.append("remove_image", "1");
  }

  // Laravel needs a method override when sending FormData via PUT/PATCH
  // if (isEdit.value) {
  //   fd.append("_method", "PUT");
  // }

  // console.log(imageFile.value);

  emit("submit", fd);
}
</script>
