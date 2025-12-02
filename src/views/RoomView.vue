<template>
  <div
    class="hidden p-6 mb-5 rounded-lg shadow-sm bg-white/60 md:col-span-3 md:block"
  >
    <div class="flex justify-between items-center">
      <h3 class="text-xl font-medium text-gray-600 tracking-wide mb-3">
        Rooms
      </h3>
      <p v-if="importLoading">import process is doing ...</p>
    </div>

    <!-- modal -->
    <Modal :isOpen="createModalOpen" @closeModal="closeModal">
      <DialogPanel
        class="w-full max-w-5xl p-4 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl"
      >
        <DialogTitle
          as="div"
          class="mb-5 flex justify-between items-center text-lg font-medium leading-6 text-gray-900"
        >
          <p>{{ formData.id ? "Edit Room" : "Add New Room" }}</p>
          <div class="flex justify-end items-center gap-2 text-xs">
            <p
              class="px-4 py-2 cursor-pointer rounded-md"
              @click="quiteSwitch = 1"
              :class="
                quiteSwitch == 1 ? 'bg-[#ff613c] text-white' : 'bg-gray-200'
              "
            >
              quit
            </p>
            <p
              class="px-4 py-2 cursor-pointer rounded-md"
              @click="quiteSwitch = 2"
              :class="
                quiteSwitch == 2 ? 'bg-[#ff613c] text-white' : 'bg-gray-200'
              "
            >
              room amenities
            </p>
            <p
              class="px-4 py-2 cursor-pointer rounded-md"
              @click="quiteSwitch = 3"
              :class="
                quiteSwitch == 3 ? 'bg-[#ff613c] text-white' : 'bg-gray-200'
              "
            >
              period
            </p>
          </div>
        </DialogTitle>
        <form
          @submit.prevent="onSubmitHandler"
          class="mt-2 grid grid-cols-2 gap-2"
        >
          <!-- Basic Room Information -->
          <div class="mb-2 space-y-1" v-if="quiteSwitch == 1">
            <label for="name" class="text-sm text-gray-800">Name</label>
            <input
              type="text"
              v-model="formData.name"
              id="name"
              class="w-full h-10 text-sm px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.name" class="mt-1 text-sm text-red-600">
              {{ errors.name[0] }}
            </p>
          </div>

          <!-- Hotel Selection -->
          <div v-if="quiteSwitch == 1">
            <p class="mb-2 text-sm text-gray-800">Hotel</p>
            <div class="relative">
              <input
                type="text"
                v-model="modalHotelSearchQuery"
                @input="searchModalHotels"
                @focus="showModalHotelDropdown = true"
                class="w-full h-10 text-sm px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
                placeholder="Search and select hotel..."
              />
              <div
                v-if="showModalHotelDropdown && modalHotelResults.length > 0"
                class="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1"
              >
                <div
                  v-for="hotel in modalHotelResults"
                  :key="hotel.id"
                  @click="selectModalHotel(hotel)"
                  class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {{ hotel.name }}
                </div>
              </div>
              <button
                v-if="modalSelectedHotel"
                @click="clearModalHotelSelection"
                type="button"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>

          <div
            class="mb-2 space-y-1"
            v-if="!authStore.isAgent && quiteSwitch == 1"
          >
            <label for="room_price" class="text-sm text-gray-800"
              >Room Price</label
            >
            <input
              type="text"
              v-model="formData.room_price"
              id="room_price"
              class="w-full h-10 text-sm px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.room_price" class="mt-1 text-sm text-red-600">
              {{ errors.room_price[0] }}
            </p>
          </div>
          <div class="mb-2 space-y-1" v-if="quiteSwitch == 1">
            <label for="room_price" class="text-sm text-gray-800"
              >Max Person</label
            >
            <input
              type="text"
              v-model="formData.max_person"
              id="max_person"
              class="w-full h-10 text-sm px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.max_person" class="mt-1 text-sm text-red-600">
              {{ errors.max_person[0] }}
            </p>
          </div>
          <div
            class="mb-2 space-y-1"
            v-if="!authStore.isAgent && quiteSwitch == 1"
          >
            <label for="room_price" class="text-sm text-gray-800">Cost</label>
            <input
              type="number"
              v-model="formData.cost"
              id="cost"
              class="w-full h-10 text-sm px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.cost" class="mt-1 text-sm text-red-600">
              {{ errors.cost[0] }}
            </p>
          </div>
          <div class="mb-2 space-y-1" v-if="quiteSwitch == 1">
            <label for="room_price" class="text-sm text-gray-800"
              >Walk in Price ( owner price )</label
            >
            <input
              type="number"
              v-model="formData.owner_price"
              id="owner_price"
              class="w-full h-10 text-sm px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
            <p v-if="errors?.owner_price" class="mt-1 text-sm text-red-600">
              {{ errors.owner_price[0] }}
            </p>
          </div>

          <!-- Room Features -->
          <div>
            <div
              class="mb-2 space-y-1 flex justify-between pr-4 items-center gap-3"
              v-if="quiteSwitch == 1"
            >
              <label for="room_price" class="text-sm text-gray-800"
                >Is Extra ?</label
              >
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
            </div>

            <div
              class="mb-2 space-y-1 flex justify-between pr-4 items-center gap-3"
              v-if="quiteSwitch == 1"
            >
              <label for="room_price" class="text-sm text-gray-800"
                >Has Breakfast ?</label
              >
              <Switch
                v-model="enabledhas"
                :class="enabledhas ? ' bg-orange-600' : 'bg-gray-500'"
                class="relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              >
                <span class="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  :class="enabledhas ? 'translate-x-9' : 'translate-x-0'"
                  class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                />
              </Switch>
            </div>
            <div
              class="mb-2 space-y-1 flex justify-between pr-4 items-center gap-3"
              v-if="quiteSwitch == 1"
            >
              <label for="room_price" class="text-sm text-gray-800"
                >Is Double Bed Room ?</label
              >
              <Switch
                v-model="enabledDouble"
                :class="enabledDouble ? ' bg-orange-600' : 'bg-gray-500'"
                class="relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              >
                <span class="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  :class="enabledDouble ? 'translate-x-9' : 'translate-x-0'"
                  class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                />
              </Switch>
            </div>
            <div
              class="mb-2 space-y-1 flex justify-between pr-4 items-center gap-3"
              v-if="quiteSwitch == 1"
            >
              <label for="room_price" class="text-sm text-gray-800"
                >Is Twin Bed Room ?</label
              >
              <Switch
                v-model="enabledTwin"
                :class="enabledTwin ? ' bg-orange-600' : 'bg-gray-500'"
                class="relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              >
                <span class="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  :class="enabledTwin ? 'translate-x-9' : 'translate-x-0'"
                  class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                />
              </Switch>
            </div>
            <div
              class="mb-2 space-y-1 flex justify-between pr-4 items-center gap-3"
              v-if="quiteSwitch == 1"
            >
              <label for="room_price" class="text-sm text-gray-800"
                >Is Show on Website ?</label
              >
              <Switch
                v-model="enabledShowOn"
                :class="enabledShowOn ? ' bg-orange-600' : 'bg-gray-500'"
                class="relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              >
                <span class="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  :class="enabledShowOn ? 'translate-x-9' : 'translate-x-0'"
                  class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                />
              </Switch>
            </div>
          </div>
          <div class="mb-2 space-y-1" v-if="quiteSwitch == 1">
            <label for="room_price" class="text-sm text-gray-800"
              >Room Size</label
            >
            <input
              type="text"
              v-model="formData.room_size"
              id="room_size"
              class="w-full h-10 text-sm px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
            />
          </div>

          <!-- Period Management -->
          <div class="col-span-2" v-if="quiteSwitch == 3">
            <div class="">
              <div class="flex items-center justify-start mb-2">
                <label class="text-sm block text-red-500 mr-3" for="">
                  Period (don't forget to click add button)</label
                >
              </div>
              <div class="flex items-center justify-between gap-3 mb-3">
                <div class="flex-1">
                  <input
                    v-model="formPeriod.period_name"
                    type="text"
                    id="title"
                    class="h-10 text-sm w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="enter name"
                  />
                </div>
                <div class="flex-1">
                  <input
                    v-model="formPeriod.start_date"
                    type="date"
                    id="title"
                    class="h-10 text-sm w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="enter prices"
                    title="start date"
                  />
                </div>
                <div class="flex-1">
                  <input
                    v-model="formPeriod.end_date"
                    type="date"
                    id="title"
                    class="h-10 text-sm w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    title="end date"
                  />
                </div>
                <div class="flex-1" v-if="!authStore.isAgent">
                  <input
                    v-model="formPeriod.sale_price"
                    type="number"
                    id="title"
                    class="h-10 text-sm w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="sale price"
                  />
                </div>
                <div class="flex-1" v-if="!authStore.isAgent">
                  <input
                    v-model="formPeriod.cost_price"
                    type="number"
                    id="title"
                    class="h-10 text-sm w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="cost price"
                  />
                </div>
                <div class="flex-1">
                  <input
                    v-model="formPeriod.agent_price"
                    type="number"
                    id="title"
                    class="h-10 text-sm w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="agent price"
                  />
                </div>
                <div
                  class="border border-gray-300 rounded-md shadow-sm px-4 py-2"
                >
                  <p
                    v-if="formPeriod.sale_price && formPeriod.cost_price"
                    class="text-sm text-gray-600"
                  >
                    {{
                      (
                        (formPeriod.sale_price - formPeriod.cost_price) /
                        formPeriod.sale_price
                      ).toFixed(2)
                    }}
                  </p>
                  <p v-else class="text-sm text-gray-600">0</p>
                </div>

                <div>
                  <button @click.prevent="addNewPerid" class="">
                    <i
                      class="fa-solid fa-plus text-sm font-semibold px-2 py-1 bg-blue-600 rounded-full shadow text-white"
                    ></i>
                  </button>
                </div>
              </div>
              <div
                v-for="(p, index) in formData.period"
                :key="index"
                class="flex items-center justify-between gap-3 mb-3"
              >
                <div class="flex-1">
                  <input
                    v-model="p.period_name"
                    type="text"
                    id="title"
                    class="h-10 text-sm w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="enter name"
                  />
                </div>
                <div class="flex-1">
                  <input
                    v-model="p.start_date"
                    type="date"
                    id="title"
                    class="h-10 text-sm w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="enter prices"
                    title="start date"
                  />
                </div>
                <div class="flex-1">
                  <input
                    v-model="p.end_date"
                    type="date"
                    id="title"
                    class="h-10 text-sm w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    title="end date"
                  />
                </div>
                <div class="flex-1" v-if="!authStore.isAgent">
                  <input
                    v-model="p.sale_price"
                    type="number"
                    id="title"
                    class="h-10 text-sm w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="sale price"
                  />
                </div>
                <div class="flex-1" v-if="!authStore.isAgent">
                  <input
                    v-model="p.cost_price"
                    type="number"
                    id="title"
                    class="h-10 text-sm w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="cost price"
                  />
                </div>
                <div class="flex-1">
                  <input
                    v-model="p.agent_price"
                    type="number"
                    id="title"
                    class="h-10 text-sm w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="agent price"
                  />
                </div>
                <div
                  class="border border-gray-300 rounded-md shadow-sm px-4 py-2"
                >
                  <p
                    v-if="p.sale_price && p.cost_price"
                    class="text-sm text-gray-600"
                  >
                    {{
                      ((p.sale_price - p.cost_price) / p.sale_price).toFixed(2)
                    }}
                  </p>
                  <p v-else class="text-sm text-gray-600">0</p>
                </div>
                <div class="space-x-2">
                  <button
                    class="text-sm text-red-600"
                    @click.prevent="copyPerid(index)"
                  >
                    <i
                      class="fa-solid fa-copy text-sm font-semibold px-2 py-1 bg-blue-500 rounded-full shadow text-white"
                    ></i>
                  </button>
                  <button
                    class="text-sm text-red-600"
                    @click.prevent="removeFromPerid(index)"
                  >
                    <i
                      class="fa-solid fa-minus text-sm font-semibold px-2 py-1 bg-red-500 rounded-full shadow text-white"
                    ></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-2 space-y-1" v-if="quiteSwitch == 1">
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
          <div class="mb-2 space-y-1" v-if="quiteSwitch == 1">
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
              class="hidden w-full h-10 text-sm px-4 py-2 text-gray-900 border-2 border-gray-300 rounded-md shadow-sm bg-white/50 focus:outline-none focus:border-gray-300"
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

          <!-- Room Amenities Section -->
          <div class="col-span-2" v-if="quiteSwitch == 2">
            <div class="">
              <div class="flex items-center justify-start mb-2">
                <label class="text-sm block mr-3" for="">
                  Room amenities (don't forget to click add button)</label
                >
              </div>
              <div class="flex items-start justify-between gap-3 mb-3">
                <div class="flex-1 space-y-2">
                  <input
                    v-model="room_amen.title"
                    type="text"
                    id="title"
                    class="h-10 text-sm w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                    placeholder="enter title"
                  />

                  <div
                    class="flex-1 pl-20 flex justify-between items-center gap-2"
                  >
                    <input
                      v-model="room_amen_list.list_name"
                      type="text"
                      id="title"
                      class="h-10 text-sm w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                      placeholder="enter title"
                    />
                    <button @click.prevent="addNewRoomAmenList" class="pt-1">
                      <i
                        class="fa-solid fa-plus text-sm font-semibold px-2 py-1 bg-blue-600 rounded-full shadow text-white"
                      ></i>
                    </button>
                  </div>
                  <div
                    class="flex-1 pl-20 flex justify-between items-center gap-2"
                    v-for="(l, index) in room_amen.list ?? []"
                    :key="index"
                  >
                    <input
                      v-model="l.list_name"
                      type="text"
                      id="title"
                      class="h-10 text-sm w-full bg-white/50 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-300"
                      placeholder="enter title"
                    />
                    <button
                      @click.prevent="removeRoomAmenListItem(index)"
                      class="pt-1"
                    >
                      <i
                        class="fa-solid fa-minus text-sm font-semibold px-2 py-1 bg-red-500 rounded-full shadow text-white"
                      ></i>
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    @click.prevent="addNewRoomAmen"
                    class="pt-2 bg-gray-200 px-4 pb-2 rounded-lg"
                  >
                    <i
                      class="fa-solid fa-plus text-sm font-semibold px-2 py-1 bg-blue-600 rounded-full shadow text-white"
                    ></i>
                    final add
                  </button>
                </div>
              </div>
              <div
                v-for="(p, index) in formData.room_amen"
                :key="index"
                class="flex items-start border border-gray-300 rounded-lg px-6 py-4 justify-between gap-3 mb-3"
              >
                <div class="flex-1 space-y-2">
                  <p class="font-semibold text-base">{{ p?.title }}</p>
                  <div
                    class="flex justify-start items-center gap-2"
                    v-for="b in p?.list ?? []"
                    :key="b"
                  >
                    <div class="w-1.5 h-1.5 bg-black rounded-full"></div>
                    <p class="text-[12px]">{{ b.list_name }}</p>
                  </div>
                </div>

                <div>
                  <button
                    class="text-sm text-red-600"
                    @click.prevent="removeRoomAmenItem(index)"
                  >
                    <i
                      class="fa-solid fa-minus text-sm font-semibold px-2 py-1 bg-red-500 rounded-full shadow text-white"
                    ></i>
                  </button>
                </div>
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
    <div class="flex items-start justify-between mb-8">
      <div class="flex justify-start flex-wrap items-center gap-2">
        <input
          type="text"
          v-model="search"
          class="w-3/5 sm:w-3/5 md:w-[200px] border px-4 py-1.5 rounded-lg shadow-sm focus:ring-0 focus:outline-none text-gray-500"
          placeholder="Search Rooms..."
        />

        <!-- Hotel Search Dropdown -->
        <div class="relative min-w-[200px]">
          <input
            type="text"
            v-model="hotelSearchQuery"
            @input="searchHotels"
            @focus="showHotelDropdown = true"
            class="w-full border px-4 py-1.5 rounded-lg shadow-sm focus:ring-0 focus:outline-none text-gray-500"
            placeholder="Search hotels..."
          />
          <div
            v-if="showHotelDropdown && hotelSearchResults.length > 0"
            class="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1"
          >
            <div
              v-for="hotel in hotelSearchResults"
              :key="hotel.id"
              @click="selectHotel(hotel)"
              class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {{ hotel.name }}
            </div>
            <div
              v-if="hotelSearchResults.length === 0 && hotelSearchQuery"
              class="px-4 py-2 text-gray-500"
            >
              No hotels found
            </div>
          </div>
          <!-- Clear button -->
          <button
            v-if="selectedHotel"
            @click="clearHotelSelection"
            type="button"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <input
          type="date"
          v-model="start_date"
          class="w-3/5 sm:w-3/5 md:w-[200px] border px-4 py-1.5 rounded-lg shadow-sm focus:ring-0 focus:outline-none text-gray-500"
          title="start date"
        />
        <input
          type="date"
          v-model="end_date"
          class="w-3/5 sm:w-3/5 md:w-[200px] border px-4 py-1.5 rounded-lg shadow-sm focus:ring-0 focus:outline-none text-gray-500"
          title="end date"
        />

        <!-- Price Sort Dropdown -->
        <select
          v-model="priceSortOrder"
          class="min-w-[200px] border px-4 text-sm py-1.5 rounded-lg shadow-sm focus:ring-0 focus:outline-none text-gray-500"
        >
          <option value="">Sort by Price</option>
          <option value="high_to_low">Price: High to Low</option>
          <option value="low_to_high">Price: Low to High</option>
        </select>

        <!-- Score Sort Dropdown -->
        <select
          v-model="scoreSortOrder"
          class="min-w-[200px] border px-4 text-sm py-1.5 rounded-lg shadow-sm focus:ring-0 focus:outline-none text-gray-500"
        >
          <option value="">Sort by Score</option>
          <option value="high_to_low">Score: High to Low</option>
          <option value="low_to_high">Score: Low to High</option>
        </select>

        <button
          class="px-2 py-1.5 bg-[#ff613c] rounded-md text-white"
          @click="searchFunction"
          v-if="start_date && end_date"
        >
          search
        </button>
        <button
          class="px-2 py-1.5 bg-[#ff613c] rounded-md text-white"
          @click="clearFunction"
          v-if="
            start_date ||
            end_date ||
            search ||
            selectedHotel ||
            scoreSortOrder ||
            priceSortOrder
          "
        >
          clear
        </button>
      </div>
      <div class="space-y-2 flex justify-end items-center gap-2 flex-wrap">
        <div class="gap-3 flex flex-wrap justify-end items-center">
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
            @click.prevent="createModalOpen = true"
            v-if="!authStore.isAgent"
          >
            Create
          </Button>
          <Button
            :leftIcon="PlusIcon"
            @click.prevent="roomModal = true"
            v-if="!authStore.isAgent"
          >
            Room Facilities
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
            <th
              class="p-3 text-xs font-medium tracking-wide text-left max-w-[300px] overflow-hidden"
            >
              Name
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              Description
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              Hotel
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              Room Price
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
              Score
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left w-30">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            class="bg-white even:bg-gray-50 hover:bg-gray-50"
            v-for="(r, index) in paginatedItems"
            :key="index"
          >
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.id }}
            </td>
            <td
              class="p-3 text-xs text-gray-700 whitespace-wrap max-w-[300px] overflow-hidden"
            >
              {{ r.name }}
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ limitedText(r.description) }}
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.hotel?.name }}
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              <p v-if="!authStore.isAgent">{{ r.room_price }}</p>
              <p v-if="authStore.isAgent">{{ r.agent_price }}</p>
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.score ?? "N/A" }}
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
                  v-if="authStore.isSuperAdmin"
                  @click.prevent="onDeleteHandler(r.id)"
                  class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-red-500 hover:text-white"
                >
                  <TrashIcon class="w-5 h-5" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedItems.length == 0">
            <td
              class="text-center h-[300px] text-sm text-red-500 font-medium"
              colspan="7"
            >
              No rooms found. Please adjust your search criteria.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- pagination -->
    <Pagination
      v-if="!loading && !pagiantionShow && rooms?.data"
      :data="rooms"
      @change-page="changePage"
    />
    <div
      v-if="!loading && pagiantionShow"
      class="flex justify-between items-center text-sm"
    >
      <div class="px-4 py-2 bg-gray-300 rounded-lg">
        Page: {{ currentPage }} / {{ totalPages }}
      </div>
      <div class="flex justify-end items-center gap-2 text-sm">
        <button
          @click="prevPage"
          class="px-4 py-2 bg-[#FF5B00] text-white rounded-lg"
          :disabled="currentPage === 1"
        >
          Previous
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-[#FF5B00] text-white rounded-lg"
        >
          Next
        </button>
      </div>
    </div>

    <!-- import -->
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

    <!-- create room modal -->
    <RoomListModal :isOpen="roomModal" :closeModal="closeRoomModal" />
  </div>
</template>

<script setup>
import {
  PencilSquareIcon,
  TrashIcon,
  ShareIcon,
  EyeIcon,
  DocumentPlusIcon,
  PlusIcon,
  XCircleIcon,
} from "@heroicons/vue/24/outline";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import Pagination from "../components/Pagination.vue";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import Button from "../components/Button.vue";
import { storeToRefs } from "pinia";
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";
import Modal from "../components/Modal.vue";
import { useHotelStore } from "../stores/hotel";
import { useRoomStore } from "../stores/room";
import { useAuthStore } from "../stores/auth";
import { Switch } from "@headlessui/vue";
import debounce from "lodash/debounce";
import RoomListModal from "./RoomfacilityComponent/ListModal.vue";

const createModalOpen = ref(false);
const roomModal = ref(false);
const closeRoomModal = () => {
  roomModal.value = false;
};
const toast = useToast();
const hotelStore = useHotelStore();
const roomStore = useRoomStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const { rooms, loading, importLoading } = storeToRefs(roomStore);

const search = ref("");
const errors = ref([]);
const enabled = ref(false);
const enabledhas = ref(false);
const enabledDouble = ref(false);
const enabledTwin = ref(false);
const enabledShowOn = ref(false);
const quiteSwitch = ref(1);
const roomShowList = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Hotel search variables
const hotelSearchQuery = ref("");
const hotelSearchResults = ref([]);
const showHotelDropdown = ref(false);
const selectedHotel = ref(null);

// Modal hotel search variables
const modalHotelSearchQuery = ref("");
const modalHotelResults = ref([]);
const showModalHotelDropdown = ref(false);
const modalSelectedHotel = ref(null);

// Sort variables
const scoreSortOrder = ref("");
const priceSortOrder = ref("");

// Pagination
const pagiantionShow = ref(false);

// Form data
const formData = ref({
  id: "",
  name: "",
  hotel_id: null,
  description: "",
  max_person: "",
  is_extra: 0,
  has_breakfast: 0,
  is_double: 0,
  is_twin: 0,
  room_size: "",
  period: [],
  images: [],
  room_amen: [],
  room_price: "",
  cost: "",
  agent_price: "",
  owner_price: "",
});

const editImagesPreview = ref([]);
const imagesPreview = ref([]);
const imagesInput = ref(null);

// Room amenities
const room_amen = ref({
  title: "",
  list: [],
});
const room_amen_list = ref([
  {
    list_name: "",
  },
]);

// Period
const formPeriod = ref({
  period_name: "",
  start_date: "",
  end_date: "",
  sale_price: "",
  cost_price: "",
  agent_price: "",
});

// Search and filter variables
const hotel_id = ref("");
const start_date = ref("");
const end_date = ref("");
const periodAjj = ref("");

// Import
const importModal = ref(false);
const fileImport = ref(null);

// Computed properties
const paginatedItems = computed(() => {
  const data = roomShowList.value?.data || [];
  if (pagiantionShow.value) {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return data.slice(start, end);
  }
  return data;
});

const totalPages = computed(() => {
  if (!pagiantionShow.value) return 1;
  const data = roomShowList.value?.data || [];
  return Math.ceil(data.length / itemsPerPage.value);
});

// Hotel search functions
const searchHotels = debounce(async (event) => {
  const query = {
    search: event.target.value,
    limit: 5,
  };
  hotelSearchResults.value = [];
  showHotelDropdown.value = false;

  try {
    const response = await hotelStore.getListAction(query);
    console.log(response, "this is hotel response");

    hotelSearchResults.value = response.result.data || [];
    showHotelDropdown.value = true;
  } catch (error) {
    console.error("Hotel search error:", error);
    hotelSearchResults.value = [];
    showHotelDropdown.value = false;
  }
}, 300);

const selectHotel = (hotel) => {
  selectedHotel.value = hotel;
  hotelSearchQuery.value = hotel.name;
  hotel_id.value = hotel.id;
  showHotelDropdown.value = false;
  performSearch();
};

const clearHotelSelection = () => {
  selectedHotel.value = null;
  hotelSearchQuery.value = "";
  hotel_id.value = "";
  showHotelDropdown.value = false;
  performSearch();
};

// Modal hotel search functions
const searchModalHotels = debounce(async (event) => {
  const query = {
    search: event.target.value,
    limit: 5,
  };

  modalHotelResults.value = [];
  showModalHotelDropdown.value = false;

  try {
    const response = await hotelStore.getListAction(query);
    console.log(response, "this is hotel response");
    modalHotelResults.value = response.result.data || [];
    showModalHotelDropdown.value = true;
  } catch (error) {
    console.error("Modal hotel search error:", error);
    modalHotelResults.value = [];
    showModalHotelDropdown.value = false;
  }
}, 300);

const selectModalHotel = (hotel) => {
  modalSelectedHotel.value = hotel;
  modalHotelSearchQuery.value = hotel.name;
  formData.value.hotel_id = hotel.id;
  showModalHotelDropdown.value = false;
};

const clearModalHotelSelection = () => {
  modalSelectedHotel.value = null;
  modalHotelSearchQuery.value = "";
  formData.value.hotel_id = null;
  showModalHotelDropdown.value = false;
};

// Search function
const performSearch = async () => {
  const searchParams = {
    hotel_id: hotel_id.value,
    search: search.value,
    period: periodAjj.value,
    limit: 10,
  };

  // Add sorting parameters
  if (scoreSortOrder.value) {
    searchParams.order_by_score = scoreSortOrder.value;
    // Clear price sort when score sort is selected
    priceSortOrder.value = "";
  }

  if (priceSortOrder.value && !scoreSortOrder.value) {
    searchParams.order_by_price = priceSortOrder.value;
  }

  await roomStore.getListAction(searchParams);
  pagiantionShow.value = false;
  currentPage.value = 1;
};

// Pagination methods
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};

