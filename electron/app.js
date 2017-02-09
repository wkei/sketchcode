const {app, BrowserWindow} = require('electron')
const path = require('path')

let mainWindow = null

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit()
})

exports.load = (appUrl) => {
  app.on('ready', () => {
    const options = {
      title: 'SketchCode',
      width: 1200,
      height: 720,
      autoHideMenuBar: true,
      backgroundColor: '#263238',
      useContentSize: true
    }
    
    mainWindow = new BrowserWindow(options)
    mainWindow.loadURL(appUrl)
    mainWindow.focus()
  })
}
