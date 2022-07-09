# Monaco Solid

## Using importmap to load plugin

> cdn.skypack.dev can perfectly make editor run, but esm.run can't run well.

```html
<script type="importmap">
    {
        "imports": {
            "solid-js": "https://cdn.skypack.dev/solid-js",
            "solid-js/web": "https://cdn.skypack.dev/solid-js/web",
            "vscode-icons-js": "https://cdn.skypack.dev/vscode-icons-js",
            "monaco-editor-solid": "https://cdn.skypack.dev/monaco-editor-solid/dist/index.js"
        }
    }
</script>
```

## Just use it in your code

```js
import { render } from "solid-js/web";
import { FileEditorList } from "monaco-editor-solid";
render(
    () =>
        FileEditorList({
            files: [
                // First Editor Show
                ["index.html", "343434"],
                // Second Editor Show
                [],
            ],

            toggleExplorer(bool) {
                console.log("open Explorer");
            },
            fs: {
                promises: {
                    // create a readFile to loadFile!
                    readFile() {
                        console.log(arguments);
                        return "vers";
                    },
                },
            },
            // Yes, Components expose some api
            expose(api) {
                console.log(api);
            },
        }),
    document.body
);
```

## Preload Monaco

This Monaco Version is @codingame/monaco-editor. We will load it in FileEditorList automatically, but you can load it yourself or just let us to preload.

```js
import { loadMonaco } from "monaco-editor-solid";
await loadMonaco(); // it will add a global  `monaco`
```

## About Themes

You can change Themes after finish rendering.

```js
import { AllThemes, applyTheme } from "monaco-editor-solid";
// Yes just push a vscode theme json to `AllThemes` Array
AllThemes.push({
    name: "github-dark",
    url: "https://fastly.jsdelivr.net/npm/github-vscode-themes/dist/dark.json",
});

// ! important, after FileEditorList finish rending!
// we load it automatically ，so don't worry about how we fetch the file and render it!
applyTheme("github-dark");
```
