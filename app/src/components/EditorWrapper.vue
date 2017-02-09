<template>
  <div id="editor-wrapper" :style="editorWrapperWidth">
    <div v-if="currentProject">
      <Editor
        type="html"
        :height="height.html"
        :code="currentProject.html"
        :currentProjectId="currentProjectId"
        @updateCode="updateCode">
        <div class="row-resizer" @mousedown="resizeEditor($event, 'html', 'style')"></div>
      </Editor>
      <Editor
        type="style"
        :height="height.style"
        :code="currentProject.style"
        :currentProjectId="currentProjectId"
        @updateCode="updateCode">
        <div class="row-resizer" @mousedown="resizeEditor($event, 'style', 'js')"></div>
      </Editor>
      <Editor
        type="js"
        :height="height.js"
        :code="currentProject.js"
        :currentProjectId="currentProjectId"
        @updateCode="updateCode"></Editor>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import Editor from './Editor'
import { mapGetters } from 'vuex'

export default {
  name: 'EditorWrapper',
  props: {
    width: Number
  },
  data () {
    return {
      winHeight: 0,
      minHeight: 50,
      height: {
        html: 0,
        style: 0,
        js: 0
      }
    }
  },
  components: {
    Editor
  },
  computed: {
    ...mapGetters([
      'currentProjectId',
      'currentProject'
    ]),
    editorWrapperWidth () {
      return {
        width: this.width + 'px'
      }
    }
  },
  watch: {
    currentProjectId () {
      this.$emit('initCode')
    }
  },
  created () {
    this.winHeight = window.innerHeight
    for (let k in this.height) {
      this.height[k] = this.winHeight / 3
    }
    window.addEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize () {
      this.winHeight = window.innerHeight
      let totalHeight = 0
      for (let k in this.height) {
        totalHeight += this.height[k]
      }
      for (let k in this.height) {
        this.height[k] = this.winHeight * this.height[k] / totalHeight
      }
    },
    updateCode (type, code) {
      this.$store.dispatch('updateProject', {
        id: this.currentProject.id,
        [type]: code
      })
    },
    resizeEditor (e, curr, sibl) {
      this.cleanMouseEvent()
      let clickY = e.clientY
      let currH = this.height[curr]
      let siblH = this.height[sibl]
      document.onmousemove = (e) => {
        let moveY = e.clientY - clickY
        if (currH + moveY < this.minHeight) {
          this.height[curr] = this.minHeight
          this.height[sibl] = currH + siblH - this.minHeight
        } else if (siblH - moveY < this.minHeight) {
          this.height[curr] = currH + siblH - this.minHeight
          this.height[sibl] = this.minHeight
        } else {
          this.height[sibl] = siblH - moveY
          this.height[curr] = currH + moveY
        }
      }
      document.onmouseup = this.cleanMouseEvent
    },
    cleanMouseEvent () {
      document.onmousemove = null
      document.onmouseup = null
    }
  }
}
</script>

<style lang="scss">
@import '../style/share';
#editor-wrapper {
  position: relative;
  height: 100%;
  background: $editorBg;
  .resizer {
    position: absolute;
    right: 0px;
    top: 0;
    width: 10px;
    height: 100%;
    z-index: 100;
    background: transparent;
    &:hover {
      cursor: col-resize;
    }
  }
}
</style>