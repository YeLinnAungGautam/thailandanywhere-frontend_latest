<script setup>
import { storeToRefs } from "pinia";
import { useSidebarStore } from "../stores/sidebar";
import Layout from "./Layout.vue";
import { onMounted, ref, watch } from "vue";
import Pagination from "../components/Pagination.vue";
import { useToast } from "vue-toastification";
import {
  PencilSquareIcon,
  TrashIcon,
  PhotoIcon,
} from "@heroicons/vue/24/outline";
import debounce from "lodash/debounce";
import Swal from "sweetalert2";
import CashHeader from "../components/CashHeader.vue";
import { useCashStructureStore } from "../stores/cashStructure";

const sideBarStore = useSidebarStore();
const cashStructureStore = useCashStructureStore();
const { isShowSidebar } = storeToRefs(sideBarStore);
const { cash_structures, loading } = storeToRefs(cashStructureStore);
const toast = useToast();

const changePage = (page) => {
  let data = {
    search: search.value,
  };
  cashStructureStore.getChangePage(page, data);
};

const search = ref("");
const imagePreview = ref("");
const fileInput = ref(null);

const formData = ref({
  name: "",
  code: "",
  description: "",
  notes: "",
  cash_image: null,
  id: "",
});

const clearAction = () => {
  formData.value = {
    name: "",
    code: "",
    description: "",
    notes: "",
    cash_image: null,
    id: "",
  };
  imagePreview.value = "";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const editGetFormData = (data) => {
  formData.value.id = data.id;
  formData.value.name = data.name;
  formData.value.code = data.code;
  formData.value.description = data.description;
  formData.value.notes = data.notes || "";
  formData.value.cash_image = null;

  // Set image preview if exists
  if (data.cash_image) {
    imagePreview.value = data.cash_image;
  } else {
    imagePreview.value = "";
  }

  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF)");
      event.target.value = "";
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB");
      event.target.value = "";
      return;
    }

    formData.value.cash_image = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  formData.value.cash_image = null;
  imagePreview.value = "";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const getAction = async () => {
  await cashStructureStore.getListAction({ search: search.value });
};

const addNewHandler = async () => {
  if (formData.value.name == "") {
    toast.error("Please fill in the account head name");
    return;
  }

  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("code", formData.value.code);
  frmData.append("description", formData.value.description);
  frmData.append("notes", formData.value.notes);

  if (formData.value.cash_image) {
    frmData.append("cash_image", formData.value.cash_image);
  }

  await cashStructureStore.addNewAction(frmData);
  formData.value = {
    name: "",
    code: "",
    description: "",
    notes: "",
    cash_image: null,
    id: "",
  };
  imagePreview.value = "";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
  toast.success("Add new account head successfully");
  await getAction();
};

const updateHandler = async () => {
  if (formData.value.name == "") {
    toast.error("Please fill in the account head name");
    return;
  }

  const frmData = new FormData();
  frmData.append("_method", "PUT");
  frmData.append("name", formData.value.name);
  frmData.append("code", formData.value.code);
  frmData.append("description", formData.value.description);
  frmData.append("notes", formData.value.notes);

  if (formData.value.cash_image) {
    frmData.append("cash_image", formData.value.cash_image);
  }

  await cashStructureStore.updateAction(frmData, formData.value.id);
  formData.value = {
    name: "",
    code: "",
    description: "",
    notes: "",
    cash_image: null,
    id: "",
  };
  imagePreview.value = "";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
  toast.success("Update account head successfully");
  await getAction();
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
        const response = await cashStructureStore.deleteAction(id);
        toast.success(response.message);
      } catch (error) {
        toast.error(error.response.data.message);
      }
      await getAction();
    }
  });
};

onMounted(async () => {
  await getAction();
});

watch(
  search,
  debounce(async (newValue) => {
    await getAction();
  }, 500)
);
</script>

