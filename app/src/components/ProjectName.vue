<template>
  <div
    class="item"
    :class="{'active': active, 'edit-mode': editMode}">
    <div
      class="name"
      v-show="!editMode"
      @click="switchProject"
      @dblclick="switchEditMode">{{ project.name }}</div>
    <input
      class="name-input"
      type="text"
      ref="nameInputRef"
      v-show="editMode"
      v-model="name"
      @blur="save"
      @keyup.enter="blurInput"
      @keyup.esc="unsave"/>
  </div>
</template>

<script>
export default {
  name: 'ProjectName',
  props: {
    active: Boolean,
    project: Object,
    projectListWidth: String
  },
  data () {
    return {
      name: '',
      editMode: false
    }
  },
  methods: {
    switchProject () {
      this.$store.dispatch('switchProject', { id: this.project.id })
    },
    switchEditMode () {
      this.editMode = !this.editMode
      if (this.editMode) {
        this.name = this.project.name
        setTimeout(() => {
          this.$refs.nameInputRef.select()
        }, 1)
      } else {
        this.name = ''
      }
    },
    blurInput () {
      this.$refs.nameInputRef.blur()
    },
    save () {
      let newName = this.name.trim()
      if (newName === this.project.name) {
        this.switchEditMode()
      } else if (newName === '') {
        this.name = this.project.name
        this.switchEditMode()
      } else {
        this.$store.dispatch('updateProject', {
          id: this.project.id,
          name: newName
        }).then(() => {
          this.switchEditMode()
        })
      }
    },
    unsave () {
      this.name = this.project.name
      this.switchEditMode()
    }
  }
}
</script>

<style lang="scss" scope>
@import '../style/share';

.item {
  display: table-caption;
  &.active {
    background: $projectListActiveBg;
    .name, .name:hover {
      color: $projectListActiveColor;
    }
  }
  .name {
    padding: 12px 20px;
    color: $projectListColor;
    font-size: 14px;
    white-space: nowrap;
    &:hover {
      color: $projectListHoverColor;
    }
  }
  &.edit-mode {
    padding: 0 10px;
  }
  .name-input {
    -webkit-appearance: none;
    height: 24px;
    width: 100%;
    padding: 0 10px;
    margin: 8px 0;
    background: $editorBg;
    border: none;
    outline: none;
    color: $projectListColor;
    font-family: $defaultFont;
  }
}
</style>