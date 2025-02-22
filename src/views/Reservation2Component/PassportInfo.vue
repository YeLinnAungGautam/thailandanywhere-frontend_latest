<template>
  <div>
    <div class="py-2 space-y-2 pr-1" v-if="!loading">
      <div class="grid grid-cols-5 col-span-2 gap-4 py-3 relative">
        <!-- <p
          class="bg-green-500 text-white px-4 py-1 inline-block absolute top-3 right-3 cursor-pointer rounded-full text-[12px]"
          @click="addTravellerAction"
        >
          save
        </p> -->
        <div
          v-if="detail?.product_type == 'App\\Models\\EntranceTicket'"
          class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
        >
          <p class="text-[10px] text-gray-500">Adult Qty</p>
          <p class="text-sm">{{ detail?.quantity }}</p>
        </div>
        <div
          v-if="detail?.product_type == 'App\\Models\\Hotel'"
          class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
        >
          <p class="text-[10px] text-gray-500">Room Qty</p>
          <p class="text-sm">{{ detail?.quantity }}</p>
        </div>
        <div
          v-if="detail?.product_type == 'App\\Models\\EntranceTicket'"
          class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
        >
          <p class="text-[10px] text-gray-500">Child Qty</p>
          <p class="text-sm">
            {{ detail?.individual_pricing?.child?.quantity ?? 0 }}
          </p>
        </div>
        <div
          v-if="detail?.product_type == 'App\\Models\\Hotel'"
          class="w-full space-y-1 border border-black/10 rounded-lg px-3 py-2 shadow hover:shadow-none"
        >
          <p class="text-[10px] text-gray-500">Extra Bed Qty</p>
          <p class="text-sm">-</p>
        </div>
      </div>

      <div class="pt-2 grid grid-cols-4 gap-4">
        <div class="space-y-2 pt-2" @click="carModalOpen = true">
          <div
            class="w-full h-[180px] border border-[#FF613c] text-[#FF613c] text-lg flex justify-center items-center rounded-lg border-dashed"
          >
            +
          </div>
          <div
            class="w-full px-4 pb-1 border-dashed border border-[#FF613c] space-y-2 text-[#FF613c] hover:shadow-none rounded-lg"
          >
            <p class="text-[10px] flex justify-start items-center pt-2">Name</p>
            <p class="text-[10px] flex justify-start items-center">
              Passport No.
            </p>
            <p class="text-[10px] flex justify-start items-center pb-2">DOB</p>
          </div>
        </div>
        <div
          v-for="(i, index) in featureImagePreview ?? []"
          :key="i"
          class="flex flex-col relative justify-stretch group space-y-2 w-full"
        >
          <p
            @click="removeFeatureSelectImage(index)"
            class="absolute top-4 cursor-pointer text-[8px] shadow right-2 text-xs text-white bg-red-600 px-2 py-0.5 rounded-lg"
          >
            <span class="text-[10px]">remove</span>
          </p>
          <div class="h-[180px] w-full">
            <img
              :src="i"
              class="rounded-lg shadow hover:shadow-none h-full object-cover w-full"
              alt=""
            />
          </div>
          <div
            class="w-full px-4 pb-1 border space-y-2 text-[#FF613c] border-gray-200 shadow hover:shadow-none rounded-lg"
          >
            <p class="text-[10px] flex justify-start items-center pt-2">
              <!-- <img :src="bathImage" alt="" class="w-4 h-4 mr-2" /> -->
              Name
            </p>
            <p class="text-[10px] flex justify-start items-center">
              <!-- <img :src="dateImage" alt="" class="w-3 h-3 mr-2" /> -->
              Passport No.
            </p>
            <p class="text-[10px] flex justify-start items-center pb-2">
              <!-- <img :src="dateImage" alt="" class="w-3 h-3 mr-2" /> -->
              DOB
            </p>
          </div>
        </div>
        <div
          v-for="(i, index) in editData.customer_passport_have ?? []"
          :key="i"
          class="flex flex-col relative justify-stretch group space-y-2 w-full"
        >
          <p
            @click="openPassportModal(i, index)"
            class="absolute top-4 cursor-pointer text-[8px] shadow right-2 text-xs text-white bg-[#FF613c] px-2 py-0.5 rounded-lg"
          >
            <span class="text-[10px]">edit</span>
          </p>
          <div class="h-[180px] w-full">
            <img
              :src="i?.file"
              class="rounded-lg shadow hover:shadow-none h-full object-cover w-full"
              alt=""
            />
          </div>
          <div
            class="w-full px-4 pb-1 border space-y-2 text-[#FF613c] border-gray-200 shadow hover:shadow-none rounded-lg"
          >
            <p class="text-[10px] flex justify-start items-center pt-2">
              <!-- <img :src="bathImage" alt="" class="w-4 h-4 mr-2" /> -->
              Name
            </p>
            <p class="text-[10px] flex justify-start items-center">
              <!-- <img :src="dateImage" alt="" class="w-3 h-3 mr-2" /> -->
              Passport No.
            </p>
            <p class="text-[10px] flex justify-start items-center pb-2">
              <!-- <img :src="dateImage" alt="" class="w-3 h-3 mr-2" /> -->
              DOB
            </p>
          </div>
        </div>
      </div>
    </div>
    <Modal :isOpen="carModalOpen" @closeModal="carModalOpen = false">
      <DialogPanel
        class="w-full max-w-xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
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
                    @click="removeFeatureDeleteImage(save.index, formData.id)"
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

const openPassportModal = (data, index) => {
  formData.value.id = data.id;
  formData.value.file = data.file;
  formData.value.name = data.name;
  formData.value.passport = data.passport_number;
  formData.value.dob = data.dob;
  carModalOpen.value = true;
};

const props = defineProps({
  detail: Object,
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

const removeFeatureDeleteImage = async (index, id) => {
  const res = await reservationStore.deleteTravellerImageAction(id);
  if (res) {
    editData.value.customer_passport_have.splice(index, 1);
    // featureImagePreview.value.splice(index, 1);
  }
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
    "passport",
    formData.value.passport ? formData.value.passport : "-"
  );
  frmData.append("dob", formData.value.dob);
  if (editData.value.customer_passport.length != 0) {
    for (let x = 0; x < editData.value.customer_passport.length; x++) {
      frmData.append("file", editData.value.customer_passport[0]);
    }
  }
  const res = await reservationStore.customerPassportAction(
    props.detail?.id,
    frmData
  );

  console.log(res, "this is res");
  if (res.message == "success") {
    toast.success(res.message);
  } else {
    toast.error(res.message);
  }
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
    props.detail?.id,
    formData.value.id,
    frmData
  );

  console.log(res, "this is res");
  if (res.message == "success") {
    toast.success(res.message);
  } else {
    toast.error(res.message);
  }
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
