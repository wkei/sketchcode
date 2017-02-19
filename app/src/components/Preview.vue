<template>
  <div id="preview-wrapper">
    <div id="preview" ref="previewRef"></div>
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
      js: '',
      previewSrc: ''
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
  mounted () {
    if (this.currentProject) {
      this.update()
    }
  },
  methods: {
    update () {
      this.html = this.currentProject.html
      this.style = this.currentProject.style
      this.js = this.currentProject.js
      let preview = this.$refs.previewRef
      preview.innerHTML = ''
      let frame = document.createElement('iframe')
      preview.appendChild(frame)
      let doc = frame.contentWindow.document
      let style = document.createElement('style')
      style.type = 'text/css'
      style.id = this.currentProject.id + '_style'
      style.textContent = this.style
      doc.body.appendChild(style)
      let script = document.createElement('script')
      script.id = this.currentProject.id + '_script'
      script.textContent = this.js
      doc.open()
      doc.write(this.html || '<!DOCTYPE html><html><head><title></title></head><body></body></html>')
      doc.write(style.outerHTML)
      doc.write(script.outerHTML)
      doc.close()
    },
    updateStyle () {
      this.style = this.currentProject.style
      let frame = this.$refs.previewRef.querySelector('iframe')
      let doc = frame.contentDocument
      let style = doc.getElementById(this.currentProject.id + '_style')
      style.textContent = this.currentProject.style
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
  height: 100%;
  width: 100%;
}
#preview > iframe {
  width: 100%;
  height: 100%;
  border: none;
  overflow: auto;
}
</style>
