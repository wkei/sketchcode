<template>
  <div id="app">
    <ProjectList :width="width.projectList">
      <div class="resizer" @mousedown="resize($event, 'projectList')"></div>
    </ProjectList>
    <EditorWrapper ref="EditorWrapperRef" :width="width.editor">
      <div class="resizer" @mousedown="resize($event, 'editor')"></div>
    </EditorWrapper>
    <Preview ref="previewRef">
      <div class="mask" v-show="moving"></div>
    </Preview>
    <div id="tips" :style="tipsStyle" v-show="!hasProject">
      <ul>
        <li><b v-if="dev">⌘ + K</b><b v-else>⌘ + N</b> to create a new project</li>
        <li><b>⌘ + Del</b> to delete current project</li>
        <li><b>Double Click</b> project title to rename</li>
      </ul> 
    </div>
  </div>
</template>

<script>
require('normalize.css')
import EditorWrapper from './components/EditorWrapper'
import Preview from './components/Preview'
import ProjectList from './components/ProjectList'
import { mapGetters } from 'vuex'

export default {
  name: 'app',
  data () {
    return {
      winWdith: 0,
      minWidth: 100,
      width: {
        projectList: 200,
        editor: 400
      },
      moving: false,
      count: 0
    }
  },
  components: {
    EditorWrapper,
    Preview,
    ProjectList
  },
  computed: {
    ...mapGetters([
      'currentProjectId',
      'projectCount'
    ]),
    dev () {
      return window.location.protocol === 'http:'
    },
    hasProject () {
      return this.projectCount > 0
    },
    tipsStyle () {
      return {
        left: this.width.projectList + 'px'
      }
    }
  },
  created () {
    this.winWdith = window.innerWidth
    window.addEventListener('resize', this.handleResize)
  },
  mounted () {
    this.initShortcut()
  },
  methods: {
    handleResize () {
      this.winWdith = window.innerWidth
    },
    resize (e, target) {
      this.cleanMouseEvent()
      let clickX = e.clientX
      let currW = this.width[target]
      let otherWidth = this.width[target === 'editor' ? 'projectList' : 'editor']
      this.moving = true
      window.onmousemove = (e) => {
        let moveX = e.clientX - clickX
        if (currW + moveX < this.minWidth) {
          this.width[target] = this.minWidth
        } else if (this.winWdith - (currW + moveX) - otherWidth < this.minWidth) {
          this.width[target] = this.winWdith - this.minWidth - otherWidth
        } else {
          this.width[target] = currW + moveX
        }
      }
      window.onmouseup = this.cleanMouseEvent
    },
    cleanMouseEvent () {
      this.moving = false
      window.onmousemove = null
      window.onmouseup = null
    },
    initShortcut () {
      document.addEventListener('keydown', this.shortcutKeydown, false)
      document.addEventListener('keyup', this.shortcutKeyup, false)
      let iframeDoc = this.$refs.previewRef.$el.querySelector('iframe').contentDocument
      iframeDoc.addEventListener('keydown', this.shortcutKeydown, false)
      iframeDoc.addEventListener('keyup', this.shortcutKeyup, false)
    },
    shortcutKeydown (e) {
      if (e.keyCode === 91) {
        this.commandKey = true
      } else if (this.commandKey &&
          (e.keyCode === 78 && process.env.NODE_ENV === 'production' ||
           e.keyCode === 75 && process.env.NODE_ENV !== 'production')) {
        this.newProject()
      } else if (this.commandKey && e.keyCode === 8) {
        this.distroyProject()
      }
    },
    shortcutKeyup (e) {
      if (e.keyCode === 91) {
        this.commandKey = false
      }
    },
    newProject () {
      this.$store.dispatch('addProject')
    },
    distroyProject () {
      this.$store.dispatch('destroyProject', { id: this.currentProjectId })
    }
  }
}
</script>

<style lang="scss">
@import './style/share';

* {
  box-sizing: border-box;
  -webkit-user-select: none;
  user-select: none;
}
// for safari
input, textarea {
  -webkit-user-select: text;
  user-select: text;
}
html, body {
  height: 100%;
  overflow: hidden;
  font-family: $defaultFont;
  font-size: $fontSize;
  background: $editorBg;
}
#app {
  height: 100%;
  display: flex;
  flex-direction: row;
}
#tips {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  background: $editorBg;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
  ul {
    list-style: none;
    color: $tipsColor;
    font-size: $tipsFontSize;
    font-family: $codeFont;
    line-height: 2;
    b {
      color: $tipsShortcutColor;
    }
  }
}

</style>
