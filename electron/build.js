var packager = require('electron-packager')

var platform = process.argv[2]

var platforms = {
  mac: 'darwin',
  win: 'win32',
  linux: 'linux'
}

var icons = {
  mac: './icon/icon.icns',
  win: './icon/icon.ico',
  linux: './icon/icon.png'
}

var opt = {
  dir: './',
  overwrite: true,
  platform: platforms[platform],
  icon: icons[platform],
  out: './release-builds',
  prune: true,
  ignore: 'node_modules',
  asar: true
}

packager(opt, function (err, appPath) {})
