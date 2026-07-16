<script setup>
import Layout from "./Layout.vue";
import { ref, computed, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useRouter, useRoute } from "vue-router";
import { useRoutePlanStore } from "../stores/routePlan.js";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import axios from "axios";

const props = defineProps({
  id: { type: [String, Number], default: null },
});

const toast = useToast();
const router = useRouter();
const route = useRoute();
const routePlanStore = useRoutePlanStore();

const editorOptions = { placeholder: "Write description…" };

// ── Mode ──────────────────────────────────────────────────────────────────────
const recordId = computed(() => props.id ?? route.query.id ?? null);
const isEdit = computed(() => !!recordId.value);

// ── Active left-tab ───────────────────────────────────────────────────────────
const activeTab = ref("description"); // description | locations | van_tours | photos

const tabs = [
  { key: "description", label: "Description" },
  { key: "locations", label: "Locations" },
  { key: "van_tours", label: "Van Tours" },
  { key: "photos", label: "Photos" },
];

// ── Lazy lists ────────────────────────────────────────────────────────────────
const cityList = ref([]);
const destinationList = ref([]);
const vanTourList = ref([]);
const cityLoading = ref(false);
const destLoading = ref(false);
const vtLoading = ref(false);

const loadCities = async () => {
  if (cityList.value.length || cityLoading.value) return;
  cityLoading.value = true;
  try {
    const r = await axios.get("/cities?limit=1000");
    cityList.value = r.data.result?.data ?? [];
  } finally {
    cityLoading.value = false;
  }
};
const loadDestinations = async () => {
  if (destinationList.value.length || destLoading.value) return;
  destLoading.value = true;
  try {
    const r = await axios.get("/destinations?limit=1000");
    destinationList.value = r.data.result?.data ?? [];
  } finally {
    destLoading.value = false;
  }
};
const loadVanTours = async () => {
  if (vanTourList.value.length || vtLoading.value) return;
  vtLoading.value = true;
  try {
    const r = await axios.get("/vantours?limit=1000");
    vanTourList.value = r.data.result?.data ?? [];
  } finally {
    vtLoading.value = false;
  }
};

// Auto-load when tab becomes active
const onTabClick = (key) => {
  activeTab.value = key;
  if (key === "locations") {
    loadCities();
    loadDestinations();
  }
  if (key === "van_tours") loadVanTours();
};

// ── Form ──────────────────────────────────────────────────────────────────────
const form = ref({
  route: "",
  english_description: "",
  mm_description: "",
  city_ids: [],
  destination_ids: [],
  vantour_ids: [],
});

// ── Images ────────────────────────────────────────────────────────────────────
const mainCoverInput = ref(null);
const otherInput = ref(null);
const mainCoverFile = ref(null);
const mainCoverPreview = ref(null);
const existingCover = ref(null);
const otherFiles = ref([]);
const otherPreviews = ref([]);
const existingPhotos = ref([]);

const onMainCoverChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  mainCoverFile.value = file;
  mainCoverPreview.value = URL.createObjectURL(file);
  existingCover.value = null;
};
const removeCover = () => {
  mainCoverFile.value = null;
  mainCoverPreview.value = null;
  existingCover.value = null;
};
const onOtherPhotosChange = (e) => {
  for (const f of e.target.files) {
    otherFiles.value.push(f);
    otherPreviews.value.push(URL.createObjectURL(f));
  }
};
const removeNewPhoto = (i) => {
  otherFiles.value.splice(i, 1);
  otherPreviews.value.splice(i, 1);
};
const removeExistingPhoto = (i) => existingPhotos.value.splice(i, 1);

// ── State ─────────────────────────────────────────────────────────────────────
const errors = ref({});
const submitting = ref(false);
const pageLoading = ref(false);

// ── Load detail ───────────────────────────────────────────────────────────────
const loadDetail = async () => {
  pageLoading.value = true;
  try {
    const res = await routePlanStore.getDetailAction(recordId.value);
    const d = res.result;
    form.value.route = d.route ?? "";
    form.value.english_description = d.english_description ?? "";
    form.value.mm_description = d.mm_description ?? "";
    form.value.city_ids = d.cities ?? [];
    form.value.destination_ids = d.destinations ?? [];
    form.value.vantour_ids = d.van_tours ?? [];
    existingCover.value = d.main_cover_photo ?? null;
    existingPhotos.value = d.other_photos ?? [];
  } catch {
    toast.error("Failed to load route plan.");
  } finally {
    pageLoading.value = false;
  }
};