// Utility functions
const limitedText = (text) => {
  if (text && text.length > 30) {
    return text.slice(0, 30) + "...";
  }
  return text || "";
};

const formatScore = (score) => {
  if (!score || score === 0) return "0%";
  return `${Math.round(score * 100)}%`;
};

const getScoreClass = (score) => {
  if (!score || score === 0) return "bg-gray-100 text-gray-800";
  if (score < 0.3) return "bg-red-100 text-red-800";
  if (score < 0.6) return "bg-yellow-100 text-yellow-800";
  return "bg-green-100 text-green-800";
};

// Modal functions
const closeModal = () => {
  formData.value = {
    id: "",
    name: "",
    hotel_id: null,
    is_extra: 0,
    has_breakfast: 0,
    is_double: 0,
    is_twin: 0,
    room_size: "",
    period: [],
    description: "",
    max_person: "",
    images: [],
    room_price: "",
    room_amen: [],
    cost: "",
    agent_price: "",
    owner_price: "",
  };
  errors.value = null;
  enabled.value = false;
  enabledhas.value = false;
  enabledDouble.value = false;
  enabledTwin.value = false;
  enabledShowOn.value = false;
  createModalOpen.value = false;
  imagesPreview.value = [];
  editImagesPreview.value = [];
  modalSelectedHotel.value = null;
  modalHotelSearchQuery.value = "";
  quiteSwitch.value = 1;
};

