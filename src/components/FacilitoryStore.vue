<script setup>
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { ref, defineEmits, defineProps, onMounted } from "vue";
import { useFacilityStore } from "../stores/facility";
import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";

const props = defineProps({
  data: Array,
});

const toast = useToast();
const facilityStore = useFacilityStore();

const { facilities, loading } = storeToRefs(facilityStore);

const emit = defineEmits();

// const typeList = ref([]);

const formData = ref({
  id: "",
  name: "",
  list: [],
});
const errors = ref(null);

const chooseType = () => {
  // console.log(formData.value.list);
  emit("change", formData.value.list);
};

const addNew = () => {
  console.log("hello");
};

const actionHandler = () => {
  if (formData.value.id) {
    updateHandler();
  } else {
    addNewHandler();
  }
};

const editMood = (data) => {
  formData.value = {
    id: data.id,
    name: data.name,
  };
};
const deleteMood = async (id) => {
  const res = await facilityStore.deleteAction(id);
  toast.success("deleted success");
  await facilityStore.getSimpleListAction();
};

const addNewHandler = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  try {
    const response = await facilityStore.addNewAction(frmData);
    formData.value = {
      name: "",
    };
    errors.value = null;
    await facilityStore.getSimpleListAction();
    toast.success(response.message);
  } catch (error) {
    if (error.response.data.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response.data.message);
  }
};

const updateHandler = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("_method", "PUT");
  try {
    const response = await facilityStore.updateAction(
      frmData,
      formData.value.id
    );
    formData.value = {
      name: "",
      id: "",
    };
    errors.value = null;
    await facilityStore.getSimpleListAction();
    toast.success(response.message);
  } catch (error) {
    if (error.response.data.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response.data.message);
  }
};

onMounted(async () => {
  const res = await facilityStore.getSimpleListAction();
  formData.value.list = props.data;
  console.log(props.data, "this is data");
  // console.log(facilities.value);
  // typeList.value = facilities.value.data;
});
</script>

<template>
  <div class="pb-6 space-y-3 min-h-[550px]">
    <div class="space-y-3">
      <p class="text-sm">Select Facilities</p>
      <v-select
        v-model="formData.list"
        class="style-chooser"
        :options="facilities?.data ?? []"
        label="name"
        multiple
        :clearable="false"
        :reduce="(d) => d.id"
        @option:selected="chooseType"
        @click="chooseType"
        placeholder="Choose Facility"
      ></v-select>
    </div>
    <h3 class="text-sm pt-2">Facilities</h3>
    <form
      @submit.prevent="actionHandler"
      class="flex justify-between items-center gap-4"
    >
      <input
        type="text"
        name=""
        v-model="formData.name"
        id=""
        class="border border-gray-300 px-4 text-xs py-2 rounded-md w-full focus:outline-none"
        placeholder=" add new facility"
      />
      <button type="submit">
        <PlusIcon
          class="w-8 bg-[#ff613c] p-1 rounded-full text-white cursor-pointer"
        />
      </button>
    </form>
    <h3 class="text-sm pt-2">Facilities list</h3>
    <div
      class="flex justify-between items-center px-4 py-2 border border-gray-200 rounded-md"
      v-for="(i, index) in facilities?.data"
      :key="index"
    >
      <p>{{ i.name }}</p>
      <div class="flex justify-end items-center gap-3">
        <PencilIcon class="w-4" @click="editMood(i)" />
        <TrashIcon class="w-4" @click="deleteMood(i.id)" />
      </div>
    </div>
  </div>
</template>
