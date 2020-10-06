<template>
  <div class="todo-item">
    <div class="d-flex">
      <div class="d-flex align-items-center todo-item__left">
        <app-checkbox
          class="mr-3"
          @change="toggleSelected"
        />
        <p class="todo-item__title" :title="detail.title">{{ detail.title }}</p>
      </div>
      <div
        class="ml-auto nowrap"
      >
        <app-button
          color="info"
          size="sm"
          @click.prevent="show()"
        >
          Detail
        </app-button>
        <app-button
          class="ml-3"
          color="error"
          size="sm"
          @click.prevent="remove()"
        >
          Remove
        </app-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    detail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      checked: false
    }
  },
  methods: {
    show() {
      this.$emit('show', this.detail)
    },
    remove() {
      this.$emit('remove', this.detail)
    },
    toggleSelected(val) {
      this.$emit('toggleSelect', val, this.detail)
    }
  }
}
</script>

<style lang="scss" scoped>
.todo-item {
  border: 1px solid $color-border;
  border-radius: $border-radius-common;
  padding: 1.5rem;
}
.todo-item__left {
  overflow: hidden;
}
.todo-item__title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  -ms-text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}
</style>