<template>
  <Layout :is_white="true" class="relative">
    <div
      :class="isShowSidebar ? 'left-[240px]' : 'left-[100px]'"
      class="space-x-8 col-span-3 flex justify-start items-center transition-all duration-200 gap-2 text-sm pb-4 absolute top-6"
    >
      <p class="text-3xl font-medium text-[#FF613c]">
        Cash Structure
        <span class="w-2 h-2 bg-[#FF613c] rounded-full inline-block"></span>
      </p>
    </div>

    <div class="grid grid-cols-5 gap-4">
      <div class="col-span-5">
        <!-- header -->
        <div>
          <CashHeader />
        </div>

        <div class="pb-4">
          <input
            v-model="search"
            type="text"
            class="w-1/4 border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
            placeholder="search"
          />
        </div>

        <div class="grid grid-cols-8 gap-4">
          <div class="overflow-x-auto col-span-5">
            <table
              class="w-full text-sm text-left text-gray-500 mb-4 dark:text-gray-400 rounded overflow-hidden"
            >
              <thead
                class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-[#FF613c] dark:text-gray-100"
              >
                <tr>
                  <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
                    ID
                  </th>
                  <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
                    Code
                  </th>
                  <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
                    Name
                  </th>
                  <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
                    Description
                  </th>
                  <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
                    Notes
                  </th>
                  <th scope="col" class="px-3 py-3 border-l border-gray-50/20">
                    Image
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3 border-l border-gray-50/20"
                  ></th>
                </tr>
              </thead>

              <tbody class="border border-gray-400/20">
                <tr
                  v-for="item in cash_structures?.data ?? []"
                  :key="item"
                  class="border border-gray-400/20 even:bg-gray-50"
                >
                  <td
                    scope="col"
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{ item?.id }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{ item?.code }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{ item?.name }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    {{ item?.description ?? "-" }}
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    <div class="max-w-32 truncate" :title="item?.notes">
                      {{ item?.notes ?? "-" }}
                    </div>
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    <div v-if="item?.cash_image" class="w-10 h-10">
                      <img
                        :src="item.cash_image"
                        :alt="item.name"
                        class="w-full h-full object-cover rounded border"
                      />
                    </div>
                    <div
                      v-else
                      class="w-10 h-10 bg-gray-100 rounded border flex items-center justify-center"
                    >
                      <PhotoIcon class="w-5 h-5 text-gray-400" />
                    </div>
                  </td>
                  <td
                    scope="col"
                    class="text-[11px] flex justify-end items-center gap-x-8 font-medium text-gray-800 px-3 py-3 border-l border-gray-400/20"
                  >
                    <PencilSquareIcon
                      class="w-4 h-4 cursor-pointer text-blue-600"
                      @click="editGetFormData(item)"
                    />
                    <TrashIcon
                      class="w-4 h-4 cursor-pointer text-red-600"
                      @click="onDeleteHandler(item.id)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div>
              <!-- pagination -->
              <Pagination
                v-if="!loading"
                :data="cash_structures"
                @change-page="changePage"
              />
            </div>
          </div>
          <div class="col-span-3">
            <div class="col-span-1 p-4 rounded-lg shadow space-y-4">
              <div class="space-y-2">
                <label for="" class="text-[11px] font-medium"> Name</label>
                <input
                  v-model="formData.name"
                  type="text"
                  class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20"
                  placeholder="Enter name"
                />
              </div>

              <div class="space-y-2">
                <label for="" class="text-[11px] font-medium"> Code</label>
                <input
                  v-model="formData.code"
                  type="text"
                  class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20"
                  placeholder="Enter code"
                />
              </div>

              <div class="space-y-2">
                <label for="" class="text-[11px] font-medium">
                  Description</label
                >
                <textarea
                  v-model="formData.description"
                  class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20"
                  rows="3"
                  placeholder="Enter description"
                ></textarea>
              </div>

              <div class="space-y-2">
                <label for="" class="text-[11px] font-medium"> Notes</label>
                <textarea
                  v-model="formData.notes"
                  class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20"
                  rows="3"
                  placeholder="Enter notes"
                ></textarea>
              </div>

              <div class="space-y-2">
                <label for="" class="text-[11px] font-medium">
                  Cash Image</label
                >
                <div class="space-y-2">
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    @change="handleImageChange"
                    class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#FF613c]/20"
                  />

                  <!-- Image Preview -->
                  <div v-if="imagePreview" class="relative">
                    <div
                      class="w-full h-32 border border-gray-400/20 rounded-lg overflow-hidden"
                    >
                      <img
                        :src="imagePreview"
                        alt="Preview"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      @click="removeImage"
                      type="button"
                      class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>

                  <!-- Placeholder when no image -->
                  <div
                    v-else
                    class="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
                  >
                    <div class="text-center">
                      <PhotoIcon class="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p class="text-xs text-gray-500">No image selected</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6 flex justify-between items-center gap-x-2">
                <button
                  @click="formData.id ? updateHandler() : addNewHandler()"
                  class="bg-[#FF613c] hover:bg-[#FF613c]/90 text-white px-4 py-2 text-xs w-full rounded-lg transition-colors duration-200"
                >
                  {{ formData?.id ? "Update" : "Save" }}
                </button>
                <button
                  @click="clearAction()"
                  class="bg-white border border-gray-400 hover:bg-gray-50 text-black px-4 py-2 text-xs w-full rounded-lg transition-colors duration-200"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
