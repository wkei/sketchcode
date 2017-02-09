<template>
  <div id="project-list" :style="projectListWidth">
    <h1 class="logo">&lt;SketchCode/&gt;</h1>
    <div class="list">
      <div class="inner">
        <ProjectName
          v-for="project in sortedProjects"
          :project="project"
          :active="project.id === currentProjectId">
        </ProjectName>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import ProjectName from './ProjectName'
import { mapGetters } from 'vuex'

export default {
  name: 'ProjectList',
  props: {
    width: Number
  },
  components: {
    ProjectName
  },
  computed: {
    ...mapGetters([
      'projects',
      'currentProjectId'
    ]),
    sortedProjects () {
      return this.projects.slice().sort((a, b) => b.modified_at - a.modified_at)
    },
    projectListWidth () {
      return {
        width: this.width + 'px'
      }
    }
  }
}
</script>

<style lang="scss">
@import '../style/share';

#project-list {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  width: 200px;
  background: $projectListBg;
  cursor: default;
  .logo {
    padding: 15px 20px;
    margin: 0;
    font-size: 18px;
    color: $logoColor;
  }
  .list {
    flex: 1;
    overflow: auto;
  }
  .inner {
    display: table;
    min-width: 100%;
  }
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