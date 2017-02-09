const seed = {
  currentProjectId: null,
  projects: []
}
const DB_KEY = 'sketch_code'
const localStorage = window.localStorage

export default {
  init () {
    let db = localStorage.getItem(DB_KEY)
    if (!db) {
      localStorage.setItem(DB_KEY, JSON.stringify(seed))
      return Object.assign(seed)
    } else {
      let _db = JSON.parse(db)
      return Object.assign(_db)
    }
  },
  update (db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db))
  }
}
