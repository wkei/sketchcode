<template>
  <div id="preview-wrapper">
    <iframe id="preview" ref="previewRef"></iframe>
    <slot></slot>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Preview',
  data () {
    return {
      html: '',
      style: '',
      js: ''
    }
  },
  computed: {
    ...mapGetters([
      'currentProject'
    ])
  },
  watch: {
    currentProject: {
      handler (val) {
        if (!val) return false
        if (val.html === this.html &&
          val.js === this.js &&
          val.style !== this.style) {
          this.updateStyle()
        } else if (val.html !== this.html || val.js !== this.js) {
          this.update()
        }
      },
      deep: true
    }
  },
  methods: {
    update () {
      console.log('update')
      let doc = this.$refs.previewRef.contentDocument
      doc.body.innerHTML = this.currentProject.html
      let script = document.createElement('script')
      script.type = 'text/javascript'
      script.id = this.currentProject.id + '_script'
      script.textContent = this.currentProject.js
      let style = document.createElement('style')
      style.type = 'text/css'
      style.id = this.currentProject.id + '_style'
      style.textContent = this.currentProject.style
      doc.body.appendChild(script)
      doc.body.appendChild(style)
      this.style = this.currentProject.style
      this.html = this.currentProject.html
      this.js = this.currentProject.js
    },
    updateStyle () {
      console.log('updateStyle')
      let doc = this.$refs.previewRef.contentDocument
      let style = doc.getElementById(this.currentProject.id + '_style')
      style.textContent = this.currentProject.style
      this.style = this.currentProject.style
    },
    cleanPreview () {
      let doc = this.$refs.previewRef.contentDocument
      doc.body.innerHTML = ''
    }
  }
}
</script>

<style lang="scss">
#preview-wrapper {
  position: relative;
  flex: 1;
  height: 100%;
  width: 100%;
  background: #fff;
  > .mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
#preview {
  width: 100%;
  height: 100%;
  position: relative;
  height: 100%;
  width: 100%;
  border: none;
  overflow: auto;
}
</style>
