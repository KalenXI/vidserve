import Vue from 'vue'

Vue.filter('formatTime', function (value) {
  if (value) return new Date(value * 1000).toISOString().substr(11, 8)
})

Vue.filter('formatDate', function (value) {
  if (value) return new Date(value).toLocaleDateString('en-us')
})