// Room amenities functions
const addNewRoomAmen = () => {
  if (room_amen.value.title.trim()) {
    formData.value.room_amen.push({ ...room_amen.value });
    room_amen.value = {
      title: "",
      list: [],
    };
  }
};

const addNewRoomAmenList = () => {
  if (room_amen_list.value.list_name.trim()) {
    room_amen.value.list.push({ ...room_amen_list.value });
    room_amen_list.value = {
      list_name: "",
    };
  }
};

const removeRoomAmenItem = (index) => {
  formData.value.room_amen.splice(index, 1);
};

const removeRoomAmenListItem = (index) => {
  room_amen.value.list.splice(index, 1);
};

// Period functions
const addNewPerid = () => {
  if (formPeriod.value.period_name.trim()) {
    formData.value.period.push({ ...formPeriod.value });
    formPeriod.value = {
      period_name: "",
      start_date: "",
      end_date: "",
      sale_price: "",
      cost_price: "",
      agent_price: "",
    };
  }
};

const removeFromPerid = (index) => {
  formData.value.period.splice(index, 1);
};

const copyPerid = (index) => {
  const period = formData.value.period[index];
  formPeriod.value = {
    period_name: period.period_name,
    start_date: "",
    end_date: "",
    sale_price: period.sale_price,
    cost_price: period.cost_price,
    agent_price: period.agent_price,
  };
};

