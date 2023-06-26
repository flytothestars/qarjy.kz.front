<template>
  <div class="mt-3">
    <div class="text-subtitle-1">Уровень: {{ category.level + 1 }}</div>
  </div>
</template>

<script>
export default {
  name: "ServiceCategory",
  components: {},
  props: ['category'],
}
</script>

<style scoped>

</style>