# SketchCode

An offline JSFiddle/CodePen/JSBin like desktop app powered by Vue + Electron

![demo](./presskit/demo.png)

![start screen](./presskit/start.png)

## Develop in browser

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

## Package

- Tested on macOS Sierra & win7
- Install libiaries base on terminal log

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