// Image handling
const openFileImagePicker = () => {
  imagesInput.value.click();
};

const handlerImagesFileChange = (e) => {
  const selectedFiles = e.target.files;
  if (selectedFiles) {
    for (let index = 0; index < selectedFiles.length; index++) {
      formData.value.images.push(selectedFiles[index]);
      imagesPreview.value.push(URL.createObjectURL(selectedFiles[index]));
    }
  }
};

const removeImageSelectImage = (index) => {
  formData.value.images.splice(index, 1);
  imagesPreview.value.splice(index, 1);
};

const removeImageUpdateImage = async (roomId, imageId) => {
  try {
    await roomStore.deleteImageAction(roomId, imageId);
    toast.success("Image deleted successfully");
    editImagesPreview.value = editImagesPreview.value.filter(
      (img) => img.id !== imageId
    );
  } catch (error) {
    toast.error("Failed to delete image");
  }
};

// Form submission
const updateHandler = async () => {
  const frmData = new FormData();

  // Basic fields
  frmData.append("name", formData.value.name);
  frmData.append("hotel_id", formData.value.hotel_id);
  frmData.append("description", formData.value.description);
  frmData.append("max_person", formData.value.max_person);
  frmData.append("room_price", formData.value.room_price);
  frmData.append("cost", formData.value.cost || 0);
  frmData.append("agent_price", formData.value.agent_price);
  frmData.append("owner_price", formData.value.owner_price);

  // Boolean fields
  frmData.append("is_extra", enabled.value ? 1 : 0);
  frmData.append("has_breakfast", enabledhas.value ? 1 : 0);
  frmData.append("meta[is_double]", enabledDouble.value ? 1 : 0);
  frmData.append("meta[is_twin]", enabledTwin.value ? 1 : 0);
  frmData.append("meta[is_show_on]", enabledShowOn.value ? 1 : 0);
  frmData.append("meta[room_size]", formData.value.room_size);

  // Images
  if (formData.value.images.length > 0) {
    for (let i = 0; i < formData.value.images.length; i++) {
      frmData.append(`images[${i}]`, formData.value.images[i]);
    }
  }

  // Amenities
  if (formData.value.room_amen.length > 0) {
    for (let i = 0; i < formData.value.room_amen.length; i++) {
      frmData.append(
        `amenities[${i}][title]`,
        formData.value.room_amen[i].title
      );
      for (let l = 0; l < formData.value.room_amen[i].list.length; l++) {
        frmData.append(
          `amenities[${i}][list][${l}]`,
          formData.value.room_amen[i].list[l].list_name
        );
      }
    }
  }

  // Periods
  if (formData.value.period.length > 0) {
    for (let x = 0; x < formData.value.period.length; x++) {
      frmData.append(
        `periods[${x}][period_name]`,
        formData.value.period[x].period_name
      );
      frmData.append(
        `periods[${x}][start_date]`,
        formData.value.period[x].start_date
      );
      frmData.append(
        `periods[${x}][end_date]`,
        formData.value.period[x].end_date
      );
      frmData.append(
        `periods[${x}][sale_price]`,
        formData.value.period[x].sale_price
      );
      frmData.append(
        `periods[${x}][cost_price]`,
        formData.value.period[x].cost_price
      );
      frmData.append(
        `periods[${x}][agent_price]`,
        formData.value.period[x].agent_price
      );
    }
  } else if (formData.value.period.length === 0 && formData.value.id) {
    frmData.append("periods", JSON.stringify([]));
  }

  if (formData.value.id) {
    frmData.append("_method", "PUT");
  }

  try {
    const response = formData.value.id
      ? await roomStore.updateAction(frmData, formData.value.id)
      : await roomStore.addNewAction(frmData);
    toast.success(response.message);
    closeModal();
    performSearch();
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
    }
    toast.error(error.response?.data?.message || "An error occurred");
  }
};

