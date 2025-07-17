<template>
  <div class="" v-if="!loading">
    <div class="grid grid-cols-3 gap-4">
      <div
        class="rounded-lg py-3 relative border space-y-3 border-gray-200 h-auto"
      >
        <p class="text-lg font-medium text-[#FF613c] px-4">Add Traveller</p>

        <div class="h-[46vh] overflow-y-auto px-3 space-y-1">
          <div
            v-for="(customer, index) in passportLists ?? []"
            :key="index"
            class="flex justify-start items-center space-x-4 rounded-lg cursor-pointer py-1"
            @click="openPassportModal(customer, index)"
            :class="customer.id == formData.id ? 'bg-[#FF613c]' : ''"
          >
            <div
              class="rounded-lg p-2 inline-block"
              :class="
                customer.id == formData.id
                  ? 'bg-[#FF613c]/30'
                  : 'bg-[#FF613c]/5'
              "
            >
              <UserCircleIcon
                class="w-4 h-4"
                :class="
                  customer.id == formData.id ? 'text-white' : 'text-[#FF613c]'
                "
              />
            </div>
            <p class="text-[12px] font-medium">
              <span
                class=""
                :class="
                  customer.id == formData.id ? 'text-white' : 'text-[#FF613c]'
                "
                >{{ customer?.meta?.name }}</span
              >
            </p>
          </div>
        </div>
        <div class="w-full pt-4 px-4">
          <div
            @click="cancelAction()"
            class="bg-[#FF613c] cursor-pointer text-white rounded-xl text-center text-xs py-3"
          >
            + New Traveller
          </div>
        </div>
      </div>
      <div class="col-span-2 py-3 rounded-lg relative border border-gray-200">
        <p class="text-lg font-medium text-[#FF613c] px-4 pb-4">Details</p>
        <div class="grid grid-cols-2 h-[46vh] overflow-y-auto px-4 gap-4">
          <div class="col-span-2 grid grid-cols-2 gap-3">
            <div>
              <p class="text-xs pb-1.5 font-medium">Name *</p>
              <input
                type="text"
                v-model="formData.name"
                name=""
                placeholder="name"
                class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
                id=""
              />
            </div>
            <div>
              <p class="text-xs pb-1.5 font-medium">Passport</p>
              <input
                type="text"
                v-model="formData.passport"
                name=""
                placeholder="passport"
                class="border text-xs border-gray-200 px-4 py-3 rounded-lg w-full"
                id=""
              />
            </div>
            <div>
              <DOBInput v-model:formData="formData" />
            </div>
          </div>
          <div class="col-span-2">
            <div v-if="formData.file" class="w- col-span-4 w-full h-[200px]">
              <img
                :src="formData.file"
                class="rounded-lg shadow hover:shadow-none h-full object-contain object-left w-full"
                alt=""
                @click="showPassport = true"
              />
            </div>
            <div
              v-if="!formData.file && !passportPreview"
              @click="openFileFeaturePicker"
              class="w-full col-span-3 h-[300px] border rounded-lg border-dashed flex justify-center items-center text-[#FF613c] border-[#FF613c]"
            >
              <PlusCircleIcon class="w-8 h-8 text-[#FF613c]" />
            </div>
            <div v-if="passportPreview" class="w-full col-span-3 h-[300px]">
              <img
                :src="passportPreview"
                @click="openFileFeaturePicker"
                class="rounded-lg shadow hover:shadow-none h-full object-contain w-full"
                alt=""
              />
            </div>

            <input
              type="file"
              ref="featureImageInput"
              class="hidden"
              @change="handlerFeatureFileChange"
              accept="image/*"
            />
          </div>
          <div
            class="flex justify-end text-[#FF613c] absolute bottom-2 items-center w-full col-span-2 border-t pt-3 space-x-3 px-7"
          >
            <div class="flex justify-end items-center space-x-2">
              <!-- formData.id ? addTravellerUpdateAction() : addAction() -->
              <p
                @click="formData.id ? updateAction() : addNewAction()"
                class="px-3 py-1 bg-green-500 text-white text-[12px] cursor-pointer rounded-lg"
              >
                {{ formData.id ? "Update" : "Save" }}
              </p>

              <p
                v-if="formData.id"
                @click="removeFeatureDeleteImage(formData.id)"
                class="px-3 py-1 bg-red-600 text-white border border-gray-300 text-[12px] cursor-pointer rounded-lg"
              >
                Delete
              </p>
              <p
                @click="cancelAction"
                class="px-3 py-1 bg-white border border-gray-300 text-[12px] cursor-pointer rounded-lg"
              >
                Cancel
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PlusCircleIcon, UserCircleIcon } from "@heroicons/vue/24/outline";
import { onMounted, ref } from "vue";
import DOBInput from "../Reservation2Component/DOBInput.vue";
import { useGroupStore } from "../../stores/group";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";

