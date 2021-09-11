<template>
  <v-container>
    <h1>{{ cat }}</h1>
    <v-card
      v-for="vid in videos"
      :key="vid"
      :to="'/watch/' + vid._id"
      :loading="loading"
      class="mx-auto my-5"
    >
      <v-row no-gutters>
        <v-col cols="4">
          <v-img class="ma-3" height="200" :src="vid.img"></v-img>
        </v-col>
        <v-col>
          <v-card-title>{{ vid.title }}</v-card-title>
          <v-card-text>
            <v-row class="mx-0 mb-1"> Duration: {{ vid.duration }} </v-row>
            <v-row
              class="ml-0 mr-5 mt-n4"
              style="white-space: pre-line; text-align: justify"
            >
              {{ vid.description }}
            </v-row>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'CategoryView',
  async asyncData({ params, $axios }) {
    const cat = params.cat
    const videos = await $axios.$get('/category/' + cat)
    return { cat, videos }
  },
  data() {
    return {
      cat: '',
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
}
</script>

<style scoped></style>