const onSubmitHandler = async () => {
  updateHandler();
};

const editModalOpenHandler = async (data) => {
  formData.value.id = data.id;
  formData.value.name = data.name;
  formData.value.hotel_id = data.hotel.id;

  // Set modal hotel search
  modalSelectedHotel.value = data.hotel;
  modalHotelSearchQuery.value = data.hotel?.name;

  enabled.value = data.is_extra == 1;
  enabledhas.value = data.has_breakfast == 1;
  enabledDouble.value = data.meta?.is_double == 1;
  enabledTwin.value = data.meta?.is_twin == 1;
  enabledShowOn.value = data.meta?.is_show_on == 1;
  formData.value.room_size = data.meta?.room_size || "";
  formData.value.max_person = data.max_person;
  formData.value.room_price = data.room_price;
  formData.value.description = data.description;
  formData.value.cost = data.cost;
  formData.value.agent_price = data.agent_price;
  formData.value.owner_price = data.owner_price;

  // Handle images
  if (data.images?.length > 0) {
    editImagesPreview.value = [...data.images];
  }

  // Handle amenities
  if (data.amenities?.length > 0) {
    formData.value.room_amen = data.amenities.map((amenity) => ({
      title: amenity.title,
      list: (amenity.list || []).map((item) => ({
        list_name: typeof item === "string" ? item : item.list_name,
      })),
    }));
  }

  // Handle periods
  if (data.room_periods?.length > 0) {
    formData.value.period = data.room_periods.map((period) => ({
      period_name: period.period_name,
      start_date: period.start_date,
      end_date: period.end_date,
      sale_price: period.sale_price,
      cost_price: period.cost_price,
      agent_price: period.agent_price,
    }));
  }

  createModalOpen.value = true;
};

