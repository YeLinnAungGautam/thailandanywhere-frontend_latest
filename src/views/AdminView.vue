<script setup>
import Layout from "./Layout.vue";
import Input from "../components/Input.vue";
import InputField from "../components/InputField.vue";
import Pagination from "../components/Pagination.vue";
import Modal from "../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
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
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import { onMounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAdminStore } from "../stores/admin";
import debounce from "lodash/debounce";

const adminModalOpen = ref(false);

const router = useRouter();
const toast = useToast();
const adminStore = useAdminStore();

const { admin, loading } = storeToRefs(adminStore);

const changePage = async (url) => {
  await adminStore.getChangePage(url);
};

const roleList = [
  { id: "1", name: "Admin", value: "admin" },
  { id: "2", name: "Super Admin", value: "super_admin" },
  { id: "3", name: "Cashier", value: "cashier" },
  { id: "4", name: "Reservation", value: "reservation" },
  { id: "5", name: "Agent", value: "agent" },
  { id: "6", name: "Car Supplier", value: "car_supplier" },
  { id: "7", name: "Auditor", value: "auditor" },
  { id: "8", name: "Sale Manager", value: "sale_manager" },
];
const errors = ref([]);

// when open with modal , detail can get

// delete action
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
        const response = await adminStore.deleteAction(id);
        toast.success(response.message);
      } catch (error) {
        if (error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
        toast.error(error.response.data.message);
      }
      await adminStore.getListAction();
    }
  });
};

const search = ref("");

const member = ref([]);
const add_member = ref(false);

const formData = ref({
  id: null,
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  role: "",
  target_amount: "",
});

// add action for admin
const addNewHandler = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("email", formData.value.email);
  frmData.append("target_amount", formData.value.target_amount);
  frmData.append("password", formData.value.password);
  frmData.append("password_confirmation", formData.value.password_confirmation);
  frmData.append("role", formData.value.role);
  try {
    const response = await adminStore.addNewAction(frmData);
    formData.value = {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      role: "",
      target_amount: "",
    };
    errors.value = null;
    adminModalOpen.value = false;
    await adminStore.getListAction();
    toast.success(response.message);
  } catch (error) {
    if (error.response.data.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response.data.message);
  }
};

// update action
const updateHandler = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("email", formData.value.email);
  frmData.append("target_amount", formData.value.target_amount);
  frmData.append("role", formData.value.role);
  if (formData.value.password && formData.value.password_confirmation) {
    frmData.append("password", formData.value.password);
    frmData.append(
      "password_confirmation",
      formData.value.password_confirmation
    );
  }
  frmData.append("_method", "PUT");
  try {
    const response = await adminStore.updateAction(frmData, formData.value.id);
    formData.value = {
      name: "",
      email: "",
      target_amount: "",
      password: "",
      password_confirmation: "",
      id: "",
    };
    errors.value = null;
    adminModalOpen.value = false;
    await adminStore.getListAction();
    toast.success(response.message);
  } catch (error) {
    if (error.response?.data.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response.data.message);
  }
};

const formatDate = (dateInput) => {
  const date = new Date(dateInput);
  return date.toISOString().split("T")[0];
};

// onsubmit when click create and update choose what we do
const onSubmitHandler = async () => {
  if (formData.value.id) {
    updateHandler();
  } else {
    addNewHandler();
  }
};

const addMemberShow = ref(false);

const adminLists = ref([]);

const subsidiaries = ref([]);

const getListUser = async () => {
  try {
    const res = await adminStore.getSimpleListAction();
    console.log(res, "this is admin list");

    adminLists.value = res.result.data
      .filter((item) => item.role === "admin")
      .map((item) => {
        // Return desired structure or transformation here
        return {
          id: item.id,
          name: item.name,
        };
      });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
  }
};

const addMemberAction = async () => {
  console.log("add member action", subsidiaries.value);
  const resultString = subsidiaries.value.join(", "); // Join with a comma

  console.log(resultString, "this is result string");

  const frmData = new FormData();
  frmData.append("sale_manager_id", formData.value.id);
  frmData.append("subsidiary_ids", resultString);

  const res = await adminStore.assignSaleManager(frmData);
  console.log(res, "this is res");
  if (res.status == "Request was successful.") {
    toast.success(res.message);
    adminModalOpen.value = false;
    await adminStore.getListAction();
  } else {
    toast.error(res.message);
  }
};

const editModalOpenHandler = (data) => {
  console.log(data);
  formData.value.id = data.id;
  formData.value.name = data.name;
  formData.value.email = data.email;
  formData.value.target_amount = data.target_amount;
  formData.value.role = data.role;
  // formData.value.member = data.member;

  if (data.subsidiaries.length > 0) {
    subsidiaries.value = data.subsidiaries.map((item) => item.id);
  }

  adminModalOpen.value = true;
};

onMounted(async () => {
  await adminStore.getListAction();
  console.log(admin.value, "this is admin");

  await getListUser();
});

// search action with debounce when search
watch(
  search,
  debounce(async (newValue) => {
    await adminStore.getListAction({ search: search.value });
  }, 500)
);
</script>

