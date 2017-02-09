<template>
  <div :class="'editor editor-' + type" :style="{height: height + 'px'}">
    <div class="type">{{ typeName }}</div>
    <div class="inputarea" @keyup="update"></div>  
    <slot></slot>
  </div>
</template>

<script>
import CodeMirror from 'codemirror/lib/codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/htmlembedded/htmlembedded'
import 'codemirror/mode/css/css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/scroll/simplescrollbars'
import _ from 'lodash'
import filters from '../filters/'

export default {
  name: 'Editor',
  props: ['type', 'height', 'code', 'currentProjectId'],
  data () {
    return {
      input: '',
      codeMirror: null
    }
  },
  filters: filters,
  watch: {
    'currentProjectId' () {
      this.initCode()
    }
  },
  computed: {
    typeName () {
      let names = {
        html: 'html',
        style: 'css',
        js: 'js'
      }
      return names[this.type]
    }
  },
  mounted () {
    this.initEditor()
    this.initCode()
  },
  methods: {
    initEditor () {
      let types = {
        html: 'htmlmixed',
        style: 'css',
        js: 'javascript'
      }
      console.log(types[this.type])
      this.codeMirror = CodeMirror(this.$el.querySelector('.inputarea'), {
        lineNumbers: true,
        mode: types[this.type],
        lineWrapping: true,
        theme: 'material',
        scrollbarStyle: 'overlay',
        tabSize: 2
      })
      this.$el.querySelector('.CodeMirror-scroll').style.height = this.$el.clientHeight
    },
    initCode () {
      this.setCodeMirrorValue(this.code)
    },
    update: _.debounce(function () {
      this.$emit('updateCode', this.type, this.codeMirror.getValue().trim())
    }, 300),
    setCodeMirrorValue (val) {
      this.codeMirror.getDoc().setValue(val)
    }
  }
}
</script>

<style lang="scss">
@import '../style/share';
.editor {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  .type {
    position: absolute;
    z-index: 200;
    right: 15px;
    top: 5px;
    width: 40px;
    color: rgba(98, 126, 140, 0.6);
    font: 11px $codeFont;
    text-align: right;
    cursor: default;
    text-transform: uppercase;
  }
  .inputarea {
    flex: 1;
    height: 100%;
  }
  .CodeMirror {
    height: 100%;
    font-size: $fontSize;
    font-family: $codeFont;
    line-height: 1.3;
    &:hover {
      .CodeMirror-overlayscroll-horizontal div,
      .CodeMirror-overlayscroll-vertical div {
        opacity: 1;
        transition: opacity .3s;
      }
    }
    .CodeMirror-overlayscroll-vertical,
    .CodeMirror-overlayscroll-horizontal {
      width: 4px;
      div {
        background: $scrollbarColor;
        border-radius: 0;
        opacity: 0;
        transition: opacity .3s .3s;
      }
    }
  }
  .CodeMirror-linenumber {
    min-width: 16px;
    padding-top: 2px;
    font-size: 10px;
  }
  .row-resizer {
    position: absolute;
    bottom: -6px;
    left: 0;
    right: 0;
    width: 100%;
    height: 10px;
    z-index: 200;
    background: transparent;
    &:hover {
      cursor: row-resize;
    }
  }
}

.editor-html, .editor-style {
  border-bottom: 2px solid rgba(45, 59, 66, .7);
}
</style>
