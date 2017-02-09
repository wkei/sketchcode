<template>
  <div id="app">
    <ProjectList :style="projectListWidth" :class="{transition: !moving}">
      <div class="resizer" @mousedown="resize($event, 'projectList')"></div>
    </ProjectList>
    <EditorWrapper :style="editorWrapperWidth" :class="{transition: !moving}">
      <div class="resizer" @mousedown="resize($event, 'editorWrapper')"></div>
    </EditorWrapper>
    <Preview ref="previewRef">
      <div class="mask" v-show="moving"></div>
    </Preview>
    <div id="tips" class="transition" :style="tipsStyle" v-show="!hasProject">
      <ul>
        <li><b>⌘ + /</b> to toggle sidebar</li>
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
      winWidth: 0,
      minWidth: 50,
      width: {
        projectList: 200,
        projectListHolder: 0,
        editorWrapper: 400
      },
      moving: false,
      hideProjectList: false
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
    projectListWidth () {
      return {
        width: this.width.projectList + 'px'
      }
    },
    editorWrapperWidth () {
      return {
        width: this.width.editorWrapper + 'px'
      }
    },
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
    this.winWidth = window.innerWidth
    window.addEventListener('resize', this.handleResize)
  },
  mounted () {
    this.initShortcut()
  },
  methods: {
    handleResize () {
      this.winWidth = window.innerWidth
    },
    resize (e, target) {
      this.cleanMouseEvent()
      let clickX = e.clientX
      let currW = this.width[target]
      let otherWidth = this.width[target === 'editorWrapper' ? 'projectList' : 'editorWrapper']
      this.moving = true
      window.onmousemove = (e) => {
        let moveX = e.clientX - clickX
        if (currW + moveX < this.minWidth) {
          this.width[target] = this.minWidth
        } else if (this.winWidth - (currW + moveX) - otherWidth < this.minWidth) {
          this.width[target] = this.winWidth - this.minWidth - otherWidth
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
      } else if (this.commandKey && e.keyCode === 191) {
        this.toggleProjectList()
      }
    },
    shortcutKeyup (e) {
      this.commandKey = false
    },
    newProject () {
      this.$store.dispatch('addProject')
    },
    distroyProject () {
      if (window.confirm('Are you sure to delete current project?')) {
        this.$store.dispatch('destroyProject', { id: this.currentProjectId })
      }
      this.commandKey = false
    },
    toggleProjectList () {
      if (this.width.projectList === 0) {
        this.width.projectList = this.width.projectListHolder
        if (this.winWidth - this.width.projectList - this.width.editorWrapper < this.minWidth) {
          this.width.editorWrapper = this.winWidth - this.width.projectList - this.minWidth
        }
      } else {
        this.width.projectListHolder = this.width.projectList
        this.width.projectList = 0
      }
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
.transition {
  transition: all .3s
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
