<template>
  <div>
    <div class="grid grid-cols-5 gap-2">
      <div class="relative" v-for="p in customer_passport_list || []" :key="p">
        <img
          :src="p.passport"
          alt=""
          class="w-full h-[250px] object-cover border border-dashed border-[#FF613c] rounded-lg"
        />
        <p class="pt-2">{{ p.name || "-----" }}</p>
        <p>{{ p.passport_number || "-----" }}</p>
        <p
          @click="openPassportModal(p)"
          class="absolute bottom-7 right-0 text-[10px] text-white bg-[#FF613c] px-2 py-0.5 rounded"
        >
          edit
        </p>
        <div
          class="flex justify-start absolute top-0 left-2 items-center space-x-2"
        >
          <input
            type="checkbox"
            class="w-10 h-10 focus:outline-none"
            name=""
            v-model="p.selected"
            id=""
          />
          <span class="text-[10px] text-white"
            >If you don't want to show in confirmation please uncheck</span
          >
        </div>
      </div>
      <div
        @click="carModalOpen = true"
        class="w-full h-[250px] object-cover cursor-pointer border flex justify-center items-center text-3xl text-[#FF613c] border-dashed border-[#FF613c] rounded-lg"
      >
        +
      </div>
    </div>

    <Modal :isOpen="carModalOpen" @closeModal="carModalOpen = false">
      <DialogPanel
        class="w-full max-w-xl transform overflow-hidden rounded-lg mt-10 bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-2 px-4"
        >
          <p>Passport Infomation Add</p>
          <XCircleIcon class="w-5 h-5 text-white" @click="cancelAction" />
        </DialogTitle>
        <!-- show date  -->
        <div class="p-4">
          <div class="p-4">
            <div class="grid grid-cols-2 gap-8">
              <div v-if="formData.file" class="w-[200px] h-[200px]">
                <img
                  :src="formData.file"
                  class="rounded-lg shadow hover:shadow-none h-full object-cover w-full"
                  alt=""
                />
              </div>
              <div
                v-if="!formData.file && !passportPreview"
                @click="openFileFeaturePicker"
                class="w-[200px] h-[200px] border rounded-lg border-dashed flex justify-center items-center text-[#FF613c] border-[#FF613c]"
              >
                +
              </div>
              <div v-if="passportPreview" class="w-[200px] h-[200px]">
                <img
                  :src="passportPreview"
                  @click="openFileFeaturePicker"
                  class="rounded-lg shadow hover:shadow-none h-full object-cover w-full"
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
              <div class="space-y-4 relative pt-4">
                <div class="flex justify-between items-center">
                  <label for="" class="text-[12px] font-medium">Name </label>
                  <input
                    type="text"
                    v-model="formData.name"
                    name=""
                    placeholder="name"
                    class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    id=""
                  />
                </div>
                <div class="flex justify-between items-center">
                  <label for="" class="text-[12px] font-medium">Passport</label>
                  <input
                    type="text"
                    v-model="formData.passport"
                    name=""
                    placeholder="passport"
                    class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    id=""
                  />
                </div>
                <div class="flex justify-between items-center">
                  <label for="" class="text-[12px] font-medium">DOB </label>
                  <input
                    type="date"
                    v-model="formData.dob"
                    name=""
                    placeholder=""
                    class="w-[160px] px-2 py-1.5 rounded-lg shadow border border-gray-100 focus:outline-none text-xs"
                    id=""
                  />
                </div>

                <div
                  class="flex justify-end items-center space-x-2 absolute bottom-0 right-0"
                >
                  <p
                    @click="
                      formData.id ? addTravellerUpdateAction() : addAction()
                    "
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
      </DialogPanel>
    </Modal>
  </div>
</template>

<script setup>
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { ref, defineProps, onMounted } from "vue";
import { useReservationStore } from "../../stores/reservation";
import { useToast } from "vue-toastification";
import invoice from "../../assets/invoice_exp.jpg";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useRoute } from "vue-router";
// import PassportGenerate from "./PassportGenerate.vue";

const reservationStore = useReservationStore();
const toast = useToast();
const route = useRoute();

const editData = ref({
  customer_passport: [],
  customer_passport_have: [],
});

