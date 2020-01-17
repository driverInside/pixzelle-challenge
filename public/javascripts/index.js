var app = new Vue({
  el: '#app',
  data: {
    username: '',
    user: {},
    error: false
  },
  methods: {
    searchUser: function (event) {
      event.preventDefault()
      
      if (this.username === '') {
        return
      }

      event.target.classList.add('is-loading')
      
      fetch(`/api/users/${this.username}`)
        .then((response) => {
          if (response.status === 404) {
            throw new Error('Error not found')
          }
          return response.json()
        })
        .then((data) => {
          event.target.classList.remove('is-loading')
          this.username = ''
          this.user = data
        })
        .catch(e => {
          if (e.message === 'Error not found') {
            this.error = true
          }
          console.error(e)
        })
        .finally(() => {
          event.target.classList.remove('is-loading')
        })
    },

    clear: function () {
      this.username = ''
      this.user = {}
      this.error = false
    }
  }
})
