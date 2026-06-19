<script setup>
import Layout from "./Layout.vue";
import { ref, computed, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useCityStore } from "../stores/city";
import { useCarStore } from "../stores/car";
import { useSupplierStore } from "../stores/supplier";
import { useVantourStore } from "../stores/vantour";

const props = defineProps({
  id: { type: [String, Number], default: null },
});

const toast = useToast();
const router = useRouter();
const route = useRoute();

const cityStore = useCityStore();
const carStore = useCarStore();
const supplierStore = useSupplierStore();
const vantourStore = useVantourStore();

const { cities } = storeToRefs(cityStore);
const { cars } = storeToRefs(carStore);
const { suppliers } = storeToRefs(supplierStore);

// ── Mode detection ────────────────────────────────────────────────────────────
// Works whether you pass :id as a prop OR use /van-tours/:id route param
const recordId = computed(() => props.id ?? route.query.id ?? null);
const isEdit = computed(() => !!recordId.value);

// ── Lists ─────────────────────────────────────────────────────────────────────
const cityList = ref([]);
const carList = ref([]);
const supplierList = ref([]);

const typeList = [
  { label: "Car Rental", value: "car_rental" },
  { label: "Van Tour", value: "van_tour" },
];

// ── Form state ────────────────────────────────────────────────────────────────
const form = ref({
  name: "",
  sku_code: "",
  type: "car_rental",
  city_ids: [],
  is_show: true,
});

const prices = ref([]); // { car_id, car_name, price, agent_price, cost }
const supplierCosts = ref([]); // { supplier_id, supplier_name, car_id, car_name, cost, extra_mile_price }

const priceRow = ref({ car_id: "", price: "", agent_price: "", cost: "" });
const supplierRow = ref({
  supplier_id: "",
  car_id: "",
  cost: "",
  extra_mile_price: "",
});

const errors = ref({});
const submitting = ref(false);
const pageLoading = ref(false);

// ── Lookup helpers ────────────────────────────────────────────────────────────
const carName = (id) =>
  carList.value.find((c) => c.id == id)?.name ?? `Car #${id}`;
const supplierName = (id) =>
  supplierList.value.find((s) => s.id == id)?.name ?? `Supplier #${id}`;

// ── Price rows ────────────────────────────────────────────────────────────────
const addPrice = () => {
  if (!priceRow.value.car_id) return;
  prices.value.push({
    ...priceRow.value,
    car_name: carName(priceRow.value.car_id),
  });
  priceRow.value = { car_id: "", price: "", agent_price: "", cost: "" };
};
const removePrice = (i) => prices.value.splice(i, 1);

// ── Supplier cost rows ────────────────────────────────────────────────────────
const addSupplierCost = () => {
  if (!supplierRow.value.supplier_id || !supplierRow.value.car_id) return;
  supplierCosts.value.push({
    ...supplierRow.value,
    supplier_name: supplierName(supplierRow.value.supplier_id),
    car_name: carName(supplierRow.value.car_id),
  });
  supplierRow.value = {
    supplier_id: "",
    car_id: "",
    cost: "",
    extra_mile_price: "",
  };
};
const removeSupplierCost = (i) => supplierCosts.value.splice(i, 1);

// ── Load detail for edit mode ─────────────────────────────────────────────────
const loadDetail = async () => {
  pageLoading.value = true;
  try {
    const res = await vantourStore.getDetailAction(recordId.value);
    const d = res.result;

    form.value = {
      name: d.name ?? "",
      sku_code: d.sku_code ?? "",
      type: d.type ?? "car_rental",
      city_ids: (d.cities ?? []).map((c) => c.id),
      is_show: d.is_show ?? true,
    };

    prices.value = (d.cars ?? []).map((car) => ({
      car_id: car.id,
      car_name: car.name,
      price: car.price ?? "",
      agent_price: car.agent_price ?? "",
      cost: car.cost ?? "",
    }));

    supplierCosts.value = (d.supplier_cost ?? []).map((sc) => ({
      supplier_id: sc.supplier_id,
      supplier_name: supplierName(sc.supplier_id),
      car_id: sc.car_id,
      car_name: carName(sc.car_id),
      cost: sc.cost ?? "",
      extra_mile_price: sc.extra_mile_price ?? "",
    }));
  } catch (err) {
    toast.error("Failed to load van tour.");
  } finally {
    pageLoading.value = false;
  }
};

