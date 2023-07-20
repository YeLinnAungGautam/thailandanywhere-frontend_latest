import { defineStore } from "pinia";

export const useSidebarStore = defineStore("sidebar", {
  state: () => ({
    isShowSidebar: true,
    isSideBarDropdownShow: false,
    isTopBarDropdownShow: false,
  }),
  getters: {},
  actions: {
    customSideBar() {
      this.isShowSidebar = false;
    },
    showSidebar() {
      this.isShowSidebar = true;
    },
    hideSidebar() {
      this.isShowSidebar = false;
    },
    toggleSidebar() {
      this.isShowSidebar = !this.isShowSidebar;
    },
    toggleSideBarDropdown() {
      this.isSideBarDropdownShow = !this.isSideBarDropdownShow;
    },
    toggleTopBarDropdown() {
      this.isTopBarDropdownShow = !this.isTopBarDropdownShow;
    },
  },
});
