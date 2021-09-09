<template>
  <v-container style="max-width: 90em">
    <video>
      <source
        type="application/x-mpegURL"
        src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
      />
    </video>
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
// import VideoPlayer from '@/components/VideoPlayer.vue'
// import 'video.js/dist/video-js.css'
// import VuePlyr from 'vue-plyr/dist/vue-plyr.ssr.js'
// import 'vue-plyr/dist/vue-plyr.css'
import Hls from 'hls.js'
import Plyr from 'plyr'

export default {
  name: 'TestVideo',
  components: {},
  asyncData({ params }) {
    const id = params.id
    return { id }
  },
  data() {},
  mounted() {
    const defaultOptions = {}
    if (Hls.isSupported()) {
      const hls = new Hls()
      const video = document.querySelector('video')
      const source = video.getElementsByTagName('source')[0].src
      video.src = 'test'
      hls.loadSource(source)

      hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
        const availableQualities = hls.levels.map((l) => l.height)
        availableQualities.unshift(0)

        defaultOptions.quality = {
          default: 0,
          options: availableQualities,
          forced: true,
          onChange: (e) => updateQuality(e),
        }

        defaultOptions.i18n = {
          qualityLabel: {
            0: 'Auto',
          },
        }

        hls.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
          const span = document.querySelector(
            ".plyr__menu__container [data-plyr='quality'][value='0'] span"
          )
          if (hls.autoLevelEnabled) {
            span.innerHTML = `AUTO (${hls.levels[data.level].height}p)`
          } else {
            span.innerHTML = `AUTO`
          }
        })

        const player = new Plyr(video, defaultOptions)
        player.autoplay = false
      })
      hls.attachMedia(video)
      window.hls = hls
    }
    function updateQuality(newQuality) {
      if (newQuality === 0) {
        window.hls.currentLevel = -1
      } else {
        window.hls.levels.forEach((level, levelIndex) => {
          if (level.height === newQuality) {
            window.hls.currentLevel = levelIndex
          }
        })
      }
    }
  },
}
</script>