const changePage = async (url) => {
  const data = {
    search: search.value,
    hotel_id: hotel_id.value,
    period: periodAjj.value,
  };
  await roomStore.getChangePage(url, data);
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
        const response = await roomStore.deleteAction(id);
        toast.success(response.message);
        performSearch();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete room");
      }
    }
  });
};

const exportAction = async () => {
  try {
    const res = await roomStore.downloadExport();
    if (res?.result?.download_link) {
      window.open(res.result.download_link);
    }
  } catch (error) {
    toast.error("Export failed");
  }
};

const searchFunction = async () => {
  if (start_date.value && end_date.value) {
    periodAjj.value = `${start_date.value} , ${end_date.value}`;
    performSearch();
  }
};

const clearFunction = () => {
  selectedHotel.value = null;
  hotelSearchQuery.value = "";
  hotel_id.value = "";
  start_date.value = "";
  end_date.value = "";
  search.value = "";
  periodAjj.value = "";
  scoreSortOrder.value = "";
  priceSortOrder.value = "";
  performSearch();
};

// Import functions
const importHandler = () => {
  importModal.value = !importModal.value;
};

const importFileAction = (e) => {
  fileImport.value = e.target.files[0];
};

const importActionHandler = async () => {
  if (!fileImport.value) {
    toast.error("Please select a file");
    return;
  }

  const frmData = new FormData();
  frmData.append("file", fileImport.value);

  try {
    importModal.value = false;
    const res = await roomStore.importAction(frmData);
    fileImport.value = null;
    toast.success(`Room ${res.message}`);
    performSearch();
  } catch (e) {
    importModal.value = false;
    toast.error(e.response?.data?.message || "Import failed");
  }
};

