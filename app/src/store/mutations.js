import mutationTypes from './mutation-types'
import db from './db'

export default {
  [mutationTypes.SWITCH_PROJECT] (state, { id }) {
    setCurrentProjectId(state, id)
  },
  [mutationTypes.ADD_PROJECT] (state) {
    addProject(state)
  },
  [mutationTypes.UPDATE_PROJECT] (state, context) {
    updateProject(state, context)
  },
  [mutationTypes.DESTROY_PROJECT] (state, { id }) {
    destroyProject(state, id)
  }
}

function setCurrentProjectId (state, id) {
  state.currentProjectId = id
  db.update(state)
}

function addProject (state) {
  let timestamp = Date.now()
  let project = {
    id: 'p_' + timestamp,
    name: 'Untitled',
    html: '',
    css: '',
    js: '',
    created_at: timestamp,
    modified_at: timestamp
  }
  state.projects.push(project)
  setCurrentProjectId(state, project.id)
}

function updateProject (state, context) {
  let project = state.projects.find((project) => project.id === context.id)
  if (project) {
    for (let k in context) {
      project[k] = context[k]
    }
    project.modified_at = Date.now()
  }
  db.update(state)
}

function destroyProject (state, id) {
  let project = state.projects.find((project) => project.id === id)
  let idx = state.projects.indexOf(project)
  state.projects.splice(idx, 1)
  let _projects = state.projects.sort((a, b) => {
    return a.modified_at < b.modified_at
  })
  if (_projects.length) {
    setCurrentProjectId(state, _projects[0].id)
  } else {
    setCurrentProjectId(state, null)
  }
}