// ── Submit ────────────────────────────────────────────────────────────────────
const onSubmit = async () => {
  errors.value = {};
  if (!form.value.name.trim()) {
    errors.value.name = "Name is required.";
    return;
  }

  const fd = new FormData();
  if (isEdit.value) fd.append("_method", "PUT");

  fd.append("name", form.value.name);
  fd.append("type", form.value.type);
  fd.append("is_show", form.value.is_show ? 1 : 0);
  if (form.value.sku_code) fd.append("sku_code", form.value.sku_code);

  form.value.city_ids.forEach((id, i) => fd.append(`city_ids[${i}]`, id));

  prices.value.forEach((p, i) => {
    fd.append(`car_ids[${i}]`, p.car_id);
    fd.append(`prices[${i}]`, p.price);
    fd.append(`agent_prices[${i}]`, p.agent_price);
    fd.append(`costs[${i}]`, p.cost);
  });

  supplierCosts.value.forEach((sc, i) => {
    fd.append(`supplier_cost[${i}][supplier_id]`, sc.supplier_id);
    fd.append(`supplier_cost[${i}][car_id]`, sc.car_id);
    fd.append(`supplier_cost[${i}][cost]`, sc.cost);
    fd.append(`supplier_cost[${i}][extra_mile_price]`, sc.extra_mile_price);
  });

  try {
    submitting.value = true;
    const res = isEdit.value
      ? await vantourStore.updateAction(fd, recordId.value)
      : await vantourStore.addNewAction(fd);

    toast.success(res.message ?? (isEdit.value ? "Updated." : "Created."));
    if (!isEdit.value) router.back();
  } catch (err) {
    const data = err?.response?.data;
    if (data?.errors) errors.value = data.errors;
    toast.error(data?.message ?? "Something went wrong.");
  } finally {
    submitting.value = false;
  }
};

// ── Mount ─────────────────────────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([
    cityStore.getSimpleListAction(),
    carStore.getSimpleListAction(),
    supplierStore.getSimpleListAction(),
  ]);
  cityList.value = cities.value?.data ?? [];
  carList.value = cars.value?.data ?? [];
  supplierList.value = suppliers.value?.data ?? [];

  // After lists are ready, load detail so supplier/car names resolve correctly
  if (isEdit.value) await loadDetail();
});
</script>

