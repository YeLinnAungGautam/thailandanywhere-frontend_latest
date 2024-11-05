<template>
  <div
    class="hidden p-6 mb-5 rounded-lg shadow-sm bg-white/60 md:col-span-3 md:block"
  >
    <div class="flex justify-between items-center">
      <h3 class="text-xl font-medium text-gray-600 tracking-wide mb-3">
        EntranceTicket Variations
      </h3>
      <p v-if="importLoading">import process is doing ...</p>
    </div>

    <!-- modal -->
    <Modal :isOpen="createModalOpen" @closeModal="closeModal">
      <DialogPanel
        class="w-full max-w-3xl p-4 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl"
      >
        <DialogTitle
          as="h3"
          class="mb-5 text-lg font-medium leading-6 text-gray-900"
        >
          {{ formData.id ? "Edit Variation" : "Add New Variation" }}
        </DialogTitle>
        <form
          @submit.prevent="onSubmitHandler"
          class="mt-2 grid grid-cols-2 gap-4"
        >
          <div class="mb-2 space-y-1">
            <label for="price" class="text-sm text-gray-800">Ticket Name</label>
            <input
              type="text"
              v-model="formData.price_name"
              id="price"
              class="w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.price" class="mt-1 text-sm text-red-600">
              {{ errors.price[0] }}
            </p>
          </div>
          <div class="mb-2 space-y-1">
            <label for="name" class="text-sm text-gray-800"
              >Attraction Name</label
            >
            <div
              v-if="entList.length == 0 && !entAction"
              @click="entAction = true"
              class="text-sm text-gray-500 hover:text-gray-600 border border-gray-300 rounded-md bg-white px-4 py-1.5 w-full flex justify-between items-center"
            >
              <p>
                {{
                  formData.entrance_name != ""
                    ? formData.entrance_name
                    : "choose airline"
                }}
              </p>
              <ArrowDownTrayIcon class="w-4 h-4" />
            </div>
            <v-select
              v-model="formData.entrance_ticket_id"
              class="style-chooser"
              v-if="entList.length != 0 && entAction"
              :options="entList ?? []"
              label="name"
              :clearable="false"
              :reduce="(entrance) => entrance.id"
              placeholder="Choose entrance"
            ></v-select>
          </div>
          <div class="flex justify-start items-center gap-x-2 col-span-2">
            <div class="mb-2 space-y-1 col-span-1">
              <label for="price" class="text-sm text-gray-800"
                >Adult Info</label
              >
              <input
                type="text"
                v-model="formData.adult_info"
                id="adult info"
                class="w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.adult_info" class="mt-1 text-sm text-red-600">
                {{ errors.adult_info[0] }}
              </p>
            </div>
            <div class="mb-2 space-y-1 col-span-1">
              <label for="price" class="text-sm text-gray-800">Price</label>
              <input
                type="number"
                v-model="formData.price"
                id="price"
                class="w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.price" class="mt-1 text-sm text-red-600">
                {{ errors.price[0] }}
              </p>
            </div>
            <div class="mb-2 space-y-1 col-span-1">
              <label for="price" class="text-sm text-gray-800"
                >Cost Price</label
              >
              <input
                type="number"
                v-model="formData.cost_price"
                id="cost_price"
                class="w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.cost_price" class="mt-1 text-sm text-red-600">
                {{ errors.cost_price[0] }}
              </p>
            </div>
            <div class="mb-2 space-y-1 col-span-1">
              <label for="price" class="text-sm text-gray-800"
                >Wolk in Price</label
              >
              <input
                type="number"
                v-model="formData.owner_price"
                id="owner_price"
                class="w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
              />
              <p v-if="errors?.owner_price" class="mt-1 text-sm text-red-600">
                {{ errors.owner_price[0] }}
              </p>
            </div>
          </div>
          <div class="col-span-2">
            <div class="col-span-2">
              <div class="flex items-center justify-start mb-2">
                <label class="text-sm block text-gray-600 mr-3" for="">
                  Child Price</label
                >
              </div>
              <div class="flex items-center justify-between gap-3 mb-3">
                <div class="flex-1">
                  <input
                    v-model="child_info_default.info"
                    type="text"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="child info"
                  />
                </div>
                <div class="flex-1">
                  <input
                    v-model="child_info_default.child_price"
                    type="text"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="enter prices"
                  />
                </div>
                <div class="flex-1">
                  <input
                    v-model="child_info_default.child_cost_price"
                    type="text"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="cost prices"
                  />
                </div>
                <div class="flex-1">
                  <input
                    v-model="child_info_default.child_owner_price"
                    type="text"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="owner prices"
                  />
                </div>
                <div class="flex-1">
                  <input
                    v-model="child_info_default.child_agent_price"
                    type="text"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="agent prices"
                  />
                </div>
                <div>
                  <button @click.prevent="addChildInfo" class="">
                    <i
                      class="fa-solid fa-plus text-sm font-semibold px-2 py-1 bg-blue-600 rounded-full shadow text-white"
                    ></i>
                  </button>
                </div>
              </div>
              <div
                class="flex items-center justify-between gap-3 mb-3"
                v-for="(p, index) in formData.child_info"
                :key="index"
              >
                <div class="flex-1">
                  <input
                    v-model="p.info"
                    type="text"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="child info"
                  />
                </div>
                <div class="flex-1">
                  <input
                    v-model="p.child_price"
                    type="text"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="enter prices"
                  />
                </div>
                <div class="flex-1">
                  <input
                    v-model="p.child_cost_price"
                    type="text"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="cost prices"
                  />
                </div>
                <div class="flex-1">
                  <input
                    v-model="p.child_owner_price"
                    type="text"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="owner prices"
                  />
                </div>
                <div class="flex-1">
                  <input
                    v-model="p.child_agent_price"
                    type="text"
                    id="title"
                    class="h-12 w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="agent prices"
                  />
                </div>
                <div>
                  <button @click.prevent="removeChildInfo(index)" class="">
                    <i
                      class="fa-solid fa-minus text-sm font-semibold px-2 py-1 bg-red-600 rounded-full shadow text-white"
                    ></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-2 space-y-1 flex justify-start items-center gap-3">
            <Switch
              v-model="enabled"
              :class="enabled ? ' bg-orange-600' : 'bg-gray-500'"
              class="relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            >
              <span class="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                :class="enabled ? 'translate-x-9' : 'translate-x-0'"
                class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
              />
            </Switch>
            <label for="room_price" class="text-sm text-gray-800"
              >Is Add On ?</label
            >
          </div>
          <div class="pt-6">
            <div class="mb-2 space-y-1 flex justify-start items-center gap-3">
              <Switch
                v-model="enabledMain"
                :class="enabledMain ? ' bg-orange-600' : 'bg-gray-500'"
                class="relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              >
                <span class="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  :class="enabledMain ? 'translate-x-9' : 'translate-x-0'"
                  class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                />
              </Switch>
              <label for="room_price" class="text-sm text-gray-800"
                >Is main of attraction ticket ?</label
              >
            </div>
            <div class="mb-2 space-y-1 flex justify-start items-center gap-3">
              <Switch
                v-model="enabledShow"
                :class="enabledShow ? ' bg-orange-600' : 'bg-gray-500'"
                class="relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              >
                <span class="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  :class="enabledShow ? 'translate-x-9' : 'translate-x-0'"
                  class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                />
              </Switch>
              <label for="room_price" class="text-sm text-gray-800"
                >Is show on thanywhere app ?</label
              >
            </div>
          </div>
          <div class="mb-2 space-y-1 col-span-2">
            <label for="description" class="text-sm text-gray-800"
              >Description</label
            >
            <textarea
              v-model="formData.description"
              rows="3"
              id="description"
              class="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.description" class="mt-1 text-sm text-red-600">
              {{ errors.description[0] }}
            </p>
          </div>

          <div class="mb-2 space-y-1">
            <label for="price" class="text-sm text-gray-800"
              >Youtube Link (mm)</label
            >
            <input
              type="text"
              v-model="formData.meta_data.youtube_mm_link"
              id="owner_price"
              class="w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
          </div>
          <div class="mb-2 space-y-1">
            <label for="price" class="text-sm text-gray-800"
              >Youtube Link (en)</label
            >
            <input
              type="text"
              v-model="formData.meta_data.youtube_en_link"
              id="owner_price"
              class="w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
          </div>
          <div class="col-span-2">
            <div class="">
              <div class="flex items-center justify-start mb-2">
                <label class="text-sm block mr-3 pb-2" for="">
                  Including Services (don't forget to click add button)</label
                >
              </div>
              <div class="flex items-start justify-between gap-3 mb-3">
                <div class="flex-1 space-y-2">
                  <input
                    v-model="title"
                    type="text"
                    id="title"
                    class="h-10 text-sm w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="enter title"
                  />
                </div>

                <div>
                  <button
                    @click.prevent="addNewService"
                    class="pt-2 rounded-lg"
                  >
                    <i
                      class="fa-solid fa-plus text-sm font-semibold px-2 py-1 bg-blue-600 rounded-full shadow text-white"
                    ></i>
                  </button>
                </div>
              </div>
              <div
                v-for="(p, index) in formData.services"
                :key="index"
                class="flex items-start justify-between gap-3 mb-3"
              >
                <div class="flex-1 space-y-2 px-2">
                  <p class="text-sm">{{ p }}</p>
                </div>

                <div>
                  <button
                    class="text-sm text-red-600"
                    @click.prevent="removeServiceItem(index)"
                  >
                    <i
                      class="fa-solid fa-minus text-sm font-semibold px-2 py-1 bg-red-500 rounded-full shadow text-white"
                    ></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-2 space-y-1 col-span-2">
            <label for="description" class="text-sm text-gray-800"
              >Images</label
            >
            <input
              multiple
              type="file"
              name=""
              ref="imagesInput"
              id=""
              @change="handlerImagesFileChange"
              class="hidden w-full h-12 px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
              accept="image/*"
            />
            <button
              class="text-sm text-blue-600 ml-4"
              @click.prevent="openFileImagePicker"
            >
              <i
                class="fa-solid fa-plus text-sm font-semibold px-2 py-1 bg-blue-600 rounded-full shadow text-white"
              ></i>
            </button>
            <div
              class="grid grid-cols-3 gap-2"
              v-if="imagesPreview.length != 0"
            >
              <div
                class="relative"
                v-for="(image, index) in imagesPreview"
                :key="index"
              >
                <button
                  @click.prevent="removeImageSelectImage(index)"
                  class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
                >
                  <XCircleIcon class="w-8 h-8 font-semibold" />
                </button>

                <img class="h-auto w-full rounded" :src="image" alt="" />
              </div>
            </div>
            <div
              class="grid grid-cols-3 gap-2"
              v-if="editImagesPreview.length != 0 && imagesPreview.length == 0"
            >
              <div
                class="relative"
                v-for="(image, index) in editImagesPreview"
                :key="index"
              >
                <button
                  @click.prevent="removeImageUpdateImage(formData.id, image.id)"
                  class="rounded-full text-sm text-red-600 items-center justify-center flex absolute top-[-0.9rem] right-[-0.7rem]"
                >
                  <XCircleIcon class="w-8 h-8 font-semibold" />
                </button>
                <img class="h-auto w-full rounded" :src="image.image" alt="" />
              </div>
            </div>
          </div>

          <div class="text-end flex justify-end items-center col-span-2">
            <p
              class="text-[#ff613c] cursor-pointer px-2 py-1.5 mr-2 rounded bg-transparent border border-[#ff613c]"
              @click="closeModal"
            >
              close
            </p>
            <Button type="submit" v-if="!authStore.isAgent"> Submit </Button>
          </div>
        </form>
      </DialogPanel>
    </Modal>

    <!-- search input sort filter -->
    <div class="flex items-center justify-between mb-8">
      <div class="space-x-2 flex justify-start items-center">
        <input
          type="text"
          v-model="search"
          class="w-3/5 sm:w-3/5 md:w-[300px] mr-3 border px-4 py-2 rounded-md shadow-sm focus:ring-0 focus:outline-none text-gray-500"
          placeholder="Search variations..."
        />
        <div
          v-if="entList.length == 0 && !entAction"
          @click="entAction = true"
          class="text-sm text-gray-500 hover:text-gray-600 border border-gray-300 rounded-md bg-white px-4 py-1.5 w-full flex justify-between items-center"
        >
          <p>choose airline</p>
          <ArrowDownTrayIcon class="w-4 h-4" />
        </div>
        <v-select
          class="style-chooser bg-white min-w-[250px]"
          v-if="entList.length != 0 && entAction"
          :options="entrances?.data"
          v-model="entrance_ticket_id"
          label="name"
          :clearable="false"
          :reduce="(entrance) => entrance.id"
          placeholder="Choose entrance"
        ></v-select>
        <AdjustmentsHorizontalIcon
          class="inline-block w-6 h-6 mx-2 text-gray-600 cursor-pointer"
        />
      </div>

      <div class="space-x-3">
        <Button
          :leftIcon="DocumentPlusIcon"
          intent="text"
          @click="importHandler"
        >
          Import
        </Button>
        <Button :leftIcon="ShareIcon" intent="text" @click="exportAction">
          Export
        </Button>
        <Button
          :leftIcon="PlusIcon"
          @click.prevent="openModal()"
          v-if="!authStore.isAgent"
        >
          Create
        </Button>
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
              Price Name
            </th>

            <th
              class="p-3 text-xs font-medium tracking-wide text-left"
              v-if="!authStore.isAgent"
            >
              Price
            </th>
            <th
              class="p-3 text-xs font-medium tracking-wide text-left"
              v-if="!authStore.isAgent"
            >
              Cost Price
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              Agent Price
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left w-30">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            class="bg-white even:bg-gray-50 hover:bg-gray-50"
            v-for="(r, index) in variations?.data"
            :key="index"
          >
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.id }}
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.name }}
            </td>

            <td
              class="p-3 text-xs text-gray-700 whitespace-nowrap"
              v-if="!authStore.isAgent"
            >
              {{ r.price }}
            </td>
            <td
              class="p-3 text-xs text-gray-700 whitespace-nowrap"
              v-if="!authStore.isAgent"
            >
              {{ r.cost_price }}
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.agent_price }}
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <button
                  @click.prevent="editModalOpenHandler(r)"
                  class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                >
                  <PencilSquareIcon class="w-5 h-5" v-if="!authStore.isAgent" />
                  <EyeIcon class="w-5 h-5" v-if="authStore.isAgent" />
                </button>

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
    <Pagination v-if="!loading" :data="variations" @change-page="changePage" />
    <Modal :isOpen="importModal" @closeModal="importModal = false">
      <DialogPanel
        class="w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          class="text-lg font-medium leading-6 text-gray-900 mb-5"
        >
          Import Process
        </DialogTitle>
        <form
          class="flex justify-between items-center"
          @submit.prevent="importActionHandler"
        >
          <input type="file" name="" @change="importFileAction" id="" />
          <button
            class="border hover:shadow-md border-gray-400 px-4 py-2 rounded-md"
          >
            Import
          </button>
        </form>
        <div class="mt-5 space-y-3 border border-gray-400 p-4 rounded-md">
          <p class="font-semibold">notice</p>
          <p class="text-xs">- file input must be CSV file .</p>
          <p class="text-xs">- All table data must be have .</p>
          <p class="text-xs">- Import process will take time may be longer</p>
          <p class="text-xs">- Process is working behind .</p>
          <p class="text-xs">
            - When finish process , system will show noti message
          </p>
          <p class="text-xs">
            - When fail the process , system will show noti message
          </p>
        </div>
      </DialogPanel>
    </Modal>
  </div>
