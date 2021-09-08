<template>
  <v-container style="max-width: 90em">
    <video-player :options="videoOptions" class="mx-xl-15" />
    <v-row class="my-5 mx-xl-12">
      <v-col style="flex-grow: 5">
        <v-card class="pa-4">
          <h1>Title Goes Here</h1>
          <div>Recorded On: 7/24/2019</div>
          <div>Length: 5:50</div>
        </v-card>
        <div style="margin-top: 1em">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto
          aut, eos esse facere ipsam magnam numquam quisquam repellat ullam
          voluptate! Ab accusantium alias ex mollitia nulla porro provident quos
          vitae.
        </div>
      </v-col>
      <v-col class="d-flex justify-end">
        <div class="d-flex flex-column" style="width: 100%">
          <v-btn width="100%" class="mb-4">Download</v-btn>
          <v-btn width="100%">Share</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VideoPlayer from '@/components/VideoPlayer.vue'
// import 'video.js/dist/video-js.css'

export default {
  name: 'TestVideo',
  components: {
    VideoPlayer,
  },
  asyncData({ params }) {
    const id = params.id
    return { id }
  },
  data() {
    return {
      videoOptions: {
        autoplay: false,
        controls: true,
        sources: [
          {
            src: '/videos/' + this.$nuxt.$route.params.id + '/master.m3u8',
            type: 'application/x-mpegURL',
          },
        ],
      },
    }
  },
}
</script>