// ── Submit ────────────────────────────────────────────────────────────────────
const onSubmit = async () => {
  errors.value = {};
  if (!form.value.route.trim()) {
    errors.value.route = "Route is required.";
    activeTab.value = "description";
    return;
  }

  const fd = new FormData();
  fd.append("route", form.value.route);
  fd.append("english_description", form.value.english_description);
  fd.append("mm_description", form.value.mm_description);
  form.value.city_ids.forEach((c, i) => fd.append(`city_ids[${i}]`, c.id ?? c));
  form.value.destination_ids.forEach((d, i) =>
    fd.append(`destination_ids[${i}]`, d.id ?? d),
  );
  form.value.vantour_ids.forEach((v, i) =>
    fd.append(`vantour_ids[${i}]`, v.id ?? v),
  );
  if (mainCoverFile.value) fd.append("main_cover_photo", mainCoverFile.value);
  otherFiles.value.forEach((f, i) => fd.append(`other_photos[${i}]`, f));

  try {
    submitting.value = true;
    const res = isEdit.value
      ? await routePlanStore.updateAction(fd, recordId.value)
      : await routePlanStore.addNewAction(fd);
    toast.success(res.message ?? (isEdit.value ? "Updated." : "Created."));
    if (!isEdit.value) router.push("/route-plan");
  } catch (err) {
    const data = err?.response?.data;
    if (data?.errors) errors.value = data.errors;
    toast.error(data?.message ?? "Something went wrong.");
  } finally {
    submitting.value = false;
  }
};

onMounted(async () => {
  if (isEdit.value) await loadDetail();
});
</script>

