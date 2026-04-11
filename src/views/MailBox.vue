<template>
  <Layout>
    <div
      class="h-[calc(100vh-120px)] w-[calc(100vw-120px)] flex flex-col overflow-x-hidden bg-white"
    >
      <!-- Loading Overlay -->
      <div
        v-if="emailStore.loading"
        class="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-xl p-6 flex flex-col items-center gap-3">
          <div
            class="w-9 h-9 border-3 border-gray-300 border-t-blue-600 rounded-full animate-spin"
          ></div>
          <p>Loading...</p>
        </div>
      </div>

      <!-- Top Header Bar -->
      <div
        class="h-16 w-full flex items-center justify-center px-4 flex-shrink-0"
      >
        <!-- Left: Menu + Logo + Search -->
        <div class="gap-4 flex-1 w-full flex justify-center items-center">
          <!-- Search Bar -->
          <div class="flex-1 max-w-2xl">
            <div class="relative">
              <div
                class="absolute inset-y-0 left-4 flex items-center pointer-events-none"
              >
                <svg
                  class="w-5 h-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                  />
                </svg>
              </div>
              <input
                v-model="filters.search"
                @input="debounceSearch"
                type="text"
                placeholder="Search mail"
                class="w-full h-12 pl-14 pr-12 bg-gray-200 rounded-full focus:outline-none transition-colors"
              />
              <button
                class="absolute inset-y-0 right-2 flex items-center px-2 hover:bg-white/10 rounded"
              >
                <svg
                  class="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="flex flex-1 overflow-hidden">
        <!-- Left Sidebar -->
        <aside
          v-if="!selectedEmail"
          class="w-64 bg-white border-r border-gray-200 flex-shrink-0"
        >
          <div class="p-2">
            <button
              @click="showCompose = true"
              class="w-full flex items-center gap-4 px-6 py-4 bg-[#c2e7ff] hover:shadow-lg rounded-2xl transition-shadow"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                />
              </svg>
              <span class="text-sm font-medium">Compose</span>
            </button>
          </div>

          <nav class="mt-2">
            <div
              @click="activeNav = 'inbox'"
              :class="[
                'flex items-center gap-4 px-6 py-2 mx-2 rounded-r-full cursor-pointer transition-colors',
                activeNav === 'inbox'
                  ? 'bg-[#d3e3fd] font-bold text-[#0b57d0]'
                  : 'hover:bg-gray-100',
              ]"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-1h2V7h-2v11z"
                />
              </svg>
              <span class="text-sm flex-1">Inbox</span>
              <span class="text-xs font-semibold">{{
                emailStore.stats?.open_count || 0
              }}</span>
            </div>

            <div
              @click="activeNav = 'starred'"
              :class="[
                'flex items-center gap-4 px-6 py-2 mx-2 rounded-r-full cursor-pointer transition-colors',
                activeNav === 'starred'
                  ? 'bg-[#d3e3fd] font-bold text-[#0b57d0]'
                  : 'hover:bg-gray-100',
              ]"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                />
              </svg>
              <span class="text-sm">Starred</span>
            </div>

            <div
              @click="activeNav = 'sent'"
              :class="[
                'flex items-center gap-4 px-6 py-2 mx-2 rounded-r-full cursor-pointer transition-colors',
                activeNav === 'sent'
                  ? 'bg-[#d3e3fd] font-bold text-[#0b57d0]'
                  : 'hover:bg-gray-100',
              ]"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
              <span class="text-sm">Sent</span>
            </div>

            <div
              @click="activeNav = 'archived'"
              :class="[
                'flex items-center gap-4 px-6 py-2 mx-2 rounded-r-full cursor-pointer transition-colors',
                activeNav === 'archived'
                  ? 'bg-[#d3e3fd] font-bold text-[#0b57d0]'
                  : 'hover:bg-gray-100',
              ]"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"
                />
              </svg>
              <span class="text-sm">Archived</span>
            </div>
          </nav>

          <div class="mt-4 pt-4 border-t border-gray-200">
            <div class="flex items-center gap-4 px-6 py-2 mx-2">
              <svg
                class="w-5 h-5 text-gray-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                />
              </svg>
              <span class="text-sm text-gray-700">Total</span>
              <span class="ml-auto text-xs font-semibold text-gray-600">{{
                emailStore.stats?.total_messages || 0
              }}</span>
            </div>

            <div class="flex items-center gap-4 px-6 py-2 mx-2">
              <svg
                class="w-5 h-5 text-gray-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
                />
              </svg>
              <span class="text-sm text-gray-700">Today</span>
              <span class="ml-auto text-xs font-semibold text-gray-600">{{
                emailStore.stats?.today_count || 0
              }}</span>
            </div>
          </div>
        </aside>

        <!-- Email List (Full width when no email selected) -->
        <div v-if="!selectedEmail" class="flex-1 flex flex-col bg-white">
          <!-- Tabs: Primary, Promotions, Social -->
          <div class="flex border-b border-gray-200">
            <button
              @click="activeTab = 'primary'"
              :class="[
                'flex items-center gap-2 px-6 py-3 border-b-2 transition-colors',
                activeTab === 'primary'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:bg-gray-50',
              ]"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-1h2V7h-2v11z"
                />
              </svg>
              <span class="text-sm font-medium">Primary</span>
            </button>

            <button
              @click="activeTab = 'promotions'"
              :class="[
                'flex items-center gap-2 px-6 py-3 border-b-2 transition-colors',
                activeTab === 'promotions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:bg-gray-50',
              ]"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"
                />
              </svg>
              <span class="text-sm font-medium">Promotions</span>
            </button>

            <button
              @click="activeTab = 'social'"
              :class="[
                'flex items-center gap-2 px-6 py-3 border-b-2 transition-colors',
                activeTab === 'social'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:bg-gray-50',
              ]"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
                />
              </svg>
              <span class="text-sm font-medium">Social</span>
            </button>
            <button
              @click="activeTab = 'updates'"
              :class="[
                'flex items-center gap-2 px-6 py-3 border-b-2 transition-colors',
                activeTab === 'updates'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:bg-gray-50',
              ]"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
                />
              </svg>
              <span class="text-sm font-medium">Updates</span>
            </button>
          </div>

          <!-- Email List Toolbar -->
          <div
            class="flex items-center justify-start px-4 py-2 border-b border-gray-200"
          >
            <div class="flex items-center gap-2">
              <input type="checkbox" class="w-4 h-4 rounded border-gray-300" />
              <button
                class="p-2 hover:bg-gray-100 rounded"
                @click="syncEmails"
                title="Refresh"
              >
                <svg
                  class="w-5 h-5 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
                  />
                </svg>
              </button>
              <button class="p-2 hover:bg-gray-100 rounded">
                <svg
                  class="w-5 h-5 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                  />
                </svg>
              </button>
            </div>

            <div class="flex items-center gap-4">
              <span class="text-sm text-gray-600">
                {{ filters.page }}-{{ filteredEmails.length }} of
                {{ emailStore.stats?.total_messages || 0 }}
              </span>
              <div class="flex gap-1">
                <button
                  @click="previousPage"
                  :disabled="filters.page === 1"
                  class="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  <svg
                    class="w-5 h-5 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                  </svg>
                </button>
                <button
                  @click="nextPage"
                  :disabled="!paginationData?.has_more"
                  class="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  <svg
                    class="w-5 h-5 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Filter Chips -->
          <div
            class="flex gap-2 px-4 py-3 border-b border-gray-200 overflow-x-auto"
          >
            <button
              @click="activeChip = 'all'"
              :class="[
                'px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
                activeChip === 'all'
                  ? 'bg-[#d3e3fd] text-[#0b57d0] border border-[#a8c7fa]'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
              ]"
            >
              All
            </button>
            <button
              @click="activeChip = 'unread'"
              :class="[
                'px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
                activeChip === 'unread'
                  ? 'bg-[#d3e3fd] text-[#0b57d0] border border-[#a8c7fa]'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
              ]"
            >
              Unread
            </button>
            <button
              @click="activeChip = 'open'"
              :class="[
                'px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
                activeChip === 'open'
                  ? 'bg-[#d3e3fd] text-[#0b57d0] border border-[#a8c7fa]'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
              ]"
            >
              Open
            </button>
            <button
              @click="activeChip = 'closed'"
              :class="[
                'px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
                activeChip === 'closed'
                  ? 'bg-[#d3e3fd] text-[#0b57d0] border border-[#a8c7fa]'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
              ]"
            >
              Closed
            </button>
          </div>

          <!-- Email Rows -->
          <div class="flex-1 overflow-y-auto">
            <div
              v-for="email in filteredEmails"
              :key="email.id"
              @click="selectEmail(email)"
              class="flex items-start gap-4 px-4 py-3 border-b border-gray-100 hover:shadow-[inset_1px_0_0_#dadce0,inset_-1px_0_0_#dadce0,0_0_0_1px_#dadce0] cursor-pointer transition-all"
            >
              <input
                type="checkbox"
                class="mt-1 w-4 h-4 rounded border-gray-300"
                @click.stop
              />
              <button class="mt-1" @click.stop>
                <svg
                  class="w-5 h-5 text-gray-400 hover:text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                  />
                </svg>
              </button>

              <div class="flex-1 max-w-[72%]">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-semibold text-sm text-gray-900 truncate">
                    {{
                      formatSender(email.is_incoming ? email.from : email.to)
                    }}
                  </span>
                  <span
                    v-if="email.message_count > 1"
                    class="text-xs text-gray-500"
                    >({{ email.message_count }})</span
                  >
                  <span class="ml-auto text-xs text-gray-500 whitespace-nowrap">
                    {{ email.last_message_at }}
                  </span>
                </div>

                <div class="flex items-center gap-2">
                  <span
                    class="font-medium text-sm text-gray-900 truncate flex-1"
                  >
                    {{ email.subject }}
                  </span>
                </div>

                <p class="text-sm text-gray-600 truncate mt-0.5">
                  {{ stripHtml(email.preview) }}
                </p>

                <div class="flex gap-1.5 mt-2">
                  <span
                    :class="[
                      'text-xs px-2 py-0.5 rounded font-medium',
                      email.is_incoming
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-green-50 text-green-700',
                    ]"
                  >
                    {{ email.is_incoming ? "Received" : "Sent" }}
                  </span>
                  <span
                    :class="[
                      'text-xs px-2 py-0.5 rounded font-medium',
                      statusBadgeClass(email.status),
                    ]"
                  >
                    {{ email.status }}
                  </span>
                </div>
              </div>
            </div>

            <div
              v-if="!filteredEmails.length && !emailStore.loading"
              class="flex flex-col items-center justify-center py-20 text-gray-400"
            >
              <div class="text-6xl mb-4 opacity-30">📭</div>
              <p>No messages found</p>
            </div>
          </div>
        </div>

        <!-- Email Detail View (Full width when email selected) -->
        <div v-else class="flex-1 flex flex-col bg-white">
          <!-- Back button + Toolbar -->
          <div
            class="flex items-center gap-4 px-4 py-3 border-b border-gray-200"
          >
            <button
              @click="selectedEmail = null"
              class="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg
                class="w-5 h-5 text-gray-700"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
                />
              </svg>
            </button>

            <div class="flex items-center gap-2 flex-1">
              <button
                @click="archiveEmail"
                class="p-2 hover:bg-gray-100 rounded"
                title="Archive"
              >
                <svg
                  class="w-5 h-5 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"
                  />
                </svg>
              </button>
              <button
                @click="deleteEmail"
                class="p-2 hover:bg-gray-100 rounded"
                title="Delete"
              >
                <svg
                  class="w-5 h-5 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                  />
                </svg>
              </button>
            </div>

            <div class="flex items-center gap-2">
              <span
                :class="[
                  'px-3 py-1 text-xs font-semibold rounded-full',
                  selectedEmail.status === 'open'
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-green-50 text-green-700',
                ]"
              >
                {{ selectedEmail.status }}
              </span>
              <button
                v-if="selectedEmail.status === 'open'"
                @click="closeTicket(selectedEmail.id)"
                class="px-4 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50"
              >
                ✓ Close
              </button>
              <button
                v-else
                @click="reopenTicket(selectedEmail.id)"
                class="px-4 py-1.5 text-sm font-medium text-green-700 border border-green-600 rounded-full hover:bg-green-50"
              >
                ↺ Reopen
              </button>
            </div>
          </div>

          <!-- Subject -->
          <div class="px-6 py-4 border-b border-gray-200">
            <h1 class="text-2xl font-normal text-gray-900">
              {{ selectedEmail.subject }}
            </h1>
          </div>

          <!-- Thread Messages -->
          <div ref="viewerBody" class="flex-1 overflow-y-auto px-6 py-4">
            <div
              v-if="threadLoading"
              class="flex items-center justify-center py-12 text-gray-500"
            >
              <div
                class="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mr-3"
              ></div>
              Loading messages...
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="(msg, index) in threadMessages"
                :key="msg.id"
                class="border border-gray-200 rounded-lg overflow-hidden"
              >
                <!-- Message Header -->
                <div
                  @click="toggleMsg(index)"
                  class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                >
                  <div class="flex items-center gap-3">
                    <div
                      :class="[
                        'w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold',
                        msg.is_incoming ? 'bg-purple-500' : 'bg-red-500',
                      ]"
                    >
                      {{ msg.is_incoming ? initials(msg.from) : "Me" }}
                    </div>
                    <div>
                      <div class="font-semibold text-sm text-gray-900">
                        {{ formatSender(msg.from) }}
                      </div>
                      <div
                        v-if="!expandedMsgs.has(index)"
                        class="text-sm text-gray-500 truncate max-w-xl"
                      >
                        {{ stripHtml(msg.body).slice(0, 80) }}...
                      </div>
                      <div v-else class="text-xs text-gray-500">
                        to {{ msg.to }}
                      </div>
                    </div>
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ formatFullTime(msg.created_at) }}
                  </div>
                </div>

                <!-- Message Body (Expanded) -->
                <div
                  v-if="expandedMsgs.has(index)"
                  class="px-4 pb-4 border-t border-gray-100"
                >
                  <div
                    class="mt-3 text-sm text-gray-900 leading-relaxed"
                    v-html="formatBody(msg.body)"
                  ></div>

                  <!-- Attachments -->
                  <div
                    v-if="
                      msg.attachments &&
                      parseAttachments(msg.attachments).length
                    "
                    class="flex gap-2 mt-4 flex-wrap"
                  >
                    <div
                      v-for="(att, i) in parseAttachments(msg.attachments)"
                      :key="i"
                      class="flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
                    >
                      📎 {{ att }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reply Area -->
          <div class="px-6 py-4 border-t border-gray-200">
            <div
              v-if="!showReply"
              @click="expandReply"
              class="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-full cursor-text hover:shadow-md transition-shadow"
            >
              <div
                class="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-semibold"
              >
                Me
              </div>
              <span class="text-sm text-gray-500 flex-1"
                >Reply to
                {{ formatSender(selectedEmail.customer_email) }}...</span
              >
              <button
                @click.stop="startReply('I will get back to you shortly.')"
                class="px-4 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50"
              >
                Quick reply
              </button>
            </div>

            <div
              v-else
              class="border border-gray-300 rounded-xl overflow-hidden shadow-lg"
            >
              <div
                class="flex items-center justify-between px-4 py-3 border-b border-gray-200"
              >
                <span class="text-sm"
                  >Reply to
                  <strong>{{
                    formatSender(selectedEmail.customer_email)
                  }}</strong></span
                >
                <button
                  @click="showReply = false"
                  class="p-1 hover:bg-gray-100 rounded"
                >
                  <svg
                    class="w-5 h-5 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                    />
                  </svg>
                </button>
              </div>

              <input
                v-model="replySubject"
                class="w-full px-4 py-2 border-b border-gray-200 text-sm focus:outline-none"
                placeholder="Subject"
              />

              <textarea
                ref="replyTextarea"
                v-model="replyMessage"
                rows="6"
                class="w-full px-4 py-3 text-sm resize-none focus:outline-none"
                placeholder="Type your reply..."
              ></textarea>

              <div
                class="flex items-center justify-between px-4 py-3 border-t border-gray-200"
              >
                <button
                  @click="sendReply"
                  :disabled="!replyMessage.trim()"
                  class="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
                <button
                  @click="showReply = false"
                  class="p-2 hover:bg-gray-100 rounded"
                >
                  <svg
                    class="w-5 h-5 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Compose Modal (bottom-right Gmail style) -->
      <Transition name="slide-up">
        <div
          v-if="showCompose"
          class="fixed bottom-0 right-6 w-[500px] bg-white rounded-t-xl shadow-2xl z-50"
        >
          <div
            class="bg-gray-800 text-white px-4 py-3 rounded-t-xl flex items-center justify-between"
          >
            <span class="text-sm font-medium">New Message</span>
            <button
              @click="showCompose = false"
              class="text-white hover:bg-gray-700 rounded p-1"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                />
              </svg>
            </button>
          </div>

          <div class="border-b border-gray-200">
            <input
              v-model="composeMail.to"
              type="email"
              placeholder="To"
              class="w-full px-4 py-2 text-sm border-b border-gray-200 focus:outline-none"
            />
            <input
              v-model="ccInput"
              placeholder="Cc"
              class="w-full px-4 py-2 text-sm border-b border-gray-200 focus:outline-none"
            />
            <input
              v-model="composeMail.subject"
              placeholder="Subject"
              class="w-full px-4 py-2 text-sm focus:outline-none"
            />
          </div>

          <textarea
            v-model="composeMail.body"
            rows="12"
            class="w-full px-4 py-3 text-sm resize-none focus:outline-none"
            placeholder="Write your message..."
          ></textarea>

          <div
            class="flex items-center gap-3 px-4 py-3 border-t border-gray-200"
          >
            <button
              @click="sendNewEmail"
              :disabled="
                !composeMail.to || !composeMail.subject || !composeMail.body
              "
              class="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
            <button
              @click="showCompose = false"
              class="p-2 hover:bg-gray-100 rounded"
            >
              <svg
                class="w-5 h-5 text-gray-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                />
              </svg>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import Layout from "./Layout.vue";
import { useEmailStore } from "../stores/email";
import axios from "axios";
import { useRoute } from "vue-router";

const emailStore = useEmailStore();
const route = useRoute();

// State
const selectedEmail = ref(null);
const threadMessages = ref([]);
const threadLoading = ref(false);
const showCompose = ref(false);
const showReply = ref(false);
const replyMessage = ref("");
const replySubject = ref("");
const paginationData = ref(null);
const composeMail = ref({ to: "", subject: "", body: "" });
const ccInput = ref("");
const activeChip = ref("all");
const activeTab = ref("primary");
const activeNav = ref("inbox");
const filters = ref({ search: "", status: "", per_page: 20, page: 1 });
const viewerBody = ref(null);
const replyTextarea = ref(null);
const expandedMsgs = ref(new Set());
let searchTimeout = null;

// Computed
// const filteredEmails = computed(() => {
//   const list = emailStore.emails || [];
//   if (activeChip.value === "all") return list;
//   if (activeChip.value === "open")
//     return list.filter((e) => e.status === "open");
//   if (activeChip.value === "closed")
//     return list.filter((e) => e.status === "closed");
//   return list;
// });

// Helpers
const AVATAR_COLORS = [
  "#1a73e8",
  "#ea4335",
  "#34a853",
  "#fa7b17",
  "#8430ce",
  "#00bcd4",
  "#e91e63",
  "#607d8b",
];

const avatarColor = (str = "") => {
  let h = 0;
  for (const c of str) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
};

const initials = (raw = "") => {
  const name = raw.replace(/<.*?>/, "").trim();
  const parts = name.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const formatSender = (raw = "") => {
  const m = raw.match(/^(.*?)\s*<(.+?)>$/);
  return m ? m[1].trim() || m[2] : raw;
};

const stripHtml = (html = "") =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const formatTime = (d) => {
  if (!d) return "";
  const date = new Date(d),
    now = new Date();
  const h = Math.floor((now - date) / 3600000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

const formatFullTime = (d) =>
  d
    ? new Date(d).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

const statusBadgeClass = (s) =>
  ({
    open: "bg-blue-50 text-blue-700",
    closed: "bg-green-50 text-green-700",
    archived: "bg-gray-100 text-gray-600",
  }[s] || "bg-gray-100 text-gray-600");

const parseAttachments = (att) => {
  if (!att) return [];
  if (Array.isArray(att)) return att;
  try {
    return JSON.parse(att);
  } catch {
    return [];
  }
};

const formatBody = (body = "") => {
  if (!body) return "";
  const hasHtml = /<(div|table|p|ul|ol|li|h[1-6]|section|span\s)[^>]*>/i.test(
    body,
  );
  if (hasHtml) return wrapGmailQuote(body);

  let text = body
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "");

  const lines = text.split("\n");
  let split = -1;
  for (let i = 0; i < lines.length; i++) {
    if (
      /^On .+wrote:$/i.test(lines[i].trim()) ||
      /^-{3,}Original Message-{3,}/i.test(lines[i].trim())
    ) {
      split = i;
      break;
    }
  }

  const main = split >= 0 ? lines.slice(0, split) : lines;
  const quoted = split >= 0 ? lines.slice(split) : [];

  const renderLines = (ls) =>
    ls
      .map((l) => {
        const t = l.trim();
        if (!t) return `<div style="height:5px"></div>`;
        return `<div style="line-height:1.65;">${linkify(
          escHtml(t.replace(/^>+\s?/, "")),
        )}</div>`;
      })
      .join("");

  let html = `<div>${renderLines(main)}</div>`;
  if (quoted.length) {
    const qid = `q${Math.random().toString(36).slice(2, 7)}`;
    html += `
    <div style="margin-top:10px;">
      <button onclick="var e=document.getElementById('${qid}');var b=this;if(e.style.display==='none'){e.style.display='block';b.innerHTML='▲ Hide';}else{e.style.display='none';b.innerHTML='▼ Show quoted text';}"
        style="font-size:12px;color:#444746;background:#f1f3f4;border:1px solid #dadce0;border-radius:4px;padding:2px 10px;cursor:pointer;">
        ▼ Show quoted text
      </button>
      <div id="${qid}" style="display:none;margin-top:8px;padding:10px 14px;border-left:3px solid #dadce0;background:#f9fafb;border-radius:0 6px 6px 0;font-size:13px;color:#374151;line-height:1.65;">
        ${renderLines(quoted)}
      </div>
    </div>`;
  }
  return html;
};

const wrapGmailQuote = (html) => {
  const id = `q${Math.random().toString(36).slice(2, 7)}`;
  const btn = `<button onclick="var e=document.getElementById('${id}');var b=this;e.style.display=e.style.display==='none'?'block':'none';b.textContent=e.style.display==='none'?'• • •':'▲ Hide'" style="background:#f3f4f6;border:1px solid #e5e7eb;border-radius:4px;padding:2px 10px;font-size:12px;color:#6b7280;cursor:pointer;letter-spacing:2px;">• • •</button>`;
  let result = html.replace(
    /(<div[^>]+class="[^"]*gmail_quote[^"]*"[^>]*>)([\s\S]*?)(<\/div>)(?=\s*$)/,
    (_, o, c, cl) =>
      `<div style="margin-top:10px;">${btn}<div id="${id}" style="display:none;margin-top:6px;">${o}${c}${cl}</div></div>`,
  );
  return result;
};

const escHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const linkify = (s) =>
  s.replace(
    /(https?:\/\/[^\s<>"]+)/g,
    '<a href="$1" target="_blank" rel="noopener" style="color:#1a73e8;word-break:break-all;">$1</a>',
  );

const toggleMsg = (index) => {
  const s = new Set(expandedMsgs.value);
  s.has(index) ? s.delete(index) : s.add(index);
  expandedMsgs.value = s;
};

const filteredEmails = computed(() => {
  return emailStore.emails || [];
});

// Data fetching
const fetchEmails = async () => {
  try {
    const categoryMap = {
      primary: "Primary",
      promotions: "Promotions",
      social: "Social",
      updates: "Updates",
    };

    const params = {
      ...filters.value,
      category: categoryMap[activeTab.value] || undefined,
      status:
        activeChip.value !== "all" && activeChip.value !== "unread"
          ? activeChip.value
          : undefined,
    };

    const res = await emailStore.getInbox(params);
    paginationData.value = res.result?.pagination || null;
  } catch (e) {
    console.error(e);
  }
};

const selectEmail = async (email) => {
  selectedEmail.value = email;
  threadMessages.value = [];
  showReply.value = false;
  await loadThread(email.thread_id || email.id);
};

const loadThread = async (threadId) => {
  if (!threadId) return;
  threadLoading.value = true;
  try {
    const res = await axios.get(`/gmail/threads/${threadId}`);
    const payload = res.data.result || res.data.data || res.data;
    threadMessages.value = payload?.emails || [];
    if (threadMessages.value.length) {
      expandedMsgs.value = new Set([threadMessages.value.length - 1]);
    }
    await nextTick();
    if (viewerBody.value)
      viewerBody.value.scrollTop = viewerBody.value.scrollHeight;
  } catch (e) {
    console.error(e);
    threadMessages.value = [];
  } finally {
    threadLoading.value = false;
  }
};

// Actions
const syncEmails = async () => {
  if (!confirm("Sync recent emails from Gmail?")) return;
  try {
    const res = await emailStore.syncFromGmail(50);
    const n = res.result?.synced_count ?? res.data?.synced_count ?? 0;
    alert(`Synced ${n} new email(s)`);
    await fetchEmails();
  } catch {
    alert("Failed to sync emails");
  }
};

const expandReply = async () => {
  showReply.value = true;
  replySubject.value = `Re: ${selectedEmail.value.subject}`;
  await nextTick();
  replyTextarea.value?.focus();
};

const startReply = (text = "") => {
  showReply.value = true;
  replyMessage.value = text;
  replySubject.value = `Re: ${selectedEmail.value.subject}`;
};

const sendReply = async () => {
  if (!replyMessage.value.trim() || !selectedEmail.value) return;
  try {
    await emailStore.sendReply(selectedEmail.value.id, {
      body: replyMessage.value,
      subject: replySubject.value,
    });
    showReply.value = false;
    replyMessage.value = "";
    await loadThread(selectedEmail.value.thread_id || selectedEmail.value.id);
    await fetchEmails();
  } catch (e) {
    alert(e.response?.data?.message || "Failed to send reply");
  }
};

const sendNewEmail = async () => {
  if (
    !composeMail.value.to ||
    !composeMail.value.subject ||
    !composeMail.value.body
  )
    return alert("Please fill in all required fields");
  try {
    const data = { ...composeMail.value };
    if (ccInput.value.trim())
      data.cc = ccInput.value
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);
    await emailStore.composeEmail(data);
    showCompose.value = false;
    composeMail.value = { to: "", subject: "", body: "" };
    ccInput.value = "";
    await fetchEmails();
  } catch (e) {
    alert(e.response?.data?.message || "Failed to send message");
  }
};

const closeTicket = async (id) => {
  try {
    await axios.patch(`/gmail/tickets/${id}/close`);
    selectedEmail.value.status = "closed";
    await fetchEmails();
  } catch {
    alert("Failed to close ticket");
  }
};

const reopenTicket = async (id) => {
  try {
    await axios.patch(`/gmail/tickets/${id}/reopen`);
    selectedEmail.value.status = "open";
    await fetchEmails();
  } catch {
    alert("Failed to reopen ticket");
  }
};

const archiveEmail = async () => {
  if (!selectedEmail.value || !confirm("Archive this email?")) return;
  try {
    await emailStore.archiveEmails([selectedEmail.value.id]);
    selectedEmail.value = null;
    threadMessages.value = [];
    await fetchEmails();
  } catch {
    alert("Failed to archive");
  }
};

const deleteEmail = async () => {
  if (!selectedEmail.value || !confirm("Delete this email?")) return;
  try {
    await emailStore.deleteEmails([selectedEmail.value.id]);
    selectedEmail.value = null;
    threadMessages.value = [];
    await fetchEmails();
  } catch {
    alert("Failed to delete");
  }
};

const debounceSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    filters.value.page = 1;
    fetchEmails();
  }, 500);
};

const nextPage = () => {
  if (paginationData.value?.has_more) {
    filters.value.page++;
    fetchEmails();
  }
};

const previousPage = () => {
  if (filters.value.page > 1) {
    filters.value.page--;
    fetchEmails();
  }
};

watch(activeTab, () => {
  filters.value.page = 1;
  fetchEmails();
});

// Watch chip change → re-filter
watch(activeChip, () => {
  filters.value.page = 1;
  fetchEmails();
});

// Mount
// onMounted(async () => {
//   const code = new URLSearchParams(window.location.search).get("code");
//   if (code) {
//     try {
//       await emailStore.handleCallback(code);
//       window.history.replaceState({}, document.title, window.location.pathname);
//       alert("Gmail connected successfully!");
//     } catch {
//       alert("Failed to connect Gmail");
//     }
//   }
//   await emailStore.checkConnectionStatus();
//   await fetchEmails();
// });

onMounted(async () => {
  const code = new URLSearchParams(window.location.search).get("code");
  if (code) {
    try {
      await emailStore.handleCallback(code);
      window.history.replaceState({}, document.title, window.location.pathname);
      alert("Gmail connected successfully!");
    } catch {
      alert("Failed to connect Gmail");
    }
  }

  await emailStore.checkConnectionStatus();
  await fetchEmails();

  // ✅ ticket_message_id query param ရှိလျှင် auto-open
  const ticketMsgId = route.query.ticket_message_id;
  if (ticketMsgId) {
    try {
      // message detail ရယူပြီး thread_id ဖြင့် email ရှာသည်
      const res = await axios.get(`/gmail/messages/${ticketMsgId}`);
      const msg = res.data.result;

      if (msg?.ticket?.thread_id) {
        // email list မှ thread_id ကိုက်ညီသော email ရှာသည်
        const target = emailStore.emails?.find(
          (e) => e.thread_id === msg.ticket.thread_id,
        );

        if (target) {
          await selectEmail(target);
        } else {
          // list တွင် မပါလျှင် တိုက်ရိုက် thread load လုပ်သည်
          selectedEmail.value = {
            id: msg.ticket.id,
            thread_id: msg.ticket.thread_id,
            subject: msg.ticket.subject,
            status: msg.ticket.status,
            customer_email: msg.to,
          };
          await loadThread(msg.ticket.thread_id);
        }
      }
    } catch (e) {
      console.error("Failed to auto-open email", e);
    }
  }
});
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
