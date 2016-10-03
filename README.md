# cross-examples

Example for cross framework

## build

Initialize submodule
```bash
git submodule update --init
```

Install dependencies and run build.
```bash
npm install && npm run build
```

./dist directory will contain bundle.js.

## run

Make sure to build first as this package comes without the bundle files.

```bash
npm run start
```

Open `http://localhost:8080` in your browser.
