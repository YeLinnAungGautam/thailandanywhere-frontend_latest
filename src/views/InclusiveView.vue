<template>
  <div
    class="hidden p-6 mb-5 rounded-lg shadow-sm bg-white/60 md:col-span-3 md:block"
  >
    <h3 class="mb-3 text-xl font-medium tracking-wide text-gray-600">
      Inclusive List
    </h3>
    <!-- search input sort filter -->
    <div class="flex items-center justify-between mb-8">
      <div class="">
        <input
          type="text"
          v-model="search"
          class="w-3/5 sm:w-3/5 md:w-[300px] mr-3 border px-4 py-2 rounded-md shadow-sm focus:ring-0 focus:outline-none text-gray-500"
          placeholder="Search Inclusive List..."
        />

        <AdjustmentsHorizontalIcon
          class="inline-block w-6 h-6 mx-2 text-gray-600 cursor-pointer"
        />
      </div>
      <div class="space-x-3 flex justify-end items-center">
        <Button :leftIcon="ShareIcon" intent="text"> Export </Button>
        <!-- <Button :leftIcon="PlusIcon" @click="inclusiveHandling">
          Create
        </Button> -->
        <div class="relative">
          <Button :leftIcon="PlusIcon" @click="goCreatePage('new')">
            Create
          </Button>
        </div>
      </div>
    </div>
    <div class="mb-5 overflow-auto rounded-lg shadow">
      <table class="w-full">
        <thead class="border-b-2 border-gray-200 bg-gray-50">
          <tr>
            <th class="w-20 p-3 text-xs font-medium tracking-wide text-left">
              No.
            </th>

            <th class="p-3 text-xs font-medium tracking-wide text-left">
              Name
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              general
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              items
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              other
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              content
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              design
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              material
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              Prices (Rate per person)
            </th>

            <th class="p-3 text-xs font-medium tracking-wide text-left w-30">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100" v-if="loading">
          <tr class="bg-white even:bg-gray-50 hover:bg-gray-50">
            <td
              class="p-3 text-xs text-gray-700 whitespace-nowrap py-20 text-center"
              colspan="4"
            >
              loading ...
            </td>
          </tr>
        </tbody>
        <tbody class="divide-y divide-gray-100" v-if="!loading">
          <tr
            class="bg-white even:bg-gray-50 hover:bg-gray-50"
            v-for="(r, index) in inclusives?.data"
            :key="index"
          >
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.id }}
            </td>

            <td
              class="p-3 text-xs text-gray-700 whitespace-nowrap max-w-[150px] overflow-hidden"
            >
              {{ r.name }}
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              <CheckBadgeIcon
                class="w-5 h-5 text-green-600"
                v-if="
                  checkOne(
                    r.name,
                    r.day,
                    r.night,
                    r.price,
                    r.sku_code,
                    r.price_range
                  )
                "
              />
              <XCircleIcon
                class="w-5 h-5 text-red-600"
                v-if="
                  !checkOne(
                    r.name,
                    r.day,
                    r.night,
                    r.price,
                    r.sku_code,
                    r.price_range
                  )
                "
              />
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              <CheckBadgeIcon class="w-5 h-5 text-green-600" />
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              <CheckBadgeIcon
                class="w-5 h-5 text-green-600"
                v-if="checkOther(r.details)"
              />
              <XCircleIcon
                class="w-5 h-5 text-red-600"
                v-if="!checkOther(r.details)"
              />
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              <CheckBadgeIcon
                class="w-5 h-5 text-green-600"
                v-if="checkContext(r.details, r.description)"
              />
              <XCircleIcon
                class="w-5 h-5 text-red-600"
                v-if="!checkContext(r.details, r.description)"
              />
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              <CheckBadgeIcon
                class="w-5 h-5 text-green-600"
                v-if="checkDesign(r.details, r.images)"
              />
              <XCircleIcon
                class="w-5 h-5 text-red-600"
                v-if="!checkDesign(r.details, r.images)"
              />
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              <CheckBadgeIcon
                class="w-5 h-5 text-green-600"
                v-if="checkMaterial(r.pdfs, r.product_itenary_material)"
              />
              <XCircleIcon
                class="w-5 h-5 text-red-600"
                v-if="!checkMaterial(r.pdfs, r.product_itenary_material)"
              />
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.price }} B
            </td>

            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <!-- <router-link :to="'/inclusive/view/' + r.id + '/view'">
                  <button
                    class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-blue-500 hover:text-white"
                  >
                    <EyeIcon class="w-5 h-5" />
                  </button>
                </router-link> -->
                <!-- <router-link :to="'/inclusive/view/' + r.id + '/edit'"> -->
                <button
                  @click="goEditPage('new', r.id)"
                  class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                >
                  <PencilSquareIcon class="w-5 h-5" />
                </button>
                <!-- </router-link> -->
                <button
                  v-if="authStore.isSuperAdmin || authStore.isReservation"
                  @click.prevent="onDeleteHandler(r.id)"
                  class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-red-500 hover:text-white"
                >
                  <TrashIcon class="w-5 h-5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- pagination -->
    <Pagination v-if="!loading" :data="inclusives" @change-page="changePage" />
  </div>
