import mitt from "mitt";
import { FileModel } from "./FileEditor/FileModel";
import { createEditor } from "@codingame/monaco-editor-wrapper";
import { monaco } from "@codingame/monaco-editor-wrapper";
/* 管理 Monaco Editor 的一个类 */
export class FileManager {
    monacoEditor!: ReturnType<typeof createEditor>;
    /* 向外发送事件的hub */
    hub = mitt<{
        prepare: { path: string; model: FileModel };
        open: { path: string; model: FileModel };
        close: { path: string };
        save: FileModel;
        unSave: string;
    }>();
    constructor(
        /* 这个模型同一全局管理 */
        public fileStore: Map<string, FileModel>,
        public id: string | number
    ) {}
    mount(container: HTMLElement) {
        this.monacoEditor = createEditor(container, {
            model: null,
            autoIndent: "advanced",
            automaticLayout: true,
            fontFamily: "Consolas",
            fontSize: 16,
            minimap: { enabled: false },
        });

        this.monacoEditor.onDidChangeModelContent(() => {
            const fileModel = this.findFileCache(this.monacoEditor.getModel()!);
            if (fileModel) this.hub.emit("unSave", fileModel.path);
        });
        const save = () => {
            const fileModel = this.findFileCache(this.monacoEditor.getModel()!);
            console.log(this.id, fileModel);
            if (fileModel) this.saveFile(fileModel.path);
        };

        this.monacoEditor.addAction({
            id: "save",
            label: "保存",
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
            contextMenuGroupId: "navigation",
            run: save, // 点击后执行的操作
        });
    }
    /* 根据 Model 查找 FileModel */
    findFileCache(model: FileModel["model"]) {
        for (let i of this.fileStore.values()) {
            if (i.model === model) return i;
        }
        return false;
    }

    /* 提前准备文件，但是不进行展示 */
    prepareFile(path: string, code = "") {
        if (!this.fileStore.has(path)) {
            const model = new FileModel();
            model.init(path, code);
            this.fileStore.set(path, model);
            this.hub.emit("prepare", { path, model });
        }
    }

    /* 打开文件，如果没有则创建，如果有则直接打开 */
    openFile(path: string, code: string = "") {
        if (this.fileStore.has(path)) {
            this.openExistFile(path);
        } else {
            const model = new FileModel();
            model.init(path, code);
            this.fileStore.set(path, model);
            this.monacoEditor.setModel(model.model);
            this.hub.emit("open", { path, model });
        }
    }
    /* 打开存在的一个文件 */
    openExistFile(path: string) {
        const file = this.fileStore.get(path);
        if (file) {
            this.monacoEditor.setModel(file.model);
            this.hub.emit("open", { path, model: file });
        }
    }
    private deleteBuffer: string[] = [];
    /* 最多缓存多少个被删除的文件 */
    maxCloseCache = 5;
    /* 关闭一个文件 */
    closeFile(path: string) {
        const old = this.fileStore.get(path);
        if (old) {
            // old.destroy();
            // ! 注意，虽然关闭了，我们认为为了加载速度考虑，任然保留
            if (this.deleteBuffer.length > this.maxCloseCache) {
                const first = this.deleteBuffer.shift();
                first && this.fileStore.delete(first);
            }
            this.deleteBuffer.push(path);
            this.hub.emit("close", { path });
        }
    }

    saveFile(path: string | FileModel) {
        const file = typeof path === "string" ? this.fileStore.get(path) : path;
        if (file) {
            this.hub.emit("save", file);
        }
    }
}
