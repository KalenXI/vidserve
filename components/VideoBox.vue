<template>
  <v-card :key="vid._id" :to="'/video/' + vid._id" class="mx-auto my-5">
    <v-row no-gutters>
      <v-col class="d-flex justify-start">
        <v-img
          class="ma-sm-3"
          contain
          lazy-src="/placeholder-image.png"
          style="background-image: url('/placeholder-image.png')"
          :src="
            $config.baseURL + '/files/videos/' + vid._id + '/thumb.jpg'
          "></v-img>
      </v-col>
      <v-col style="flex-grow: 5">
        <v-card-title>{{ vid.title }}</v-card-title>
        <v-card-text>
          <v-row class="mx-0">
            <b>Duration</b>: {{ vid.duration | formatTime }}
          </v-row>
          <v-row class="mx-0">
            <b>Record Date</b>: {{ vid.recorded_date | formatDate }}
          </v-row>
          <v-row class="mx-0 py-2" style="text-align: justify">
            {{ vid.description }}
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
  export default {
    name: 'VideoBox',
    props: {
      vid: {
        type: Object,
        default() {
          return {
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
          }
        },
      },
    },
  }
</script>

<style scoped></style>