const props = defineProps({
  detail: Object,
  getDetailAction: Function,
});

const groupStore = useGroupStore();
const loading = ref(false);
const route = useRoute();
const toast = useToast();

const formData = ref({
  id: "",
  name: "",
  passport: "",
  dob: "",
  file: "",
});

const openPassportModal = (data, index) => {
  console.log(data, "this is data");
  formData.value.id = data.id;
  formData.value.file = data.file;
  formData.value.name = data.meta.name;
  formData.value.passport = data.meta.passport_number;
  formData.value.dob = data.meta.dob ? data.meta.dob : "";
  // carModalOpen.value = true;
};

const featureImageInput = ref(null);
const passportPreview = ref("");
const passportFile = ref("");

const handlerFeatureFileChange = (e) => {
  let selectedFile = e.target.files[0];
  passportFile.value = selectedFile;
  passportPreview.value = URL.createObjectURL(selectedFile);
};

const openFileFeaturePicker = () => {
  featureImageInput.value.click();
};

const cancelAction = () => {
  formData.value = {
    id: "",
    name: "",
    passport: "",
    dob: "",
    file: "",
  };
  passportPreview.value = "";
};

const passportLists = ref([]);

const getListAction = async () => {
  loading.value = true;
  const id = route.query.id;
  const res = await groupStore.groupDocumentList(id, {
    document_type: "passport",
  });
  console.log(res);
  passportLists.value = res.result;
  loading.value = false;
};

const addNewAction = async () => {
  const frmData = new FormData();

  // Document type
  frmData.append("document_type", "passport");

  // Documents array - note the array notation
  frmData.append("documents[0][file]", passportFile.value);

  // Meta data for the first document
  frmData.append("documents[0][meta][name]", formData.value.name);
  frmData.append(
    "documents[0][meta][passport_number]",
    formData.value.passport
  );
  frmData.append("documents[0][meta][dob]", formData.value.dob);

  const res = await groupStore.groupDocumentCreateAction(
    frmData,
    route.query.id
  );
  console.log(res, "this is res");

  if (res.status == 1) {
    toast.success("Passport successfully added");
    cancelAction();
    await getListAction();
  }
};

const updateAction = async () => {
  const frmData = new FormData();

  // Document type
  frmData.append("document_type", "passport");

  // Single file (not array)
  if (passportFile.value) {
    frmData.append("file", passportFile.value);
  }

  // Meta data as individual fields or JSON
  // Option 1: Individual fields
  frmData.append("meta[name]", formData.value.name);
  frmData.append("meta[passport_number]", formData.value.passport);
  frmData.append("meta[dob]", formData.value.dob);

  frmData.append("_method", "PUT");

  const res = await groupStore.groupDocumentUpdateAction(
    frmData,
    route.query.id,
    formData.value.id
  );
  console.log(res, "this is res");

  if (res.status == 1) {
    toast.success("Passport successfully added");
    cancelAction();
    await getListAction();
  }
};

const removeFeatureDeleteImage = async () => {
  const res = await groupStore.groupDocumentDeleteAction(
    route.query.id,
    formData.value.id
  );
  console.log(res, "this is res");
  if (res.status == 1) {
    toast.success("Passport successfully deleted");
    cancelAction();
    await getListAction();
  }
};

onMounted(() => {
  getListAction();
});
</script>