<template>
  <Layout>
    <!-- admin modal open  -->
    <Modal
      :isOpen="adminModalOpen"
      @closeModal="
        () => {
          adminModalOpen = false;
          addMemberShow = false;
          formData = {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            role: '',
            target_amount: '',
          };
        }
      "
    >
      <DialogPanel
        class="w-full max-w-xl p-4 text-left align-middle transition-all transform bg-white rounded-lg shadow-xl"
      >
        <DialogTitle
          as="div"
          class="mb-5 flex justify-between items-center text-base font-medium leading-6 text-gray-900"
        >
          <p>{{ formData.id ? "Edit System User" : "Add New System User" }}</p>
        </DialogTitle>
        <form
          @submit.prevent="onSubmitHandler"
          class="mt-2 grid grid-cols-2 gap-2"
          v-if="!addMemberShow"
        >
          <div class="mb-2 space-y-1">
            <label for="name" class="text-[10px] text-gray-800">Name</label>
            <input
              type="text"
              v-model="formData.name"
              id="name"
              class="w-full px-4 py-1.5 text-xs text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.name" class="mt-1 text-sm text-red-600">
              {{ errors.name[0] }}
            </p>
          </div>
          <div class="mb-2 space-y-1">
            <label for="email" class="text-[10px] text-gray-800">Email</label>
            <input
              type="text"
              v-model="formData.email"
              id="email"
              class="w-full px-4 py-1.5 text-xs text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.email" class="mt-1 text-sm text-red-600">
              {{ errors.email[0] }}
            </p>
          </div>
          <div class="mb-2 space-y-1">
            <label for="password" class="text-[10px] text-gray-800"
              >Password</label
            >
            <input
              type="text"
              v-model="formData.password"
              id="password"
              class="w-full px-4 py-1.5 text-xs text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.password" class="mt-1 text-sm text-red-600">
              {{ errors.password[0] }}
            </p>
          </div>
          <div class="mb-2 space-y-1">
            <label for="password_confirmation" class="text-[10px] text-gray-800"
              >Confirm Password</label
            >
            <input
              type="text"
              v-model="formData.password_confirmation"
              id="password_confirmation"
              class="w-full px-4 py-1.5 text-xs text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p
              v-if="errors?.password_confirmation"
              class="mt-1 text-sm text-red-600"
            >
              {{ errors.password_confirmation[0] }}
            </p>
          </div>
          <div class="mb-2 space-y-1">
            <label for="password_confirmation" class="text-[10px] text-gray-800"
              >Role</label
            >
            <v-select
              v-model="formData.role"
              class="bg-white rounded-lg style-chooser placeholder-sm"
              :options="roleList"
              label="name"
              :clearable="false"
              :reduce="(d) => d.value"
            ></v-select>
          </div>

          <div class="mb-2 space-y-1">
            <label for="email" class="text-[10px] text-gray-800"
              >Target Amount</label
            >
            <input
              type="number"
              v-model="formData.target_amount"
              id="target_amount"
              class="w-full px-4 py-1.5 text-xs text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.target_amount" class="mt-1 text-sm text-red-600">
              {{ errors.target_amount[0] }}
            </p>
          </div>
          <div
            v-if="formData.role == 'sale_manager'"
            class="col-span-2 space-y-3"
          >
            <div class="flex items-center justify-between">
              <label for="email" class="text-[10px] text-gray-800"
                >Add Subsidiaries</label
              >
              <p
                @click="addMemberAction"
                class="text-[10px] bg-[#ff613c] text-white rounded-md px-2 py-1"
              >
                Add Subsidiaries
              </p>
            </div>
            <v-select
              class="bg-white rounded-lg style-chooser placeholder-sm"
              v-model="subsidiaries"
              :options="adminLists ?? []"
              label="name"
              multiple
              :clearable="false"
              :reduce="(member) => member.id"
            ></v-select>
          </div>
          <div class="text-end col-span-2 pt-2">
            <Button type="submit" class="text-xs"> Submit </Button>
          </div>
        </form>
      </DialogPanel>
    </Modal>

    <div class="flex items-center justify-between mb-5">
      <h3 class="text-2xl font-medium text-gray-600">Admins</h3>
      <div class="space-x-3">
        <Button :leftIcon="PlusIcon" @click.prevent="adminModalOpen = true">
          Create
        </Button>
      </div>
    </div>
    <div class="p-6 mb-5 rounded-lg shadow-sm bg-white/60">
      <!-- search input sort filter -->
      <div class="flex items-center justify-between mb-5">
        <div class="">
          <input
            v-model="search"
            type="text"
            class="w-3/5 sm:w-3/5 md:w-[300px] mr-3 border px-4 py-2 rounded-md shadow focus:ring-0 focus:outline-none text-gray-500"
            placeholder="Search for admins.."
          />
        </div>
      </div>
      <div class="mb-5 overflow-auto rounded-lg shadow">
        <table class="w-full">
          <thead class="border-b-2 border-gray-200 bg-gray-50">
            <tr>
              <th class="w-20 p-3 text-xs font-medium tracking-wide text-left">
                No.
              </th>
              <th class="p-3 text-xs font-medium tracking-wide text-left w-30">
                Name
              </th>
              <th class="p-3 text-xs font-medium tracking-wide text-left">
                Email
              </th>
              <th class="p-3 text-xs font-medium tracking-wide text-left">
                Role
              </th>
              <th class="p-3 text-xs font-medium tracking-wide text-left">
                Created At
              </th>
              <th class="p-3 text-xs font-medium tracking-wide text-left">
                Target Amount
              </th>
              <th class="p-3 text-xs font-medium tracking-wide text-left w-30">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="r in admin?.data"
              :key="r.id"
              class="bg-white even:bg-gray-50 hover:bg-gray-50"
            >
              <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
                {{ r.id }}
              </td>
              <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
                {{ r.name }}
              </td>
              <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
                {{ r.email }}
              </td>
              <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
                {{ r.role }}
              </td>
              <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
                {{ formatDate(r.created_at) }}
              </td>
              <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
                {{ r.target_amount ? r.target_amount : "-" }}
              </td>

              <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <button
                    @click.prevent="editModalOpenHandler(r)"
                    class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                  >
                    <PencilSquareIcon class="w-5 h-5" />
                  </button>
                  <button
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
      <Pagination v-if="!loading" :data="admin" @change-page="changePage" />
    </div>
  </Layout>
</template>
