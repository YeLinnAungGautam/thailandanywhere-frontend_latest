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
              room details
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
          <div v-if="quiteSwitch == 1">
            <p class="mb-2 text-sm text-gray-800">Hotel</p>
            <v-select
              v-model="formData.hotel_id"
              class="style-chooser"
              :options="hotelList ?? []"
              label="name"
              :clearable="false"
              :reduce="(hotel) => hotel.id"
              placeholder="Choose Hotel"
            ></v-select>
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
              >Max Preson</label
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
          <div
            class="mb-2 space-y-1 flex justify-start items-center gap-3"
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
                <div>
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
    <div class="flex items-center justify-between mb-8">
      <div class="flex justify-start flex-wrap items-center gap-2">
        <input
          type="text"
          v-model="search"
          class="w-3/5 sm:w-3/5 md:w-[200px] border px-4 py-1.5 rounded-lg shadow-sm focus:ring-0 focus:outline-none text-gray-500"
          placeholder="Search Rooms..."
        />
        <v-select
          class="style-chooser min-w-[200px] bg-white"
          :options="hotelList ?? []"
          v-model="hotel_id"
          label="name"
          :clearable="false"
          :reduce="(hotel) => hotel.id"
          placeholder="Choose Hotel"
        ></v-select>
        <!-- <AdjustmentsHorizontalIcon
          class="inline-block w-6 h-6 mx-2 text-gray-600 cursor-pointer"
        /> -->
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
          v-if="start_date || end_date || search || hotel_id"
        >
          clear
        </button>
      </div>
      <div class="space-y-2 flex justify-end items-center gap-2 flex-wrap">
        <div
          class="flex justify-center items-center border-2 shadow-sm rounded-md overflow-hidden"
        >
          <div
            class="cursor-pointer px-3 py-2.5 text-xs"
            :class="!incomplete ? 'bg-[#ff613c] text-white' : 'bg-white'"
            @click="incomplete = false"
          >
            normal list
          </div>
          <div
            class="cursor-pointer px-3 py-2.5 text-xs"
            @click="incomplete = true"
            :class="incomplete ? 'bg-[#ff613c] text-white' : 'bg-white'"
          >
            incomplete
          </div>
        </div>
        <div class="space-x-3 flex flex-nowarp">
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
        </div>
      </div>
    </div>
    <div class="mb-5 overflow-auto rounded-lg shadow" v-if="!incomplete">
      <table class="w-full">
        <thead class="border-b-2 border-gray-200 bg-gray-50">
          <tr>
            <th class="w-20 p-3 text-xs font-medium tracking-wide text-left">
              No.
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
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

            <th class="p-3 text-xs font-medium tracking-wide text-left w-30">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            class="bg-white even:bg-gray-50 hover:bg-gray-50"
            v-for="(r, index) in rooms?.data"
            :key="index"
          >
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.id }}
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
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
        </tbody>
      </table>
    </div>
    <div class="mb-5 overflow-auto rounded-lg shadow" v-if="incomplete">
      <table class="w-full">
        <thead class="border-b-2 border-gray-200 bg-gray-50">
          <tr>
            <th class="w-20 p-3 text-xs font-medium tracking-wide text-left">
              No.
            </th>
            <th class="p-3 text-xs font-medium tracking-wide text-left">
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

            <th class="p-3 text-xs font-medium tracking-wide text-left w-30">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            class="bg-white even:bg-gray-50 hover:bg-gray-50"
            v-for="(r, index) in incompleteRoom?.data"
            :key="index"
          >
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
              {{ r.id }}
            </td>
            <td class="p-3 text-xs text-gray-700 whitespace-nowrap">
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
              <div class="flex items-center gap-2">
                <button
                  @click.prevent="editModalOpenHandler(r)"
                  class="p-2 text-blue-500 transition bg-white rounded shadow hover:bg-yellow-500 hover:text-white"
                >
                  <PencilSquareIcon class="w-5 h-5" v-if="!authStore.isAgent" />
                  <EyeIcon class="w-5 h-5" v-if="authStore.isAgent" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- pagination -->
    <Pagination
      v-if="!loading && !incomplete"
      :data="rooms"
      @change-page="changePage"
    />
    <Pagination
      v-if="!loadingIncomplete && incomplete"
      :data="incompleteRoom"
      @change-page="changeIncompletePage"
    />

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
  </div>
