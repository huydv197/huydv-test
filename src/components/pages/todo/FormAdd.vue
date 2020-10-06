<template>
  <form>
    <div>
      <app-input
        required
        v-model="payload.title"
        placeholder="Title..."
        label="Title"
        label-bold
        :counter="100"
        :message="errors.title"
        :validate="errorCodes.title"
        @input="checkTitle"
      >
      </app-input>
    </div>
    <div>
      <app-input
        required
        v-model="payload.description"
        placeholder="Description..."
        label="Description"
        label-bold
        textarea
      >
      </app-input>
    </div>
    <div class="row">
      <div class="col-md-6">
        <app-input
          type="date"
          :min="pastDates"
          v-model="payload.date"
          placeholder="Date"
          label="Date"
          label-bold
          :message="errors.date"
          :validate="errorCodes.date"
          @input="checkDueDate"
        >
        </app-input>
      </div>
      <div class="col-md-6">
        <div>
          <app-select
            v-model="payload.priority"
            placeholder="Priority"
            bordered
            :options="priorityOpts"
            label="Priority"
            label-bold
          >
          </app-select>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-6">
        <app-button
          v-if="isCreateMode"
          :loading="isSettingData"
          @click.prevent="addTask" 
          class="w-100 mt-4">
          <span>Add</span>
        </app-button>

        <app-button
          v-if="isUpdateMode"
          :loading="isSettingData"
          @click.prevent="updateTask" 
          class="w-100 mt-4">
          <span>Update</span>
        </app-button>
      </div>
      <div class="col-6">
        <app-button
          color="info"
          @click.prevent="cancelForm" 
          class="w-100 mt-4">
          <span>Cancel</span>
        </app-button>
      </div>
    </div>
  </form>
</template>
<script>
import { mapActions } from 'vuex'
import { APP_INPUT_VALIDATE_STATUS as VALIDATE_STATUS } from "@/utils/constants";

export default {
  props: {
    mode: {
      type: String | Number,
      default: 1,
      validator: (value) => [1, 2].includes(value) 
    },
    content: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      VALIDATE_STATUS: Object.freeze(VALIDATE_STATUS),
      isSettingData: false,
      priorityOpts: [
        {
          value: 'low',
          text: 'Low'
        },
        {
          value: 'normal',
          text: 'Normal'
        },
        {
          value: 'high',
          text: 'High'
        },
      ],
      payload: {
        title: '',
        description: '',
        date: null,
        time: null,
        priority: null
      },
      errors: {
        title: null,
        description: null,
        date: null,
        time: null,
        priority: null
      },
      errorCodes: {
        title: VALIDATE_STATUS.DEFAULT,
        date: VALIDATE_STATUS.DEFAULT,
        time: VALIDATE_STATUS.DEFAULT
      }
    }
  },
  computed: {
    isCreateMode: function() {
      return this.mode == 1
    },
    isUpdateMode: function() {
      return this.mode == 2
    },
    pastDates: function() {
      const now = new Date()
      const year = now.getFullYear()
      const month = ("0" + (now.getMonth() + 1)).slice(-2)
      const date = ("0" + now.getDate()).slice(-2)
      return `${year}-${month}-${date}`
    },
    currentDate: function() {
      const now = new Date()
      const year = now.getFullYear()
      const month = ("0" + (now.getMonth() + 1)).slice(-2)
      const date = ("0" + now.getDate()).slice(-2)
      return `${year}-${month}-${date}`
    },
    currentTime: function() {
      const now = new Date()
      const hour = ("0" + now.getHours()).slice(-2)
      const minute = ("0" + now.getMinutes()).slice(-2)
      return `${hour}:${minute}`
    },
    currentDateTime: function() {
      return `${this.currentDate} ${this.currentTime}`
    },
    selectedDateTime: function() {
      return `${this.payload.date} ${this.payload.time}`
    },
    pastTime: function() {
      return this.currentTime
    }
  },
  watch: {
  },
  methods: {
    ...mapActions('todo', ['addTodo', 'updateTodo']),
    async addTask() {
      try {
        this.isSettingData = true
        if (this.validateForm()) {
          const payload = {
            ...this.payload,
            completed: false
          }
          const data = await this.addTodo(payload)
          alert('Add task successful')
          this.$emit('done')
        }
      } catch (error) {

      } finally {
        this.isSettingData = false
      }
    },
    async updateTask() {
      try {
        this.isSettingData = true
        if (this.validateForm()) {
          const payload = this.payload
          const data = await this.updateTodo(payload)
          alert('Update task successful')
          this.$emit('done')
        }
      } catch (error) {

      } finally {
        this.isSettingData = false
      }
    },
    checkTitle() {
      if(!this.payload.title) {
        this.errors.title = "This field is required"
        this.errorCodes.title = VALIDATE_STATUS.ERROR
        return false
      }

      if(this.payload.title.length > 100) {
        this.errorCodes.title = VALIDATE_STATUS.ERROR
        this.errors.title = "Length between from 5 to 100 letters"
        return false
      }
      this.errorCodes.title = VALIDATE_STATUS.DEFAULT
      this.errors.title = ''
      return true
    },
    checkDueDate() {
      if (!this.payload.date) {
        this.errors.date = "This field is required"
        this.errorCodes.date = VALIDATE_STATUS.ERROR
        return false
      } else {
        let dateCurrent = new Date(this.currentDateTime)
        let dateSlc = new Date(this.selectedDateTime)
        if (dateCurrent > dateSlc) {
          this.errors.date = "This field is not be past"
          this.errors.date = "This field is not be past"
          this.errorCodes.date = VALIDATE_STATUS.ERROR
          this.errorCodes.time = VALIDATE_STATUS.ERROR
          return false
        }
      }
      
      this.errorCodes.date = VALIDATE_STATUS.DEFAULT
      this.errorCodes.time = VALIDATE_STATUS.DEFAULT
      this.errors.date = ''
      this.errors.time = ''
      return true
    },
    validateForm() {
      const title = this.checkTitle()
      const dueDate = this.checkDueDate()
      return title && dueDate
    },
    resetForm() {
    },
    cancelForm() {
      this.$emit('cancel')
    },
    initData() {
      if (this.mode == 1) {
        this.payload.date = this.currentDate
        this.payload.time = this.currentTime
        this.payload.priority = 'normal'
      } else {
        this.payload = { ...this.content }
      }
    }
  },
  created() {

  },
  mounted() {
    this.initData()
  }
}
</script>