</template>

<script setup>
import {
  PencilSquareIcon,
  TrashIcon,
  ShareIcon,
  DocumentPlusIcon,
  EyeIcon,
  TicketIcon,
  BuildingOfficeIcon,
  PlusIcon,
  UserGroupIcon,
  UsersIcon,
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
} from "@heroicons/vue/24/outline";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import Pagination from "../components/Pagination.vue";
import { onMounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import Modal from "../components/Modal.vue";
import { useEntranceStore } from "../stores/entrance";
import { useVariationStore } from "../stores/variations";
import { useAuthStore } from "../stores/auth";
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { Switch } from "@headlessui/vue";
import debounce from "lodash/debounce";

const createModalOpen = ref(false);
const toast = useToast();
const entranceStore = useEntranceStore();
const variationStore = useVariationStore();
const authStore = useAuthStore();

const { entrances } = storeToRefs(entranceStore);
const { variations, loading, importLoading } = storeToRefs(variationStore);

const search = ref("");
const errors = ref([]);

const enabled = ref(false);
const enabledMain = ref(false);
const enabledShow = ref(false);

const openModal = () => {
  createModalOpen.value = true;
  formData.value = {
    id: "",
    entrance_ticket_id: "",
    entrance_name: "",
    price: "",
    price_name: "",
    cost_price: "",
    agent_price: "",
    owner_price: "",
    adult_info: "",
    // child_price: "",
    // child_cost_price: "",
    // child_owner_price: "",
    // child_info: "",
    child_info: [],
    is_add_on: 0,
    periods: [],
    meta_data: {
      is_main: 0,
      is_show: 0,
      youtube_mm_link: "",
      youtube_en_link: "",
    },
    description: "",
    images: [],
    services: [],
  };
  enabled.value = false;
  imagesPreview.value = [];
  editImagesPreview.value = [];
};

const child_info_default = ref({
  info: "",
  child_price: "",
  child_cost_price: "",
  child_owner_price: "",
  child_agent_price: "",
});

const addChildInfo = () => {
  formData.value.child_info.push(child_info_default.value);
  child_info_default.value = {
    info: "",
    child_price: "",
    child_cost_price: "",
    child_owner_price: "",
    child_agent_price: "",
  };
};
const removeChildInfo = (index) => {
  formData.value.child_info.splice(index, 1);
};

const closeModal = () => {
  formData.value = {
    id: "",
    entrance_ticket_id: "",
    entrance_name: "",
    price: "",
    price_name: "",
    cost_price: "",
    agent_price: "",
    owner_price: "",
    adult_info: "",
    // child_price: "",
    // child_cost_price: "",
    // child_owner_price: "",
    // child_info: "",
    child_info: [],
    is_add_on: 0,
    periods: [],
    meta_data: {
      is_main: 0,
      is_show: 0,
      youtube_mm_link: "",
      youtube_en_link: "",
    },
    description: "",
    images: [],
    services: [],
  };
  enabled.value = false;
  imagesPreview.value = [];
  editImagesPreview.value = [];
  createModalOpen.value = false;
};

const formData = ref({
  id: "",
  entrance_ticket_id: "",
  entrance_name: "",
  cost_price: "",
  agent_price: "",
  owner_price: "",
  is_add_on: 0,
  periods: [],
  meta_data: {
    is_main: 0,
    is_show: 0,
    youtube_mm_link: "",
    youtube_en_link: "",
  },
  price_name: "",
  adult_info: "",
  // child_price: "",
  // child_cost_price: "",
  // child_owner_price: "",
  // child_info: "",
  child_info: [],
  price: "",
  description: "",
  images: [],
  services: [],
});

const formPeriod = ref({
  period_name: "",
  period_type: "",
  start_date: "",
  end_date: "",
  cost_price: "",
  owner_price: "",
  agent_price: "",
  price: "",
  // child_cost_price: "",
  // child_owner_price: "",
  // child_agent_price: "",
  // child_price: "",
});

const period_type_array = ref([
  {
    id: 1,
    name: "By the Day of Week",
    value: "by_the_day_of_week",
  },
  {
    id: 2,
    name: "By the Day",
    value: "by_the_day",
  },
]);

const addNewPerid = () => {
  formData.value.periods.push(formPeriod.value);
  formPeriod.value = {
    period_name: "",
    period_type: "",
    start_date: "",
    end_date: "",
    cost_price: "",
    owner_price: "",
    agent_price: "",
    price: "",
    child_cost_price: "",
    child_owner_price: "",
    child_agent_price: "",
    child_price: "",
  };
};

const removeFromPerid = (index) => {
  formData.value.periods.splice(index, 1);
};

const title = ref("");
const addNewService = () => {
  formData.value.services.push(title.value);
  title.value = "";
  console.log(formData.value.services, "this is array");
};
const removeServiceItem = (index) => {
  formData.value.services.splice(index, 1);
};

const editImagesPreview = ref([]);
const imagesPreview = ref([]);
const imagesInput = ref(null);

const openFileImagePicker = () => {
  imagesInput.value.click();
};

const handlerImagesFileChange = (e) => {
  console.log(e.target.files);
  let selectedFile = e.target.files;
  if (selectedFile) {
    for (let index = 0; index < selectedFile.length; index++) {
      formData.value.images.push(selectedFile[index]);
      imagesPreview.value.push(URL.createObjectURL(selectedFile[index]));
    }
  }
};

const removeImageSelectImage = (index) => {
  formData.value.images.splice(index, 1);
  imagesPreview.value.splice(index, 1);
  console.log(imagesPreview.value);
};

const addNewHandler = async () => {
  const frmData = new FormData();
  frmData.append("entrance_ticket_id", formData.value.entrance_ticket_id);

  frmData.append("description", formData.value.description);
  frmData.append("price", formData.value.price);
  formData.value.cost_price
    ? frmData.append("cost_price", formData.value.cost_price)
    : 0;
  formData.value.agent_price
    ? frmData.append("agent_price", formData.value.agent_price)
    : 0;
  formData.value.owner_price
    ? frmData.append("owner_price", formData.value.owner_price)
    : 0;
  formData.value.adult_info &&
    frmData.append("adult_info", formData.value.adult_info);
  // formData.value.child_price
  //   ? frmData.append("child_price", formData.value.child_price)
  //   : 0;
  // formData.value.child_owner_price
  //   ? frmData.append("child_owner_price", formData.value.child_owner_price)
  //   : 0;
  // formData.value.child_cost_price
  //   ? frmData.append("child_cost_price", formData.value.child_cost_price)
  //   : 0;
  // formData.value.child_info &&
  //   frmData.append("child_info", formData.value.child_info);
  for (var x = 0; x < formData.value.child_info.length; x++) {
    frmData.append(
      "child_info[" + x + "][info]",
      formData.value.child_info[x].info
    );
    frmData.append(
      "child_info[" + x + "][child_price]",
      formData.value.child_info[x].child_price
    );
    frmData.append(
      "child_info[" + x + "][child_owner_price]",
      formData.value.child_info[x].child_owner_price
    );
    frmData.append(
      "child_info[" + x + "][child_cost_price]",
      formData.value.child_info[x].child_cost_price
    );
    frmData.append(
      "child_info[" + x + "][child_agent_price]",
      formData.value.child_info[x].child_agent_price
    );
  }

  frmData.append("is_add_on", enabled.value ? 1 : 0);
  if (
    formData.value.meta_data?.youtube_en_link ||
    formData.value.meta_data?.youtube_mm_link
  ) {
    frmData.append(
      "meta_data[0][youtube_mm_link]",
      formData.value.meta_data.youtube_mm_link
    );
    frmData.append(
      "meta_data[0][youtube_en_link]",
      formData.value.meta_data.youtube_en_link
    );
  }
  enabledMain.value
    ? frmData.append("meta_data[0][is_main]", 1)
    : frmData.append("meta_data[0][is_main]", 0);
  enabledShow.value
    ? frmData.append("meta_data[0][is_show]", 1)
    : frmData.append("meta_data[0][is_show]", 0);

  frmData.append("name", formData.value.price_name);
  if (formData.value.images.length > 0) {
    for (let i = 0; i < formData.value.images.length; i++) {
      let file = formData.value.images[i];
      frmData.append("images[" + i + "]", file);
    }
  }
  if (formData.value.services.length > 0) {
    for (let i = 0; i < formData.value.services.length; i++) {
      frmData.append(
        "including_services[" + i + "]",
        formData.value.services[i]
      );
    }
  }

  try {
    const response = await variationStore.addNewAction(frmData);
    formData.value = {
      id: "",
      entrance_ticket_id: "",
      entrance_name: "",
      cost_price: "",
      agent_price: "",
      owner_price: "",
      adult_info: "",
      // child_price: "",
      // child_cost_price: "",
      // child_owner_price: "",
      // child_info: "",
      child_info: [],
      is_add_on: 0,
      periods: [],
      meta_data: {
        is_main: 0,
        is_show: 0,
        youtube_mm_link: "",
        youtube_en_link: "",
      },
      price_name: "",
      price: "",
      description: "",
      images: [],
      services: [],
    };
    errors.value = null;
    enabled.value = false;
    createModalOpen.value = false;
    imagesPreview.value = [];
    editImagesPreview.value = [];
    await variationStore.getListAction({
      search: search.value,
      entrance_ticket_id: entrance_ticket_id.value,
    });
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
  frmData.append("entrance_ticket_id", formData.value.entrance_ticket_id);
  frmData.append("description", formData.value.description);
  frmData.append("price", formData.value.price);
  frmData.append("cost_price", formData.value.cost_price);
  frmData.append("agent_price", formData.value.agent_price);
  frmData.append("owner_price", formData.value.owner_price);
  formData.value.adult_info &&
    frmData.append("adult_info", formData.value.adult_info);
  // formData.value.child_price
  //   ? frmData.append("child_price", formData.value.child_price)
  //   : 0;
  // formData.value.child_owner_price
  //   ? frmData.append("child_owner_price", formData.value.child_owner_price)
  //   : 0;
  // formData.value.child_cost_price
  //   ? frmData.append("child_cost_price", formData.value.child_cost_price)
  //   : 0;
  // formData.value.child_info &&
  //   frmData.append("child_info", formData.value.child_info);
  for (var x = 0; x < formData.value.child_info.length; x++) {
    frmData.append(
      "child_info[" + x + "][info]",
      formData.value.child_info[x].info
    );
    frmData.append(
      "child_info[" + x + "][child_price]",
      formData.value.child_info[x].child_price
    );
    frmData.append(
      "child_info[" + x + "][child_owner_price]",
      formData.value.child_info[x].child_owner_price
    );
    frmData.append(
      "child_info[" + x + "][child_cost_price]",
      formData.value.child_info[x].child_cost_price
    );
    frmData.append(
      "child_info[" + x + "][child_agent_price]",
      formData.value.child_info[x].child_agent_price
    );
  }
  frmData.append("is_add_on", enabled.value ? 1 : 0);
  if (
    formData.value.meta_data?.youtube_en_link ||
    formData.value.meta_data?.youtube_mm_link
  ) {
    frmData.append(
      "meta_data[0][youtube_mm_link]",
      formData.value.meta_data.youtube_mm_link
    );
    frmData.append(
      "meta_data[0][youtube_en_link]",
      formData.value.meta_data.youtube_en_link
    );
  }
  enabledMain.value
    ? frmData.append("meta_data[0][is_main]", 1)
    : frmData.append("meta_data[0][is_main]", 0);
  enabledShow.value
    ? frmData.append("meta_data[0][is_show]", 1)
    : frmData.append("meta_data[0][is_show]", 0);
  frmData.append("name", formData.value.price_name);

  if (formData.value.images.length > 0) {
    for (let i = 0; i < formData.value.images.length; i++) {
      let file = formData.value.images[i];
      frmData.append("images[" + i + "]", file);
    }
  }
  if (formData.value.services) {
    if (formData.value.services.length > 0) {
      for (let i = 0; i < formData.value.services.length; i++) {
        frmData.append(
          "including_services[" + i + "]",
          formData.value.services[i]
        );
      }
    } else {
      frmData.append("including_services[0]", "");
    }
  }
  frmData.append("_method", "PUT");
  try {
    const response = await variationStore.updateAction(
      frmData,
      formData.value.id
    );
    formData.value = {
      id: "",
      entrance_ticket_id: "",
      entrance_name: "",
      cost_price: "",
      agent_price: "",
      owner_price: "",
      adult_info: "",
      // child_price: "",
      // child_cost_price: "",
      // child_owner_price: "",
      // child_info: "",
      child_info: [],
      is_add_on: 0,
      periods: [],
      meta_data: {
        is_main: 0,
        is_show: 0,
        youtube_mm_link: "",
        youtube_en_link: "",
      },
      price_name: "",
      price: "",
      description: "",
      images: [],
      services: [],
    };
    errors.value = null;
    enabled.value = false;
    createModalOpen.value = false;
    imagesPreview.value = [];
    editImagesPreview.value = [];
    await variationStore.getListAction({
      search: search.value,
      entrance_ticket_id: entrance_ticket_id.value,
    });
    toast.success(response.message);
  } catch (error) {
    if (error.response.data.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response.data.message);
  }
};

const onSubmitHandler = async () => {
  if (formData.value.id) {
    updateHandler();
  } else {
    addNewHandler();
  }
};

const editModalOpenHandler = (data) => {
  console.log(data, "this is edit data");
  formData.value.id = data.id;
  formData.value.entrance_ticket_id = data.entrance_ticket?.id;
  formData.value.entrance_name = data.entrance_ticket?.name;
  formData.value.cost_price = data.cost_price;
  formData.value.agent_price = data.agent_price;
  formData.value.owner_price = data.owner_price;
  formData.value.adult_info = data.adult_info;
  // formData.value.child_price = data.child_price;
  // formData.value.child_cost_price = data.child_cost_price;
  // formData.value.child_owner_price = data.child_owner_price;
  // formData.value.child_info = data.child_info;
  formData.value.child_info = data.child_info;

  enabled.value = data.is_add_on == 1;
  if (data.meta_data != null && data?.meta_data?.length > 0) {
    enabledMain.value = data.meta_data[0]?.is_main == 1;
    enabledShow.value = data.meta_data[0]?.is_show == 1;
    formData.value.meta_data.youtube_mm_link =
      data.meta_data[0]?.youtube_mm_link;
    formData.value.meta_data.youtube_en_link =
      data.meta_data[0]?.youtube_en_link;
  }
  formData.value.price_name = data.name;
  formData.value.price = data.price;
  formData.value.description = data.description;
  createModalOpen.value = true;
  if (data.images.length > 0) {
    for (let i = 0; i < data.images.length; i++) {
      editImagesPreview.value.push(data.images[i]);
    }
  }
  if (data?.including_services && data?.including_services?.length > 0) {
    formData.value.services = data?.including_services;
  }
  console.log(editImagesPreview.value);
};

const removeImageUpdateImage = async (id, imageID) => {
  console.log(id, imageID, "this is delete image id");
  const res = variationStore.deleteImageAction(id, imageID);
  console.log(res, "delete image res");
  toast.success("delete image success");
  createModalOpen.value = false;
  imagesPreview.value = [];
  editImagesPreview.value = [];
  await variationStore.getListAction({ search: search.value });
};

const changePage = async (url) => {
  console.log(url);
  let data = {
    search: search.value,
    entrance_ticket_id: entrance_ticket_id.value,
  };
  await variationStore.getChangePage(url, data);
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
        const response = await variationStore.deleteAction(id);
        toast.success(response.message);
      } catch (error) {
        if (error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
        toast.error(error.response.data.message);
      }
      await variationStore.getListAction({
        search: search.value,
        entrance_ticket_id: entrance_ticket_id.value,
      });
    }
  });
};

