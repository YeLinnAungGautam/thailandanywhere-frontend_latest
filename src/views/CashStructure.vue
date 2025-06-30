<script setup>
import { storeToRefs } from "pinia";
import { useSidebarStore } from "../stores/sidebar";
import Layout from "./Layout.vue";
import { onMounted, ref, watch } from "vue";
import Pagination from "../components/Pagination.vue";
import { useToast } from "vue-toastification";
import { PencilSquareIcon, TrashIcon } from "@heroicons/vue/24/outline";
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
const formData = ref({
  name: "",
  code: "",
  description: "",
  id: "",
});

const clearAction = () => {
  formData.value = {
    name: "",
    code: "",
    description: "",
    id: "",
  };
};

const editGetFormData = (data) => {
  formData.value.id = data.id;
  formData.value.name = data.name;
  formData.value.code = data.code;
  formData.value.description = data.description;
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
  frmData.append("description", formData.value.description); // Add description to the form data
  // Now you can use frmData to send the data to your server
  await cashStructureStore.addNewAction(frmData);
  formData.value = {
    name: "",
    code: "",
    description: "",
    id: "",
  };
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
  frmData.append("description", formData.value.description); // Add description to the form data
  // Now you can use frmData to send the data to your server
  await cashStructureStore.updateAction(frmData, formData.value.id);
  formData.value = {
    name: "",
    code: "",
    description: "",
    id: "",
  };
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
            <div class="col-span-1 p-4 rounded-lg shadow space-y-2">
              <div class="space-y-2">
                <label for="" class="text-[11px]"> Name</label>
                <input
                  v-model="formData.name"
                  type="text"
                  class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
                  placeholder="name "
                />
              </div>
              <div class="space-y-2">
                <label for="" class="text-[11px]"> Code</label>
                <input
                  v-model="formData.code"
                  type="text"
                  class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
                  placeholder="code "
                />
              </div>
              <div class="space-y-2">
                <label for="" class="text-[11px]"> Description</label>
                <textarea
                  name=""
                  v-model="formData.description"
                  class="w-full border border-gray-400/20 rounded-lg px-3 py-2 text-xs"
                  id=""
                ></textarea>
              </div>
              <div class="mt-4 flex justify-between items-center gap-x-2">
                <button
                  @click="formData.id ? updateHandler() : addNewHandler()"
                  class="bg-[#FF613c] text-white px-4 py-2 text-xs w-full rounded-lg"
                >
                  {{ formData?.id ? "Update" : "Save" }}
                </button>
                <button
                  @click="clearAction()"
                  class="bg-white border border-gray-400 text-black px-4 py-2 text-xs w-full rounded-lg"
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
