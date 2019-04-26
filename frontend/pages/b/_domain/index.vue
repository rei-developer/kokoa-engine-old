<template>
  <div>
    테스트입니다.
    {{ page }}
  </div>
</template>

<script>
  export default {
    data() {
      return {
        page: 1
      }
    },
    created() {
      this.page = this.$route.query.page || 1
    }
  }
</script>