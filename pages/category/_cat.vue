<template>
  <v-container>
    <h1>{{ cat | titleCase | formatCategories }}</h1>
    <v-pagination
      v-model="page"
      :length="totalPages"
      @input="handlePageChange"></v-pagination>
    <v-card
      v-for="vid in res.videos"
      :key="vid._id"
      :to="'/video/' + vid._id"
      class="mx-auto my-5">
      <v-row no-gutters>
        <v-col class="d-flex justify-start">
          <v-img
            class="ma-3"
            height="200"
            width="355"
            contain
            lazy-src="/placeholder-image.png"
            style="background-image: url('/placeholder-image.png')"
            :src="
              process.env.API_BASEURL +
              '/files/videos/' +
              vid._id +
              '/thumb.jpg'
            "></v-img>
        </v-col>
        <v-col style="flex-grow: 5">
          <v-card-title>{{ vid.title }}</v-card-title>
          <v-card-text>
            <v-row dense class="mx-0 mb-1">
              Duration: {{ vid.duration | formatTime }}
            </v-row>
            <v-row dense class="mx-0 mb-1">
              Record Date: {{ vid.recorded_date | formatDate }}
            </v-row>
            <v-row
              class="ml-0 mr-5 mt-n4"
              style="white-space: pre-line; text-align: justify">
              {{ vid.description }}
            </v-row>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
    <v-pagination
      v-model="page"
      :length="totalPages"
      @input="handlePageChange"></v-pagination>
  </v-container>
</template>

<script>
  export default {
    name: 'CategoryView',
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
