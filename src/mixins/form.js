export default {
  //   inject: ['formData', 'modalType'],
  inject: {
    formData: {
      type: Object
    },
    modalType: {
      type: String
    }
  },
  computed: {
    isOnlyRead() {
      return this.modalType === 'readonly'
    }
  }
}
