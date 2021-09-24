import Vue from 'vue'

Vue.filter('formatTime', function (value) {
  if (value === 0) return '00:00:00'
  if (value) return new Date(value * 1000).toISOString().substr(11, 8)
})

Vue.filter('formatDate', function (value) {
  if (value) return new Date(value).toLocaleDateString('en-us')
})

Vue.filter('formatDateTime', function (value) {
  if (value) return new Date(value).toLocaleString('en-us')
})

Vue.filter('titleCase', function (value) {
  const splitStr = value.toLowerCase().split(' ')
  for (let i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
  }
  // Directly return the joined string
  return splitStr.join(' ')
})

Vue.filter('formatCategories', function (value) {
  if (value) return value.replace(/\+/g, ' & ')
})