</template>

<script setup>
import {
  PencilSquareIcon,
  TrashIcon,
  ShareIcon,
  EyeIcon,
  TicketIcon,
  BuildingOfficeIcon,
  DocumentPlusIcon,
  PlusIcon,
  UserGroupIcon,
  UsersIcon,
  AdjustmentsHorizontalIcon,
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
import { useCityStore } from "../stores/city";
import { useHotelStore } from "../stores/hotel";
import { useRoomStore } from "../stores/room";
import { useAuthStore } from "../stores/auth";
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { Switch } from "@headlessui/vue";

const createModalOpen = ref(false);
const toast = useToast();
const cityStore = useCityStore();
const hotelStore = useHotelStore();
const roomStore = useRoomStore();
const authStore = useAuthStore();

const { rooms, loading, importLoading, incompleteRoom, loadingIncomplete } =
  storeToRefs(roomStore);

const search = ref("");
const errors = ref([]);

const { hotels } = storeToRefs(hotelStore);

const hotelList = ref([]);
const enabled = ref(false);

const quiteSwitch = ref(1);

const incomplete = ref(false);

const formData = ref({
  id: "",
  name: "",
  hotel_id: null,
  description: "",
  max_person: "",
  is_extra: 0,
  period: [],
  images: [],
  room_amen: [],
  room_price: "",
  cost: "",
  agent_price: "",
  owner_price: "",
});
const editImagesPreview = ref([]);

const closeModal = () => {
  formData.value = {
    id: "",
    name: "",
    hotel_id: null,
    is_extra: 0,
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
  createModalOpen.value = false;
  imagesPreview.value = [];
  editImagesPreview.value = [];
};

const limitedText = (text) => {
  if (text != "") {
    if (text?.length <= 30) {
      return text;
    } else {
      return text?.slice(0, 30) + "...";
    }
  }
};

const room_amen = ref({
  title: "",
  list: [],
});
const room_amen_list = ref([
  {
    list_name: "",
  },
]);
const addNewRoomAmen = () => {
  formData.value.room_amen.push(room_amen.value);
  room_amen.value = {
    title: "",
    list: [],
  };
};
const addNewRoomAmenList = () => {
  room_amen.value.list.push(room_amen_list.value);
  console.log(room_amen.value);
  room_amen_list.value = {
    list_name: "",
  };
};
const removeRoomAmenItem = (index) => {
  formData.value.room_amen.splice(index, 1);
};
const removeRoomAmenListItem = (index) => {
  room_amen.value.list.splice(index, 1);
};

const addNewHandler = async () => {
  const frmData = new FormData();
  frmData.append("name", formData.value.name);
  frmData.append("hotel_id", formData.value.hotel_id);
  frmData.append("description", formData.value.description);
  frmData.append("max_person", formData.value.max_person);
  frmData.append("room_price", formData.value.room_price);
  if (formData.value.cost != "" && formData.value.cost != null) {
    frmData.append("cost", formData.value.cost);
  } else {
    frmData.append("cost", 0);
  }
  frmData.append("agent_price", formData.value.agent_price);
  frmData.append("owner_price", formData.value.owner_price);
  frmData.append("is_extra", enabled.value ? 1 : 0);
  if (formData.value.images.length > 0) {
    for (let i = 0; i < formData.value.images.length; i++) {
      let file = formData.value.images[i];
      frmData.append("images[" + i + "]", file);
    }
  }
  if (formData.value.room_amen.length > 0) {
    for (let i = 0; i < formData.value.room_amen.length; i++) {
      frmData.append(
        "amenities[" + i + "][title]",
        formData.value.room_amen[i].title
      );
      for (let l = 0; l < formData.value.room_amen[i].list.length; l++) {
        frmData.append(
          "amenities[" + i + "][list][" + l + "]",
          formData.value.room_amen[i].list[l].list_name
        );
      }
    }
  }
  if (formData.value.period.length > 0) {
    for (let x = 0; x < formData.value.period.length; x++) {
      frmData.append(
        "periods[" + x + "][period_name]",
        formData.value.period[x].period_name
      );
      frmData.append(
        "periods[" + x + "][start_date]",
        formData.value.period[x].start_date
      );
      frmData.append(
        "periods[" + x + "][end_date]",
        formData.value.period[x].end_date
      );
      frmData.append(
        "periods[" + x + "][sale_price]",
        formData.value.period[x].sale_price
      );
      frmData.append(
        "periods[" + x + "][cost_price]",
        formData.value.period[x].cost_price
      );
      frmData.append(
        "periods[" + x + "][agent_price]",
        formData.value.period[x].agent_price
      );
    }
  }

  try {
    const response = await roomStore.addNewAction(frmData);
    formData.value = {
      id: "",
      name: "",
      hotel_id: null,
      description: "",
      max_person: "",
      period: [],
      images: [],
      is_extra: 0,
      room_price: "",
      room_amen: [],
      cost: "",
      agent_price: "",
      owner_price: "",
    };
    enabled.value = false;
    errors.value = null;
    createModalOpen.value = false;
    imagesPreview.value = [];
    editImagesPreview.value = [];
    await roomStore.getListAction();
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
  frmData.append("hotel_id", formData.value.hotel_id);
  frmData.append("description", formData.value.description);
  frmData.append("max_person", formData.value.max_person);
  frmData.append("is_extra", enabled.value ? 1 : 0);
  if (formData.value.images.length > 0) {
    for (let i = 0; i < formData.value.images.length; i++) {
      let file = formData.value.images[i];
      frmData.append("images[" + i + "]", file);
    }
  }
  if (formData.value.room_amen.length > 0) {
    for (let i = 0; i < formData.value.room_amen.length; i++) {
      frmData.append(
        "amenities[" + i + "][title]",
        formData.value.room_amen[i].title
      );
      for (let l = 0; l < formData.value.room_amen[i].list.length; l++) {
        frmData.append(
          "amenities[" + i + "][list][" + l + "]",
          formData.value.room_amen[i].list[l].list_name
        );
      }
    }
  }
  if (formData.value.period.length > 0) {
    for (let x = 0; x < formData.value.period.length; x++) {
      frmData.append(
        "periods[" + x + "][period_name]",
        formData.value.period[x].period_name
      );
      frmData.append(
        "periods[" + x + "][start_date]",
        formData.value.period[x].start_date
      );
      frmData.append(
        "periods[" + x + "][end_date]",
        formData.value.period[x].end_date
      );
      frmData.append(
        "periods[" + x + "][sale_price]",
        formData.value.period[x].sale_price
      );
      frmData.append(
        "periods[" + x + "][cost_price]",
        formData.value.period[x].cost_price
      );
      frmData.append(
        "periods[" + x + "][agent_price]",
        formData.value.period[x].agent_price
      );
    }
  }
  frmData.append("room_price", formData.value.room_price);
  if (formData.value.cost != "" && formData.value.cost != null) {
    frmData.append("cost", formData.value.cost);
  } else {
    frmData.append("cost", 0);
  }
  frmData.append("agent_price", formData.value.agent_price);
  frmData.append("owner_price", formData.value.owner_price);

  frmData.append("_method", "PUT");
  try {
    const response = await roomStore.updateAction(frmData, formData.value.id);
    formData.value = {
      id: "",
      name: "",
      hotel_id: null,
      description: "",
      max_person: "",
      period: [],
      is_extra: 0,
      images: [],
      room_price: "",
      room_amen: [],
      cost: "",
      agent_price: "",
      owner_price: "",
    };
    enabled.value = false;
    imagesPreview.value = [];
    editImagesPreview.value = [];
    errors.value = null;
    createModalOpen.value = false;
    await roomStore.getListAction();
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
const removeEditImageSelectImage = (index) => {
  formData.value.images.splice(index, 1);
  editImagesPreview.value.splice(index, 1);
  console.log(editImagesPreview.value);
};

const editModalOpenHandler = (data) => {
  console.log(data);
  formData.value.id = data.id;
  formData.value.name = data.name;
  formData.value.hotel_id = data.hotel.id;
  enabled.value = data.is_extra == 1 ? true : false;
  formData.value.max_person = data.max_person;
  formData.value.room_price = data.room_price;
  formData.value.description = data.description;
  formData.value.cost = data.cost;
  formData.value.agent_price = data.agent_price;
  formData.value.owner_price = data.owner_price;
  createModalOpen.value = true;
  if (data.amenities.length > 0) {
    for (let i = 0; i < data.amenities.length; i++) {
      let dataArry = {
        title: data.amenities[i].title,
        list: [],
      };
      for (let l = 0; l < data.amenities[i].list.length; l++) {
        let datapush = {
          list_name: data.amenities[i].list[l],
        };
        dataArry.list.push(datapush);
      }
      formData.value.room_amen.push(dataArry);
    }
  }
  if (data.images.length > 0) {
    for (let i = 0; i < data.images.length; i++) {
      editImagesPreview.value.push(data.images[i]);
    }
  }
  if (data.room_periods.length > 0) {
    for (let i = 0; i < data.room_periods.length; i++) {
      // editImagesPreview.value.push(data.images[i]);
      let dataArray = {
        period_name: data.room_periods[i].period_name,
        start_date: data.room_periods[i].start_date,
        end_date: data.room_periods[i].end_date,
        sale_price: data.room_periods[i].sale_price,
        cost_price: data.room_periods[i].cost_price,
        agent_price: data.room_periods[i].agent_price,
      };
      formData.value.period.push(dataArray);
    }
  }
};

const changePage = async (url) => {
  console.log(url);
  let data = {
    search: search.value,
    hotel_id: hotel_id.value,
    period: periodAjj.value,
  };
  await roomStore.getChangePage(url, data);
};
const changeIncompletePage = async (url) => {
  let data = {
    hotel_id: hotel_id.value,
    search: search.value,
  };
  await roomStore.getChangeIncompletePage(url, data);
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
      } catch (error) {
        if (error.response.data.errors) {
          errors.value = error.response.data.errors;
        }
        toast.error(error.response.data.message);
      }
      await roomStore.getListAction();
    }
  });
};

const removeImageUpdateImage = async (id, imageID) => {
  const res = roomStore.deleteImageAction(id, imageID);
  console.log(res, "delete image res");
  closeModal();
  toast.success("deleted image");
  await roomStore.getListAction();
};

const formPeriod = ref({
  period_name: "",
  start_date: "",
  end_date: "",
  sale_price: "",
  cost_price: "",
  agent_price: "",
});

const addNewPerid = () => {
  formData.value.period.push(formPeriod.value);
  formPeriod.value = {
    period_name: "",
    start_date: "",
    end_date: "",
    sale_price: "",
    cost_price: "",
    agent_price: "",
  };
};

const removeFromPerid = (index) => {
  formData.value.period.splice(index, 1);
};

const exportAction = async () => {
  const res = await roomStore.downloadExport();
  if (res) {
    window.open(res.result.download_link);
  }
};

onMounted(async () => {
  await hotelStore.getSimpleListAction();
  await roomStore.getListAction();
  hotelList.value = hotels.value.data;
});

const hotel_id = ref("");
const start_date = ref("");
const end_date = ref("");
const periodAjj = ref("");

const searchFunction = async () => {
  if (start_date.value && end_date.value) {
    periodAjj.value = `${start_date.value} , ${end_date.value}`;

    // await roomStore.getListAction({
    //   search: search.value,
    //   hotel_id: hotel_id.value,
    //   period: periodAjj.value,
    // });
    // console.log(periodAjj);
  }
};

const clearFunction = () => {
  hotel_id.value = "";
  start_date.value = "";
  end_date.value = "";
  search.value = "";
  periodAjj.value = "";
};

// import process
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
    const res = await roomStore.importAction(frmData);
    fileImport.value = null;
    console.log(res);
    toast.success(`room ${res.message}`);
  } catch (e) {
    // errors.value = e.response.data.errors;
    importModal.value = false;
    toast.error(e.response.data.message);
  }
};

watch(search, async (newValue) => {
  await roomStore.getListAction({
    search: search.value,
    hotel_id: hotel_id.value,
    period: periodAjj.value,
  });
});
watch(hotel_id, async (newValue) => {
  await roomStore.getListAction({
    hotel_id: hotel_id.value,
    search: search.value,
    period: periodAjj.value,
  });
  if (incomplete.value == true) {
    let data = {
      hotel_id: hotel_id.value,
      search: search.value,
    };
    await roomStore.getListIncompleteAction(data);
  }
});
watch(periodAjj, async (newValue) => {
  await roomStore.getListAction({
    hotel_id: hotel_id.value,
    search: search.value,
    period: periodAjj.value,
  });
});
watch(incomplete, async (newValue) => {
  if (incomplete.value == true) {
    let data = {
      hotel_id: hotel_id.value,
      search: search.value,
    };
    await roomStore.getListIncompleteAction(data);
  }
});
</script>
