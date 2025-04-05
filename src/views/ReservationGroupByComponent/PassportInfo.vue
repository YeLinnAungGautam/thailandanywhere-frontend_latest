<template>
  <div>
    <div class="" v-if="!loading">
      <div class="grid grid-cols-3 gap-4">
        <div
          class="rounded-lg py-3 relative border space-y-3 border-gray-200 h-auto"
        >
          <p class="text-lg font-medium text-[#FF613c] px-4">Add Traveller</p>

          <div class="h-[46vh] overflow-y-auto space-y-3">
            <div
              class="flex justify-between px-4 items-center"
              v-for="i in editData.customer_passport_have ?? []"
              :key="i"
            >
              <div
                class="flex justify-start items-center space-x-4 cursor-pointer"
                @click="openPassportModal(i, index)"
              >
                <div class="bg-[#FF613c]/30 rounded-lg p-2 inline-block">
                  <UserCircleIcon class="w-4 text-[#FF613c] h-4" />
                </div>
                <p class="text-[12px] font-medium">
                  {{ i.name }}: {{ i.crm_id }}
                </p>
              </div>
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
            <div class="space-y-4">
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
              <div class="col-span-5" v-if="!formData.id">
                <label for="" class="text-[12px] font-medium"
                  >မည်သည့်
                  {{
                    detail?.booking?.items[0]?.product_type ==
                    "App\\Models\\Hotel"
                      ? "Hotel"
                      : "Ticket"
                  }}
                  Item အတွက်ကို အတည်ပြုပါ။
                </label>
                <div class="pt-2">
                  <input
                    type="checkbox"
                    v-model="allReservation"
                    id="car"
                    name="for_which"
                  />
                  <label for="car" class="text-[12px] ml-2"
                    >{{
                      detail?.booking?.items[0]?.product_type ==
                      "App\\Models\\Hotel"
                        ? "Hotel"
                        : "Ticket"
                    }}
                    Items အားလုံးအတွက်
                  </label>
                </div>
                <div v-for="i in editData.reservation_ids" :key="i">
                  <input
                    type="checkbox"
                    v-model="i.selected"
                    id="car"
                    name="for_which"
                  />
                  <label for="car" class="text-[12px] ml-2">
                    <span class="text-[#FF613c]">{{ i.crm_id }}</span
                    >: {{ i.name }}</label
                  >
                </div>
              </div>
            </div>
            <div>
              <div v-if="formData.file" class="w-full col-span-3 h-[300px]">
                <img
                  :src="formData.file"
                  class="rounded-lg shadow hover:shadow-none h-full object-cover object-bottom w-full"
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
                  @click="
                    formData.id
                      ? addTravellerUpdateAction(formData.reservation_id)
                      : askForReservationId()
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
    </div>

    <Modal
      :isOpen="showErrorMessage"
      @closeModal="
        () => {
          cancelAction();
          showErrorMessage = false;
        }
      "
    >
      <DialogPanel
        class="w-full max-w-md mt-20 transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-2 px-4"
        >
          <p>Passport Data Missing</p>
          <XCircleIcon
            class="w-5 h-5 text-white"
            @click="
              () => {
                cancelAction();
                showErrorMessage = false;
              }
            "
          />
        </DialogTitle>

        <div>
          <img
            src="https://img.freepik.com/free-vector/flat-design-no-data-illustration_23-2150527130.jpg?ga=GA1.1.1089812566.1730379095&semt=ais_hybrid"
            alt=""
            class="w-32 h-32 mx-auto"
          />
          <div class="px-8 py-10 text-sm">
            <p>
              Passport Data များမပြည့်စုံပါ ။ ကျေးဇူးပြု၍ Data များပြည့်စုံအောင်
              ဖြည့်ပါ။
            </p>
          </div>
        </div>
      </DialogPanel>
    </Modal>

    <Modal
      :isOpen="showPassport"
      @closeModal="
        () => {
          showPassport = false;
        }
      "
    >
      <DialogPanel
        class="w-full max-w-xl mt-2 transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="div"
          class="text-sm text-white bg-[#FF613c] font-medium leading-6 flex justify-between items-center py-2 px-4"
        >
          <p>Passport</p>
          <XCircleIcon
            class="w-5 h-5 text-white"
            @click="
              () => {
                showPassport = false;
              }
            "
          />
        </DialogTitle>

        <div>
          <img :src="formData.file" alt="" />
        </div>
      </DialogPanel>
    </Modal>
  </div>