const entList = ref([]);
const entrance_ticket_id = ref("");

const exportAction = async () => {
  const res = await variationStore.downloadExport();
  if (res) {
    window.open(res.result.download_link);
  }
};

// import functions
const importModal = ref(false);
const importHandler = () => {
  importModal.value = !importModal.value;
};
const fileImport = ref(null);
const importFileAction = (e) => {
  let file = e.target.files[0];
  fileImport.value = file;
};
const importActionHandler = async () => {
  const frmData = new FormData();
  frmData.append("file", fileImport.value);
  try {
    importModal.value = false;
    const res = await variationStore.importAction(frmData);
    fileImport.value = null;
    console.log(res);
    toast.success(`entrance ticket variations ${res.message}`);
  } catch (e) {
    // errors.value = e.response.data.errors;
    importModal.value = false;
    toast.error(e.response.data.message);
  }
};

const entAction = ref(false);

watch(entAction, async (newValue) => {
  if (newValue == true) {
    await entranceStore.getSimpleListAction();
    entList.value = entrances.value.data;
  }
});

onMounted(async () => {
  await variationStore.getListAction({
    search: search.value,
    entrance_ticket_id: entrance_ticket_id.value,
  });
});

// watch(search, async (newValue) => {
//   await variationStore.getListAction({
//     search: search.value,
//     entrance_ticket_id: entrance_ticket_id.value,
//   });
// });
watch(
  search,
  debounce(async (newValue) => {
    await variationStore.getListAction({
      search: search.value,
      entrance_ticket_id: entrance_ticket_id.value,
    });
  }, 500)
);

watch(entrance_ticket_id, async (newValue) => {
  await variationStore.getListAction({
    search: search.value,
    entrance_ticket_id: entrance_ticket_id.value,
  });
});
</script>
