export default {
  currentProjectId: state => state.currentProjectId,
  currentProject: state => {
    return state.currentProjectId ? state.projects.find(project => project.id === state.currentProjectId) : null
  },
  projects: state => state.projects,
  projectCount: state => {
    return state.projects.length
  }
}
