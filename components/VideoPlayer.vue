<template>
  <div class="">
    <video
      ref="videoPlayer"
      class="video-js vjs-16-9 vim-css"
      style="width: 100%; font-size: 13px"
    ></video>
  </div>
</template>

<script>
import videojs from 'video.js'
import 'videojs-contrib-quality-levels/dist/videojs-contrib-quality-levels.min'
import 'videojs-hls-quality-selector/dist/videojs-hls-quality-selector.min'
import 'video.js/dist/video-js.css'
import '~/assets/vim.css'

export default {
  name: 'VideoPlayer',
  props: {
    options: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      player: null,
    }
  },
  mounted() {
    this.player = videojs(
      this.$refs.videoPlayer,
      this.options,
      function onPlayerReady() {}
    )
    this.player.hlsQualitySelector({})
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
    }
  },
}
</script>

<style>
.video-js .vjs-big-play-button {
  left: 50%;
  top: 50%;
  margin-left: -1.5em;
  margin-top: -0.75em;
}
</style>