</template>

<script setup>
import {
  PencilSquareIcon,
  TrashIcon,
  ShareIcon,
  EyeIcon,
  TicketIcon,
  BuildingOfficeIcon,
  PlusIcon,
  UserGroupIcon,
  UsersIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/vue/24/outline";
import Pagination from "../components/Pagination.vue";
import { onMounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import { useInclusiveStore } from "../stores/inclusion";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import { useAuthStore } from "../stores/auth";
import debounce from "lodash/debounce";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import Modal from "../components/Modal.vue";
import { CheckBadgeIcon, XCircleIcon } from "@heroicons/vue/24/solid";

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
const inclusiveStore = useInclusiveStore();
const { inclusives, loading } = storeToRefs(inclusiveStore);

const search = ref("");
const errors = ref([]);

const showVersion = ref(false);
const showVersionUpdate = ref(false);
const editId = ref("");

const newUpdateHandler = (id) => {
  showVersionUpdate.value = true;
  editId.value = id;
};

const inclusiveHandling = () => {
  router.push("/inclusive/create");
};

const goCreatePage = (data) => {
  if (data == "new") {
    router.push("/inclusive/new/create");
  } else {
    router.push("/inclusive/create");
  }
};
const goEditPage = (data, id) => {
  if (data == "old") {
    router.push("/inclusive/view/" + id + "/edit");
  } else {
    router.push("/inclusive/new/update/" + id + "/edit");
  }
};

const changePage = async (url) => {
  console.log(url);
  let data = {
    search: search.value,
  };
  await inclusiveStore.getChangePage(url, data);
};

const onDeleteHandler = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2463EB",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await inclusiveStore.deleteAction(id);
        toast.success(response.message);
      } catch (error) {
        console.log(
          "🚀 ~ file: BlogView.vue:65 ~ onDeleteHandler ~ error:",
          error
        );
        if (error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
        toast.error(error.response.data.message);
      }
      await inclusiveStore.getListAction();
    }
  });
};

const checkOne = (name, day, night, price, sku_code, price_range) => {
  if (
    name != "" &&
    day != "" &&
    night != "" &&
    price != "" &&
    sku_code != "" &&
    price_range != null
  ) {
    return true;
  } else {
    return false;
  }
};

const checkOther = (details) => {
  if (details.length > 0) {
    if (
      details[0]?.title != "" &&
      details[0]?.cities?.length != 0 &&
      details[0]?.destinations.length != 0
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const checkContext = (details, des) => {
  if (details.length > 0) {
    if (des != "" && details[0].summary_mm && details[0].summary) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const checkDesign = (details, images) => {
  if (details.length > 0) {
    if (images.length > 0 && details[0].image != null) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const checkMaterial = (one = [], two = []) => {
  if (one.length > 0 && two != null) {
    return true;
  } else {
    return false;
  }
};

// if (
//   formData.value.name != "" &&
//   formData.value.day != "" &&
//   formData.value.night != "" &&
//   formData.value.price != "" &&
//   formData.value.sku_code != "" &&
//   formData.value.price_range.length > 0
// ) {
//   finish.value.session1 = true;
// }
// if (formData.value.items.length > 0) {
//   finish.value.session2 = true;
// }
// if (formData.value.details.length > 0) {
//   if (
//     formData.value.details[0].title_name != "" &&
//     formData.value.details[0].cities?.length != 0 &&
//     formData.value.details[0].destinations.length != 0
//   ) {
//     finish.value.session3 = true;
//   }
// }
// if (formData.value.details.length > 0) {
//   if (
//     formData.value.description != "" &&
//     formData.value.details[0].summary_mm &&
//     formData.value.details[0].summary
//   ) {
//     finish.value.session4 = true;
//   }
// }
// if (formData.value.details.length > 0) {
//   if (
//     formData.value.images.length > 0 &&
//     formData.value.details[0].image_url != null
//   ) {
//     finish.value.session5 = true;
//   }
// }
// if (formData.value.cover_image || editData.value.cover_image) {
//   finish.value.session6 = true;
// }

onMounted(async () => {
  await inclusiveStore.getListAction();
});

watch(
  search,
  debounce(async (newValue) => {
    await inclusiveStore.getListAction({ search: search.value });
  }, 500)
);
</script>