// Watchers
watch(
  search,
  debounce(async (newValue) => {
    performSearch();
  }, 500)
);

watch(hotel_id, async (newValue) => {
  performSearch();
});

watch(periodAjj, async (newValue) => {
  performSearch();
});

watch(scoreSortOrder, async (newValue) => {
  if (newValue) {
    priceSortOrder.value = ""; // Clear price sort when score sort is selected
  }
  performSearch();
});

watch(priceSortOrder, async (newValue) => {
  if (newValue) {
    scoreSortOrder.value = ""; // Clear score sort when price sort is selected
  }
  performSearch();
});

watch(rooms, async (newValue) => {
  if (newValue) {
    roomShowList.value = newValue;
  }
});

// Mounted
onMounted(async () => {
  // Initialize from route query parameters
  search.value =
    route.query.search && route.query.search !== "null"
      ? route.query.search
      : "";

  // Handle hotel selection from route
  if (route.query.hotel && route.query.hotel !== "null") {
    hotel_id.value = route.query.hotel;
    try {
      // Fetch hotel details for display
      const hotels = await hotelStore.searchHotels("");
      const hotel = hotels.data.find((h) => h.id == hotel_id.value);
      if (hotel) {
        selectedHotel.value = hotel;
        hotelSearchQuery.value = hotel.name;
      }
    } catch (error) {
      console.error("Failed to fetch hotel details:", error);
    }
  }

  // Handle period selection from route
  if (route.query.room_id && route.query.room_id !== "null") {
    const res = await roomStore.detailAction(route.query.room_id);
    editModalOpenHandler(res.result);
  }

  // Perform initial search
  if (search.value || hotel_id.value) {
    performSearch();
  } else {
    await roomStore.getListAction();
  }
});

// Handle click outside to close dropdowns
onMounted(() => {
  const handleClickOutside = (event) => {
    // Close main hotel dropdown
    if (!event.target.closest(".relative")) {
      showHotelDropdown.value = false;
    }
    // Close modal hotel dropdown
    if (!event.target.closest(".relative")) {
      showModalHotelDropdown.value = false;
    }
  };

  document.addEventListener("click", handleClickOutside);

  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });
});
</script>