<template>
  <Layout>
    <!-- Page loading skeleton -->
    <div v-if="pageLoading" class="max-w-3xl mx-auto py-8 px-4 space-y-5">
      <div
        v-for="n in 3"
        :key="n"
        class="bg-white rounded-xl border border-gray-100 shadow-sm p-6 animate-pulse"
      >
        <div class="h-3 w-24 bg-gray-100 rounded mb-5"></div>
        <div class="space-y-3">
          <div class="h-10 bg-gray-100 rounded-lg"></div>
          <div class="grid grid-cols-2 gap-4">
            <div class="h-10 bg-gray-100 rounded-lg"></div>
            <div class="h-10 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="max-w-3xl mx-auto py-8 px-4">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-widest text-[#FF613c] mb-1"
          >
            {{ isEdit ? "Edit Product" : "New Product" }}
          </p>
          <h1 class="text-2xl font-semibold text-gray-800">
            {{ isEdit ? "Update Van Tour" : "Create Van Tour" }}
          </h1>
        </div>
        <button
          @click.prevent="onSubmit"
          :disabled="submitting"
          class="inline-flex items-center gap-2 bg-[#FF613c] hover:bg-[#e5522f] disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          <svg
            v-if="submitting"
            class="w-4 h-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          {{ submitting ? "Saving…" : isEdit ? "Update" : "Save" }}
        </button>
      </div>

      <div class="space-y-5">
        <!-- ── Basic Info ── -->
        <section
          class="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
        >
          <h2
            class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-5"
          >
            Basic Info
          </h2>

          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="field-label"
                >Name <span class="text-red-500">*</span></label
              >
              <input
                v-model="form.name"
                type="text"
                placeholder="e.g. Bangkok City Tour"
                class="input-field"
                :class="errors.name ? 'border-red-400' : 'border-gray-200'"
              />
              <p v-if="errors.name" class="mt-1 text-xs text-red-500">
                {{ errors.name }}
              </p>
            </div>

            <div>
              <label class="field-label"
                >SKU Code
                <span class="text-gray-400 font-normal">(optional)</span></label
              >
              <input
                v-model="form.sku_code"
                type="text"
                placeholder="e.g. BKK-001"
                class="input-field border-gray-200"
              />
            </div>

            <div>
              <label class="field-label">Type</label>
              <select
                v-model="form.type"
                class="input-field border-gray-200 bg-white"
              >
                <option v-for="t in typeList" :key="t.value" :value="t.value">
                  {{ t.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="mt-4">
            <label class="field-label">Cities</label>
            <v-select
              v-model="form.city_ids"
              :options="cityList"
              label="name"
              :reduce="(c) => c.id"
              multiple
              :clearable="false"
              placeholder="Select cities…"
              class="style-chooser"
            />
          </div>

          <div class="mt-5 flex items-center gap-3">
            <button
              type="button"
              @click="form.is_show = !form.is_show"
              class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none"
              :class="form.is_show ? 'bg-[#FF613c]' : 'bg-gray-200'"
            >
              <span
                class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
                :class="form.is_show ? 'translate-x-4' : 'translate-x-1'"
              />
            </button>
            <span class="text-sm text-gray-700">Visible on website</span>
          </div>
        </section>

        <!-- ── Prices ── -->
        <section
          class="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
        >
          <h2
            class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-5"
          >
            Pricing by Car Type
          </h2>

          <div class="grid grid-cols-4 gap-3 mb-2">
            <div>
              <label class="field-label">Car</label>
              <v-select
                v-model="priceRow.car_id"
                :options="carList"
                label="name"
                :reduce="(c) => c.id"
                :clearable="false"
                placeholder="Select"
                class="style-chooser"
              />
            </div>
            <div>
              <label class="field-label">Selling Price</label>
              <input
                v-model="priceRow.price"
                type="number"
                placeholder="0"
                class="input-field border-gray-200"
              />
            </div>
            <div>
              <label class="field-label">Agent Price</label>
              <input
                v-model="priceRow.agent_price"
                type="number"
                placeholder="0"
                class="input-field border-gray-200"
              />
            </div>
            <div>
              <label class="field-label">Cost</label>
              <input
                v-model="priceRow.cost"
                type="number"
                placeholder="0"
                class="input-field border-gray-200"
              />
            </div>
          </div>

          <button
            @click.prevent="addPrice"
            :disabled="!priceRow.car_id"
            class="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#FF613c] disabled:opacity-40 hover:text-[#e5522f]"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add row
          </button>

          <div
            v-if="prices.length"
            class="border border-gray-100 rounded-lg overflow-hidden"
          >
            <table class="w-full text-sm">
              <thead
                class="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide"
              >
                <tr>
                  <th class="px-4 py-2.5 text-left">Car</th>
                  <th class="px-4 py-2.5 text-right">Selling</th>
                  <th class="px-4 py-2.5 text-right">Agent</th>
                  <th class="px-4 py-2.5 text-right">Cost</th>
                  <th class="px-4 py-2.5 w-8"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr
                  v-for="(p, i) in prices"
                  :key="i"
                  class="hover:bg-gray-50/50"
                >
                  <td class="px-4 py-2.5 font-medium text-gray-700">
                    {{ p.car_name }}
                  </td>
                  <td class="px-4 py-2.5 text-right text-gray-600">
                    {{ p.price || "—" }}
                  </td>
                  <td class="px-4 py-2.5 text-right text-gray-600">
                    {{ p.agent_price || "—" }}
                  </td>
                  <td class="px-4 py-2.5 text-right text-gray-600">
                    {{ p.cost || "—" }}
                  </td>
                  <td class="px-4 py-2.5 text-right">
                    <button
                      @click="removePrice(i)"
                      class="text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else class="text-xs text-gray-400 italic">No price rows yet.</p>
        </section>

        <!-- ── Supplier Cost ── -->
        <section
          class="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
        >
          <h2
            class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-5"
          >
            Supplier Cost
          </h2>

          <div class="grid grid-cols-4 gap-3 mb-2">
            <div>
              <label class="field-label">Supplier</label>
              <v-select
                v-model="supplierRow.supplier_id"
                :options="supplierList"
                label="name"
                :reduce="(s) => s.id"
                :clearable="false"
                placeholder="Select"
                class="style-chooser"
              />
            </div>
            <div>
              <label class="field-label">Car</label>
              <v-select
                v-model="supplierRow.car_id"
                :options="carList"
                label="name"
                :reduce="(c) => c.id"
                :clearable="false"
                placeholder="Select"
                class="style-chooser"
              />
            </div>
            <div>
              <label class="field-label">Cost</label>
              <input
                v-model="supplierRow.cost"
                type="number"
                placeholder="0"
                class="input-field border-gray-200"
              />
            </div>
            <div>
              <label class="field-label">Extra Mile</label>
              <input
                v-model="supplierRow.extra_mile_price"
                type="number"
                placeholder="0"
                class="input-field border-gray-200"
              />
            </div>
          </div>

          <button
            @click.prevent="addSupplierCost"
            :disabled="!supplierRow.supplier_id || !supplierRow.car_id"
            class="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#FF613c] disabled:opacity-40 hover:text-[#e5522f]"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add row
          </button>

          <div
            v-if="supplierCosts.length"
            class="border border-gray-100 rounded-lg overflow-hidden"
          >
            <table class="w-full text-sm">
              <thead
                class="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide"
              >
                <tr>
                  <th class="px-4 py-2.5 text-left">Supplier</th>
                  <th class="px-4 py-2.5 text-left">Car</th>
                  <th class="px-4 py-2.5 text-right">Cost</th>
                  <th class="px-4 py-2.5 text-right">Extra Mile</th>
                  <th class="px-4 py-2.5 w-8"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr
                  v-for="(sc, i) in supplierCosts"
                  :key="i"
                  class="hover:bg-gray-50/50"
                >
                  <td class="px-4 py-2.5 text-gray-700">
                    {{ sc.supplier_name }}
                  </td>
                  <td class="px-4 py-2.5 text-gray-700">{{ sc.car_name }}</td>
                  <td class="px-4 py-2.5 text-right text-gray-600">
                    {{ sc.cost || "—" }}
                  </td>
                  <td class="px-4 py-2.5 text-right text-gray-600">
                    {{ sc.extra_mile_price || "—" }}
                  </td>
                  <td class="px-4 py-2.5 text-right">
                    <button
                      @click="removeSupplierCost(i)"
                      class="text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else class="text-xs text-gray-400 italic">
            No supplier costs yet.
          </p>
        </section>

        <!-- Bottom save -->
        <div class="flex justify-end pt-2 pb-8">
          <button
            @click.prevent="onSubmit"
            :disabled="submitting"
            class="inline-flex items-center gap-2 bg-[#FF613c] hover:bg-[#e5522f] disabled:opacity-60 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            {{
              submitting
                ? "Saving…"
                : isEdit
                ? "Update Van Tour"
                : "Save Van Tour"
            }}
          </button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style scoped>
.field-label {
  @apply block text-xs font-medium text-gray-600 mb-1.5;
}
.input-field {
  @apply w-full h-10 border rounded-lg px-3 text-sm text-gray-800 placeholder-gray-400
         focus:outline-none focus:ring-2 focus:ring-[#FF613c]/30 focus:border-[#FF613c];
}
</style>

<style>
.style-chooser .vs__dropdown-toggle {
  border: 1px solid #e5e7eb;
  padding: 4px 6px;
  border-radius: 8px;
  min-height: 40px;
}
.style-chooser .vs__dropdown-menu .vs__dropdown-option--highlight {
  background: #ff613c;
}
.style-chooser .vs__dropdown-menu .vs__dropdown-option {
  padding: 8px 14px;
  font-size: 13px;
}
.style-chooser .vs__dropdown-toggle .vs__selected-options .vs__selected {
  padding: 2px 8px;
  border: none;
  background: #fff1ee;
  color: #ff613c;
  border-radius: 4px;
  font-size: 12px;
}
</style>