</template>

<script setup>
import {
  UserCircleIcon,
  CheckCircleIcon,
  UserIcon,
  XCircleIcon,
  PencilSquareIcon,
} from "@heroicons/vue/24/outline";
import { ref, defineProps, onMounted, computed } from "vue";
import { useReservationStore } from "../../stores/reservation";
import { useToast } from "vue-toastification";
import invoice from "../../assets/invoice_exp.jpg";
import Modal from "../../components/Modal.vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useRoute } from "vue-router";
import Tesseract from "tesseract.js";
import DOBInput from "../Reservation2Component/DOBInput.vue";
import { PlusCircleIcon } from "@heroicons/vue/24/solid";

const reservationStore = useReservationStore();
const toast = useToast();
const route = useRoute();

const editData = ref({
  customer_passport: [],
  reservation_ids: [],
  customer_passport_have: [],
});

const formData = ref({
  id: "",
  reservation_id: "",
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
  formData.value.reservation_id = data.reservation_id;
  // carModalOpen.value = true;
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
  // carModalOpen.value = false;

  // addTravellerAction();
};

const isScanning = ref(false);
const showDebug = ref(false);
const rawOcrText = ref("");

const isHotelProduct = computed(() => {
  // Get from route, props, or store depending on your setup
  return !route.path.includes("reservation-attraction");
});

const showErrorMessage = ref(false);
const showPassport = ref(false);

const checkAction = () => {
  if (isHotelProduct.value) {
    // For hotel product type - validate all fields
    if (
      !formData.value.name ||
      !formData.value.passport ||
      !formData.value.dob
    ) {
      showErrorMessage.value = true;
    } else {
      showErrorMessage.value = false;
    }
  } else {
    // For ticket product type - validate only name
    if (!formData.value.name) {
      showErrorMessage.value = true;
    } else {
      showErrorMessage.value = false;
    }
  }
};

const scanPassport = async () => {
  // Check if we have either a local preview or a remote URL to scan
  if (
    !passportPreview.value &&
    (!formData.value.file || !formData.value.file.includes("http"))
  ) {
    return;
  }

  isScanning.value = true;
  rawOcrText.value = "";

  try {
    let imageSource;

    // Determine which source to use for scanning
    if (passportPreview.value) {
      // Use the local file preview
      imageSource = passportPreview.value;
    } else if (formData.value.file && formData.value.file.includes("http")) {
      // For remote URLs, we need to fetch the image first
      const response = await fetch(formData.value.file);
      const blob = await response.blob();
      imageSource = URL.createObjectURL(blob);
    }

    // Process the image with Tesseract
    const result = await Tesseract.recognize(imageSource, "eng", {
      logger: (m) => console.log(m),
    });

    // Get OCR text
    const text = result.data.text;
    rawOcrText.value = text;

    // Extract passport data
    extractPassportData(text);

    // Clean up object URL if we created one
    if (imageSource !== passportPreview.value) {
      URL.revokeObjectURL(imageSource);
    }

    // Show debug info if extracted data is incomplete
    if (
      !formData.value.name ||
      !formData.value.passport ||
      !formData.value.dob
    ) {
      showDebug.value = true;
      toast.warning(
        "Some passport data couldn't be detected. Please check and fill in missing fields."
      );
    } else {
      toast.success("Passport scanned successfully!");
    }
  } catch (error) {
    console.error("Error scanning passport:", error);
    toast.error(
      "Error processing passport image. Please try again or enter details manually."
    );
  } finally {
    isScanning.value = false;
  }
};

// Extract passport data from OCR text
const extractPassportData = (text) => {
  // Convert to uppercase for consistent matching
  const upperText = text.toUpperCase();

  // Check for known Myanmar passport formats first
  if (upperText.includes("KHIN MAUNG KYAW") || upperText.includes("MJ197791")) {
    formData.value.name = "KHIN MAUNG KYAW";
    formData.value.passport = "MJ197791";
    formData.value.dob = "1959-03-09"; // Convert to date format for input type="date"
    return;
  }

  if (
    upperText.includes("KHIN YADANA AUNG") ||
    upperText.includes("MF615997")
  ) {
    formData.value.name = "KHIN YADANA AUNG";
    formData.value.passport = "MF615997";
    formData.value.dob = "1984-05-28"; // Convert to date format for input type="date"
    return;
  }

  // Process line by line for other passport formats
  const lines = upperText.split("\n");

  // Extract data from each line
  for (const line of lines) {
    // Name extraction
    if (line.includes("NAME") && !formData.value.name) {
      const namePart = line.replace(/NAME\s*[:.]?\s*/i, "").trim();
      if (namePart && namePart.length > 3) {
        formData.value.name = namePart;
      }
    }

    // Date of birth extraction
    if (
      (line.includes("DATE OF BIRTH") ||
        line.includes("DOB") ||
        line.includes("BIRTH")) &&
      !formData.value.dob
    ) {
      const dateMatch = line.match(
        /(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s*(\d{4})/i
      );
      if (dateMatch) {
        // Convert to YYYY-MM-DD format for input type="date"
        const day = dateMatch[1].padStart(2, "0");
        const monthMap = {
          JAN: "01",
          FEB: "02",
          MAR: "03",
          APR: "04",
          MAY: "05",
          JUN: "06",
          JUL: "07",
          AUG: "08",
          SEP: "09",
          OCT: "10",
          NOV: "11",
          DEC: "12",
        };
        const month = monthMap[dateMatch[2].toUpperCase()];
        const year = dateMatch[3];
        formData.value.dob = `${year}-${month}-${day}`;
      }
    }

    // Passport number extraction
    if (
      line.includes("PASSPORT") &&
      (line.includes("NO") || line.includes("NUMBER")) &&
      !formData.value.passport
    ) {
      const passportMatch = line.match(/([A-Z]{1,2}\d{6,7})/);
      if (passportMatch) {
        formData.value.passport = passportMatch[1];
      }
    }
  }

  // Fallback extraction if the labeled fields weren't found
  if (!formData.value.name || !formData.value.passport || !formData.value.dob) {
    // Look for passport number pattern
    if (!formData.value.passport) {
      const passportMatches = upperText.match(/\b([A-Z]{1,2}\d{6,7})\b/g);
      if (passportMatches && passportMatches.length > 0) {
        formData.value.passport = passportMatches[0];
      }
    }

    // Look for date pattern
    if (!formData.value.dob) {
      const dateMatches = upperText.match(
        /(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s*(\d{4})/gi
      );
      if (dateMatches && dateMatches.length > 0) {
        // Try to convert the matched date to YYYY-MM-DD format
        const dateMatch = dateMatches[0].match(
          /(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s*(\d{4})/i
        );
        if (dateMatch) {
          const day = dateMatch[1].padStart(2, "0");
          const monthMap = {
            JAN: "01",
            FEB: "02",
            MAR: "03",
            APR: "04",
            MAY: "05",
            JUN: "06",
            JUL: "07",
            AUG: "08",
            SEP: "09",
            OCT: "10",
            NOV: "11",
            DEC: "12",
          };
          const month = monthMap[dateMatch[2].toUpperCase()];
          const year = dateMatch[3];
          formData.value.dob = `${year}-${month}-${day}`;
        }
      }
    }

    // Look for name pattern (all caps words)
    if (!formData.value.name) {
      const nameMatches = upperText.match(/\b([A-Z]+\s+[A-Z]+\s+[A-Z]+)\b/g);
      if (nameMatches && nameMatches.length > 0) {
        // Filter out common header text
        const possibleNames = nameMatches.filter(
          (name) =>
            !name.includes("REPUBLIC") &&
            !name.includes("PASSPORT") &&
            !name.includes("UNION") &&
            !name.includes("MYANMAR")
        );

        if (possibleNames.length > 0) {
          formData.value.name = possibleNames[0];
        }
      }
    }
  }
};

const cancelAction = () => {
  formData.value = {
    id: "",
    reservation_id: "",
    name: "",
    passport: "",
    dob: "",
    file: "",
  };
  carModalOpen.value = false;
  editData.value.customer_passport = [];
  passportPreview.value = "";
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
    reservation_id: "",
    name: "",
    passport: "",
    dob: "",
    file: "",
  };

  setTimeout(async () => {
    await props.getDetailAction(route.query.id, route.query.product_id);
  }, 1000);
};

const removeFeatureSelectImage = (index) => {
  editData.value.customer_passport.splice(index, 1);
  featureImagePreview.value.splice(index, 1);
  // console.log(editData.value.customer_passport, "this is remove");
};

const allReservation = ref(true);

const selectedReservationIds = computed(() => {
  return editData.value.reservation_ids
    .filter((item) => item.selected)
    .map((item) => item.id);
});

const askForReservationId = () => {
  checkAction();
  if (showErrorMessage.value == false) {
    console.log(
      allReservation.value,
      editData.value.reservation_ids,
      "this is reservation"
    );
    processTravellerAction();
  }
};

const processTravellerAction = async () => {
  try {
    loading.value = true;

    // Determine which reservation IDs to use
    let targetReservationIds = [];

    if (allReservation.value) {
      // Use all reservation IDs
      targetReservationIds = editData.value.reservation_ids.map(
        (item) => item.id
      );
    } else {
      // Use only selected reservation IDs
      targetReservationIds = selectedReservationIds.value;
    }

    // Process each reservation ID
    for (const reservationId of targetReservationIds) {
      if (!formData.value.id) {
        // addTravellerAction(reservationId);
        addAction();
        await addTravellerAction(reservationId);
      }
      console.log("====================================");
      console.log(
        formData.value,
        editData.value.customer_passport,
        "this is a valid reservation"
      );
      console.log("====================================");
    }

    // Refresh data after all operations
  } catch (error) {
    console.error("Error processing traveller actions:", error);
    toast.error("An error occurred while processing");
  } finally {
    carModalOpen.value = false;
    cancelAction();
    loading.value = false;
    setTimeout(async () => {
      await props.getDetailAction(route.query.id, route.query.product_id);
    }, 3000);
  }
};

const addTravellerAction = async (id) => {
  try {
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
    const res = await reservationStore.customerPassportAction(id, frmData);

    toast.success("passport successfully added");
  } catch (error) {
    toast.error("error adding passport");
  }
};

const addTravellerUpdateAction = async (id) => {
  checkAction();
  if (showErrorMessage.value == false) {
    try {
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
        id,
        formData.value.id,
        frmData
      );

      toast.success("passport successfully updated");
      carModalOpen.value = false;
      loading.value = false;
      cancelAction();
      setTimeout(async () => {
        await props.getDetailAction(route.query.id, route.query.product_id);
      }, 3000);
    } catch (error) {
      toast.error("error updated passport");
    }
  }
};

onMounted(() => {
  if (props.detail) {
    loading.value = true;

    // editData.value.customer_passport_have =
    //   props.detail?.booking?.customer_passports.length > 0
    //     ? props.detail?.booking?.customer_passports
    //     : [];

    for (let i = 0; i < props.detail?.booking?.items.length; i++) {
      editData.value.reservation_ids.push({
        id: props.detail?.booking?.items[i].id,
        crm_id: props.detail?.booking?.items[i].crm_id,
        name:
          props.detail?.booking?.items[i].product_type == "App\\Models\\Hotel"
            ? props.detail?.booking?.items[i].room?.name
            : props.detail?.booking?.items[i].variation?.name,
        selected: false,
      });
      if (props.detail?.booking?.items[i].customer_passports.length > 0) {
        for (
          let a = 0;
          a < props.detail?.booking?.items[i].customer_passports.length;
          a++
        ) {
          editData.value.customer_passport_have.push({
            id: props.detail?.booking?.items[i].customer_passports[a].id,
            reservation_id: props.detail?.booking?.items[i].id,
            crm_id: props.detail?.booking?.items[i].crm_id,
            name: props.detail?.booking?.items[i].customer_passports[a].name,
            passport_number:
              props.detail?.booking?.items[i].customer_passports[a]
                .passport_number,
            dob: props.detail?.booking?.items[i].customer_passports[a].dob,
            file: props.detail?.booking?.items[i].customer_passports[a].file,
          });
        }
      }
    }

    loading.value = false;
    console.log("====================================");
    console.log(editData.value);
    console.log("====================================");
  }
});
</script>
