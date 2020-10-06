<template>
  <div>
    <div class="container-fluid">
      <h3 class="text-center page-title">New Task</h3>
      <div class="box">
        <form-add
          @cancel="cancelForm"
          @done="doneAdd"
        />
      </div>
    </div>
  </div>
</template>

<script>
import FormAdd from '@/components/pages/todo/FormAdd'

export default {
  name: 'TodoList',
  components: {
    FormAdd
  },
  data() {
    return {
    }
  },
  watch: {
  },
  methods: {
    cancelForm() {
      this.goList()
    },
    doneAdd() {
      this.goList()
    },
    goList() {
      this.$router.push({ name: 'TodoList' })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
