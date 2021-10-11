<template>
  <v-container>
    <h1 class="my-4">{{ cat | titleCase | formatCategories }}</h1>
    <v-pagination
      v-if="totalPages > 1"
      v-model="page"
      :length="totalPages"
      @input="handlePageChange"></v-pagination>
    <VideoBox v-for="vid in res.videos" :key="vid._id" :vid="vid"> </VideoBox>
    <v-pagination
      v-if="totalPages > 1"
      v-model="page"
      :length="totalPages"
      @input="handlePageChange"></v-pagination>
  </v-container>
</template>

<script>
  import VideoBox from '@/components/VideoBox'

  export default {
    name: 'CategoryView',
    components: {
      VideoBox,
    },
    async asyncData({ params, $axios }) {
      const cat = params.cat
      const res = await $axios.$get('/category/' + cat)
      return { cat, res }
    },
    data() {
      return {
        cat: '',
        page: 1,
        total: 0,
        limit: 10,
        res: [],
        videos: [],
        video: {
          title: '',
          description: '',
          url: '',
          img: '',
          uploaded_date: '',
          recorded_date: '',
          files: {},
          categories: [],
          unlisted: true,
          password: null,
        },
      }
    },
    computed: {
      totalPages() {
        return Math.ceil(Math.ceil(this.res.total / this.limit))
      },
    },
    methods: {
      async handlePageChange() {
        const skip = (this.page - 1) * this.limit
        this.res = await this.$axios.$get(
          '/category/' + this.cat + '?skip=' + skip + '&limit=' + this.limit
        )
      },
    },
  }
</script>

<style scoped></style>
