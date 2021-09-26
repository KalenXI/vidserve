<template>
  <v-container style="max-width: 90em">
    <video width="100%" height="100%" playsinline controls>
      <source
        type="application/x-mpegURL"
        :src="
          process.env.API_BASEURL +
          '/files/videos/' +
          video._id +
          '/' +
          video.url
        " />
      Your browser doesn't support HTML5 video.
    </video>
    <v-row class="my-5 mx-xl-12">
      <v-col style="flex-grow: 5">
        <v-card class="pa-4">
          <h1>{{ video.title }}</h1>
          <div>Recorded On: {{ video.recorded_date | formatDate }}</div>
          <div>Uploaded On: {{ video.uploaded_date | formatDate }}</div>
          <div>Duration: {{ video.duration | formatTime }}</div>
          <div>
            Categories:
            <v-chip
              v-for="category in video.categories"
              :key="category"
              small
              link
              nuxt
              :to="'/category/' + category"
              class="mx-1"
              >{{ category }}
            </v-chip>
          </div>
        </v-card>
        <div style="margin-top: 1em">
          {{ video.description }}
        </div>
      </v-col>
      <v-col class="d-flex justify-end" style="min-width: 100px">
        <div class="d-flex flex-column flex-wrap" style="width: 100%">
          <v-menu
            v-if="video.files.length > 0"
            top
            offset-y
            rounded="lg"
            origin="center center"
            transition="slide-y-transition">
            <template #activator="{ on, attrs }">
              <v-btn width="100%" class="mb-4" v-bind="attrs" v-on="on">
                Download
              </v-btn>
            </template>
            <v-list>
              <v-list-item-group v-model="selectedItem">
                <v-list-item
                  v-for="(file, index) in video.files"
                  :key="index"
                  two-line
                  @click="
                    download(video._id, process.env.API_BASEURL, file.url)
                  ">
                  <v-list-item-content>
                    <v-list-item-title>{{ file.name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      <b>{{ file.size }}</b> | {{ file.resolution }} |
                      {{ file.type }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon large style="vertical-align: bottom"
                      >mdi-file-download-outline</v-icon
                    >
                  </v-list-item-action>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
          <EditVideo
            v-if="permissions.includes('write:all')"
            :initial-video="video"></EditVideo>
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
  import EditVideo from '~/components/EditVideo'

  export default {
    name: 'TestVideo',
    components: {
      EditVideo,
    },
    async asyncData({ params, $axios, $auth }) {
      const id = params.id
      let permissions = []
      $axios.setToken($auth.strategy.token.get(), 'Bearer')
      const video = await $axios.$get('/video/' + id)
      if ($auth.loggedIn) {
        permissions = await $axios.$get('/user/roles')
      }
      return { video, permissions }
    },
    data() {
      return {
        dialog: false,
        select: [],
        selectedItem: {},
        permissions: [],
        video: {
          title: '',
          description: '',
          url: '',
          uploaded_date: '',
          recorded_date: '',
          files: [
            {
              name: '',
              size: '',
              resolution: '',
              type: '',
              url: '',
            },
          ],
          categories: [],
          unlisted: true,
          password: null,
        },
      }
    },
    created() {
      this.$nuxt.$on('video-data-updated', async function () {
        await this.$nuxt.refresh()
      })
      this.$nuxt.$on('video-data-deleted', async function () {
        await this.$nuxt.$router.go(-1)
      })
    },
    mounted() {
      const defaultOptions = {}
      if (Hls.isSupported()) {
        const hls = new Hls()
        const video = document.querySelector('video')
        const source = video.getElementsByTagName('source')[0].src
        hls.loadSource(source)

        hls.on(Hls.Events.MANIFEST_PARSED, function () {
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
    beforeDestroy() {
      this.$nuxt.$off('video-data-updated')
      this.$nuxt.$off('video-data-deleted')
    },
    methods: {
      download(id, baseURL, url) {
        window.location.href = baseURL + '/files/videos/' + id + '/' + url
      },
    },
  }
</script>