<template>
  <Layout>
    <!-- Skeleton -->
    <div v-if="pageLoading" class="max-w-6xl mx-auto py-8 px-4">
      <div class="grid grid-cols-4 gap-5">
        <div class="col-span-1 space-y-2">
          <div
            v-for="n in 4"
            :key="n"
            class="h-10 bg-gray-100 rounded-lg animate-pulse"
          ></div>
        </div>
        <div class="col-span-3 space-y-4">
          <div class="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
          <div class="h-40 bg-gray-100 rounded-lg animate-pulse"></div>
          <div class="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>

    <div v-else class="max-w-6xl mx-auto py-8 px-4">
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between">
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-widest text-[#FF613c] mb-1"
          >
            {{ isEdit ? "Edit" : "New" }}
          </p>
          <h1 class="text-2xl font-semibold text-gray-800">
            {{ isEdit ? "Update Route Plan" : "Create Route Plan" }}
          </h1>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="router.push('/route-plan')"
            class="text-sm text-gray-500 hover:text-gray-700 px-4 py-2.5 rounded-lg border border-gray-200 transition-colors"
          >
            Cancel
          </button>
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
      </div>

      <!-- Two-column layout -->
      <div class="grid grid-cols-4 gap-5 items-start">
        <!-- ── LEFT: Tab navigation ── -->
        <div
          class="col-span-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div class="px-4 py-3 border-b border-gray-50">
            <p
              class="text-xs font-semibold uppercase tracking-widest text-gray-400"
            >
              Sections
            </p>
          </div>
          <nav class="p-2 space-y-0.5">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="onTabClick(tab.key)"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left"
              :class="
                activeTab === tab.key
                  ? 'bg-[#FF613c]/10 text-[#FF613c]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              "
            >
              <!-- Description icon -->
              <svg
                v-if="tab.key === 'description'"
                class="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h10"
                />
              </svg>
              <!-- Locations icon -->
              <svg
                v-if="tab.key === 'locations'"
                class="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <!-- Van Tours icon -->
              <svg
                v-if="tab.key === 'van_tours'"
                class="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              <!-- Photos icon -->
              <svg
                v-if="tab.key === 'photos'"
                class="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {{ tab.label }}
              <!-- Error dot -->
              <span
                v-if="
                  tab.key === 'description' &&
                  (errors.route || errors.english_description)
                "
                class="ml-auto w-2 h-2 rounded-full bg-red-400 flex-shrink-0"
              ></span>
            </button>
          </nav>

          <!-- Quick summary of selections -->
          <div class="p-4 border-t border-gray-50 space-y-2">
            <div
              class="flex items-center justify-between text-xs text-gray-400"
            >
              <span>Cities</span>
              <span class="font-medium text-gray-600">{{
                form.city_ids.length
              }}</span>
            </div>
            <div
              class="flex items-center justify-between text-xs text-gray-400"
            >
              <span>Destinations</span>
              <span class="font-medium text-gray-600">{{
                form.destination_ids.length
              }}</span>
            </div>
            <div
              class="flex items-center justify-between text-xs text-gray-400"
            >
              <span>Van Tours</span>
              <span class="font-medium text-gray-600">{{
                form.vantour_ids.length
              }}</span>
            </div>
            <div
              class="flex items-center justify-between text-xs text-gray-400"
            >
              <span>Photos</span>
              <span class="font-medium text-gray-600">{{
                existingPhotos.length + otherPreviews.length
              }}</span>
            </div>
          </div>
        </div>

        <!-- ── RIGHT: Tab content ── -->
        <div class="col-span-3">
          <!-- Description tab -->
          <section
            v-show="activeTab === 'description'"
            class="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5"
          >
            <h2 class="section-title">Description</h2>

            <div>
              <label class="field-label"
                >Route <span class="text-red-500">*</span></label
              >
              <textarea
                v-model="form.route"
                rows="10"
                placeholder="e.g. Bangkok → Ayutthaya → Lopburi"
                class="input-field border-gray-200 resize-none"
                :class="errors.route ? '!border-red-400' : ''"
              />
              <p v-if="errors.route" class="mt-1 text-xs text-red-500">
                {{ errors.route }}
              </p>
            </div>

            <div>
              <label class="field-label">English Description</label>
              <QuillEditor
                :options="editorOptions"
                theme="snow"
                toolbar="essential"
                contentType="html"
                v-model:content="form.english_description"
                class="quill-editor"
              />
            </div>

            <div>
              <label class="field-label">Myanmar Description</label>
              <QuillEditor
                :options="{ placeholder: 'ဗမာဘာသာဖြင့် ဖော်ပြပါ…' }"
                theme="snow"
                toolbar="essential"
                contentType="html"
                v-model:content="form.mm_description"
                class="quill-editor"
              />
            </div>
          </section>

          <!-- Locations tab -->
          <section
            v-show="activeTab === 'locations'"
            class="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5"
          >
            <h2 class="section-title">Locations</h2>

            <div>
              <label class="field-label">Cities</label>
              <v-select
                v-model="form.city_ids"
                :options="cityList"
                label="name"
                :reduce="(c) => c"
                multiple
                :clearable="false"
                placeholder="Select cities…"
                :loading="cityLoading"
                @open="loadCities"
                class="style-chooser"
              />
            </div>

            <div>
              <label class="field-label">Destinations</label>
              <v-select
                v-model="form.destination_ids"
                :options="destinationList"
                label="name"
                :reduce="(d) => d"
                multiple
                :clearable="false"
                placeholder="Select destinations…"
                :loading="destLoading"
                @open="loadDestinations"
                class="style-chooser"
              />
            </div>
          </section>

          <!-- Van Tours tab -->
          <section
            v-show="activeTab === 'van_tours'"
            class="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4"
          >
            <h2 class="section-title">Linked Van Tours</h2>
            <v-select
              v-model="form.vantour_ids"
              :options="vanTourList"
              label="name"
              :reduce="(v) => v"
              multiple
              :clearable="false"
              placeholder="Select van tour packages…"
              :loading="vtLoading"
              @open="loadVanTours"
              class="style-chooser"
            />
            <p class="text-xs text-gray-400">
              These packages will be grouped under this route plan.
            </p>

            <!-- Selected van tour chips preview -->
            <div v-if="form.vantour_ids.length" class="pt-2 space-y-2">
              <p class="text-xs font-medium text-gray-500">
                Selected ({{ form.vantour_ids.length }})
              </p>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="vt in form.vantour_ids"
                  :key="vt.id"
                  class="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-[#FF613c] text-xs font-medium rounded-lg"
                >
                  <svg
                    class="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                  {{ vt.name ?? vt }}
                </div>
              </div>
            </div>
          </section>

          <!-- Photos tab -->
          <section
            v-show="activeTab === 'photos'"
            class="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6"
          >
            <h2 class="section-title">Photos</h2>

            <!-- Cover photo -->
            <div>
              <label class="field-label">Cover Photo</label>
              <input
                type="file"
                ref="mainCoverInput"
                class="hidden"
                accept="image/*"
                @change="onMainCoverChange"
              />

              <div
                v-if="mainCoverPreview || existingCover"
                class="relative w-full h-56 rounded-xl overflow-hidden group"
              >
                <img
                  :src="mainCoverPreview || existingCover"
                  class="w-full h-full object-cover"
                  alt=""
                />
                <div
                  class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"
                ></div>
                <button
                  @click.prevent="removeCover"
                  class="absolute top-3 right-3 p-1.5 bg-black/50 hover:bg-red-500 rounded-full text-white transition-colors opacity-0 group-hover:opacity-100"
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
                <button
                  @click.prevent="mainCoverInput.click()"
                  class="absolute bottom-3 right-3 px-3 py-1.5 bg-black/50 hover:bg-black/70 rounded-lg text-white text-xs transition-colors opacity-0 group-hover:opacity-100"
                >
                  Replace
                </button>
              </div>

              <button
                v-else
                @click.prevent="mainCoverInput.click()"
                class="w-full h-44 border-2 border-dashed border-gray-200 hover:border-[#FF613c] rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#FF613c] transition-colors"
              >
                <svg
                  class="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span class="text-xs">Click to upload cover photo</span>
              </button>
            </div>

            <!-- Other photos -->
            <div>
              <label class="field-label">Other Photos</label>
              <input
                type="file"
                ref="otherInput"
                class="hidden"
                accept="image/*"
                multiple
                @change="onOtherPhotosChange"
              />
              <div class="grid grid-cols-4 gap-3">
                <div
                  v-for="(photo, i) in existingPhotos"
                  :key="'ex-' + i"
                  class="relative group aspect-square rounded-xl overflow-hidden bg-gray-50"
                >
                  <img :src="photo" class="w-full h-full object-cover" alt="" />
                  <div
                    class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-xl"
                  ></div>
                  <button
                    @click.prevent="removeExistingPhoto(i)"
                    class="absolute top-1.5 right-1.5 p-1 bg-black/50 hover:bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <svg
                      class="w-3 h-3"
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
                </div>

                <div
                  v-for="(src, i) in otherPreviews"
                  :key="'new-' + i"
                  class="relative group aspect-square rounded-xl overflow-hidden bg-gray-50"
                >
                  <img :src="src" class="w-full h-full object-cover" alt="" />
                  <div
                    class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-xl"
                  ></div>
                  <button
                    @click.prevent="removeNewPhoto(i)"
                    class="absolute top-1.5 right-1.5 p-1 bg-black/50 hover:bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <svg
                      class="w-3 h-3"
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
                </div>

                <!-- Add button -->
                <button
                  @click.prevent="otherInput.click()"
                  class="aspect-square border-2 border-dashed border-gray-200 hover:border-[#FF613c] rounded-xl flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-[#FF613c] transition-colors"
                >
                  <svg
                    class="w-5 h-5"
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
                  <span class="text-[10px]">Add</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- Bottom save -->
      <div class="flex justify-end pt-5 pb-8">
        <button
          @click.prevent="onSubmit"
          :disabled="submitting"
          class="inline-flex items-center gap-2 bg-[#FF613c] hover:bg-[#e5522f] disabled:opacity-60 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          {{
            submitting
              ? "Saving…"
              : isEdit
              ? "Update Route Plan"
              : "Save Route Plan"
          }}
        </button>
      </div>
    </div>
  </Layout>
</template>

<style scoped>
.section-title {
  @apply text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4;
}
.field-label {
  @apply block text-xs font-medium text-gray-600 mb-1.5;
}
.input-field {
  @apply w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400
         focus:outline-none focus:ring-2 focus:ring-[#FF613c]/30 focus:border-[#FF613c];
}
</style>

<style>
/* Quill editor */
.quill-editor .ql-toolbar {
  border: 1px solid #e5e7eb !important;
  border-radius: 8px 8px 0 0 !important;
  background: #fafafa;
}
.quill-editor .ql-container {
  border: 1px solid #e5e7eb !important;
  border-top: none !important;
  border-radius: 0 0 8px 8px !important;
  min-height: 200px;
  font-size: 13px;
}
.quill-editor .ql-editor {
  min-height: 200px;
}

/* v-select */
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