const formData = ref({
  id: "",
  name: "",
  passport: "",
  dob: "",
  file: "",
});

const loading = ref(false);

const carModalOpen = ref(false);

const openModal = () => {
  carModalOpen.value = true;
};

const openPassportModal = (data) => {
  console.log("====================================");
  console.log(data);
  console.log("====================================");
  formData.value.id = data.id;
  formData.value.file = data.passport;
  formData.value.name = data.name;
  formData.value.passport = data.passport_number;
  formData.value.dob = data.dob;
  carModalOpen.value = true;
};

const props = defineProps({
  detail_id: Number,
  customer_passport_list: Array,
  getDetailAction: Function,
});

const featureImageInput = ref(null);

const featureImagePreview = ref([]);
const passportPreview = ref("");
const passportFile = ref("");

const handlerFeatureFileChange = (e) => {
  let selectedFile = e.target.files[0];
  passportFile.value = selectedFile;
  passportPreview.value = URL.createObjectURL(selectedFile);
};

const addAction = () => {
  editData.value.customer_passport.push(passportFile.value);
  featureImagePreview.value.push(passportPreview.value);
  passportFile.value = "";
  passportPreview.value = "";
  carModalOpen.value = false;

  addTravellerAction();
};

const cancelAction = () => {
  formData.value = {
    id: "",
    name: "",
    passport: "",
    dob: "",
    file: "",
  };
  carModalOpen.value = false;
};

const openFileFeaturePicker = () => {
  featureImageInput.value.click();
};

const removeFeatureDeleteImage = async (id) => {
  const res = await reservationStore.deleteTravellerImageAction(id);

  toast.success("detected successfully");
  carModalOpen.value = false;
  // console.log(editData.value.customer_passport, "this is remove");

  formData.value = {
    id: "",
    name: "",
    passport: "",
    dob: "",
    file: "",
  };

  setTimeout(async () => {
    await props.getDetailAction(route.query.id);
  }, 1000);
};

const removeFeatureSelectImage = (index) => {
  editData.value.customer_passport.splice(index, 1);
  featureImagePreview.value.splice(index, 1);
  // console.log(editData.value.customer_passport, "this is remove");
};

const addTravellerAction = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name ? formData.value.name : "-");
  frmData.append(
    "passport_number",
    formData.value.passport ? formData.value.passport : "-"
  );
  frmData.append("dob", formData.value.dob);
  if (editData.value.customer_passport.length != 0) {
    for (let x = 0; x < editData.value.customer_passport.length; x++) {
      frmData.append("file", editData.value.customer_passport[0]);
    }
  }
  const res = await reservationStore.customerPassportAction(
    props.detail_id,
    frmData
  );

  console.log(res, "this is res");
  if (res.message == "File Updated") {
    toast.success(res.message);
  } else {
    toast.error(res.message);
  }
  carModalOpen.value = false;
  // props.closeTravellerModal();
  setTimeout(async () => {
    await props.getDetailAction(route.query.id);
  }, 1000);
};

const addTravellerUpdateAction = async () => {
  const frmData = new FormData();
  frmData.append("_method", "PUT");
  frmData.append("name", formData.value.name ? formData.value.name : "-");
  frmData.append(
    "passport_number",
    formData.value.passport ? formData.value.passport : "-"
  );
  frmData.append("dob", formData.value.dob);
  if (editData.value.customer_passport.length != 0) {
    for (let x = 0; x < editData.value.customer_passport.length; x++) {
      frmData.append("file", editData.value.customer_passport[0]);
    }
  }
  const res = await reservationStore.customerPassportUpdateAction(
    props.detail_id,
    formData.value.id,
    frmData
  );

  console.log(res, "this is res");
  if (res.message == "File Updated") {
    toast.success(res.message);
  } else {
    toast.error(res.message);
  }
  carModalOpen.value = false;
  // props.closeTravellerModal();
  setTimeout(async () => {
    await props.getDetailAction(route.query.id);
  }, 1000);
};

onMounted(() => {
  if (props.detail) {
    loading.value = true;

    editData.value.customer_passport_have =
      props.detail?.customer_passports.length > 0
        ? props.detail?.customer_passports
        : [];

    loading.value = false;
  }
});
</script>
