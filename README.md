# SketchCode

![demo](./presskit/demo.png)

![start screen](./presskit/start.png)

`Vue` + `Electron` = `<SketchCode/>`

## Development in browser

```
cd app
yarn
yarn dev
```

## Test app

```
cd app
yarn
yarn build

cd ../electron
yarn start
```

## Production

- Tested on macOS Sierra & win7
- Install relatived libiaries base on error log

```
cd app
yarn build

cd ../electron
yarn build-mac
yarn build-win
yarn build-linux
```

=====

<p align="center"><img src="./presskit/icon.png"></p>
