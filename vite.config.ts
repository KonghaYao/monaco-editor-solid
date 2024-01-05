import solid from "vite-plugin-solid";
import svgLoader from 'vite-svg-loader'
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        // wasm()
        solid(),
        svgLoader({
            defaultImport: 'component' // or 'raw'
          }),
        {
            name: "232322",
            resolveId: {
                order: "pre",
                handler(source, importer, options) {
                    if (source.endsWith('.wasm')) {
                        return { id: source + '?url' }
                    }
                }
            },
        }
    ],
    build: {
        target: "esnext"
    }
});