import { watch } from 'vue';
<template>
  <v-select
    :options="filtered"
    :filterable="false"
    class="min-w-[200px]"
    @open="onOpen"
    @close="onClose"
    @search="(query) => (search = query)"
    label="name"
    :multiple="isMult ? true : false"
    :clearable="false"
    :reduce="(d) => d.id"
    placeholder="Choose ..."
  >
    <template #list-footer>
      <li v-show="hasNextPage" ref="load" class="loader">
        Loading more options...
      </li>
    </template>
  </v-select>
</template>

<script>
export default {
  name: "InfiniteScroll",
  data: () => ({
    observer: null,
    limit: 10,
    search: "",
    countries: [],
    page: 1,
  }),
  props: {
    data: Object,
    isMult: Boolean,
  },
  computed: {
    filtered() {
      console.log(this.search);

      return this.countries?.filter((country) =>
        country.name.includes(this.search)
      );
    },

    hasNextPage() {
      console.log(this.data?.meta?.total_page > this.filtered.length);
      return this.data?.meta?.total_page > this.filtered.length;
    },
  },
  mounted() {
    console.log(this.data, "this is props data");
    if (this.data && this.data.data) {
      this.countries = this.data.data;
      console.log(this.countries, "this is data");
    }

    this.observer = new IntersectionObserver(this.infiniteScroll, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });
  },
  methods: {
    async onOpen() {
      if (this.hasNextPage) {
        await this.$nextTick();
        this.observer.observe(this.$refs.load);
      }
    },
    onClose() {
      this.observer.disconnect();
    },
    async infiniteScroll([{ isIntersecting, target }]) {
      if (isIntersecting) {
        this.page += 1;
        const ul = target.offsetParent;
        const scrollTop = target.offsetParent.scrollTop;
        console.log("hello I scroll");
        this.$emit("childData", this.page);
        ul.scrollTop = scrollTop;
      }
    },
  },
  watch: {
    data(newValue, oldValue) {
      if (oldValue && oldValue.data && newValue && newValue.data) {
        this.countries = [...oldValue.data, ...newValue.data];
      } else if (newValue && newValue.data) {
        this.countries = [...oldValue.data, ...newValue.data];
      }
      console.log(this.countries, "this is new");
    },
  },
};
</script>

<style scoped>
.loader {
  text-align: center;
  color: #bbbbbb;
}
</style>
