import { Component, lazy, onMount } from "solid-js";
import { Suspense } from "solid-js/web";
import { getMonaco } from "./getMonaco";
import style from "./FileEditor.module.less";
type Props = {
    fileList: string[];
    getFile(path: string): Promise<{ code: string; language?: string }>;
    closeSelf(): void;
    requestSelect(): void;
    defaultTheme?: string;
};

import { FileTabs } from "./FileTab/FileTabs";
import { FileManager } from "./FileManager";
import { FileModel } from "./FileModel";
import type { editor } from "@codingame/monaco-editor";

type FileEditorInstanceType = (
    controller: FileManager,
    onWatch: (e: editor.IEditorMouseEvent) => void
) => Component<Props>;

/* 文件浏览器 */
const FileEditorInstance: FileEditorInstanceType =
    (controller, onWatch) => (props) => {
        onMount(() => {
            // fileList 是初始化参数，并非响应式
            const promises = props.fileList.map(async (path) => {
                const { code } = await props.getFile(path);
                return controller.prepareFile(path, code);
            });
            Promise.all(promises).then((list) => {
                if (list.length) controller.openExistFile(props.fileList[0]);
            });
        });

        return (
            <nav class={style.file_editor}>
                {/* ! 注意 props.fileList 没有办法被响应式监控，所以没有写空组件 */}
                <FileTabs
                    Void={
                        <div class={style.void}>
                            <p>q(≧▽≦q)</p>
                            <div>
                                <span data-button onclick={props.closeSelf}>
                                    Close Editor
                                </span>
                                <span data-button onclick={props.requestSelect}>
                                    Open File
                                </span>
                            </div>
                        </div>
                    }
                    fileList={props.fileList}
                    hub={controller.hub}
                    onselect={(i) => {
                        controller.openFile(i);
                    }}
                    onclose={(i) => {
                        controller.closeFile(i);
                    }}
                    closeSelf={props.closeSelf}
                ></FileTabs>
                <div
                    data-class="editor"
                    ref={(el: HTMLDivElement) => {
                        controller.mount(el);
                        controller.monacoEditor.onMouseDown(onWatch);
                    }}
                ></div>
            </nav>
        );
    };

/**
 * 统一的文件编辑器的创建函数
 * */
export const createFileEditor = (
    init?: (fileManager: FileManager) => void | Promise<void>
) => {
    const fileStore = new Map<string, FileModel>();
    let controllers: FileManager[] = [];
    const info = {
        watchingIndex: 0,
        getWatching() {
            return controllers[this.watchingIndex];
        },
    };
    /* Solid 组件 */
    const FileEditor: Component<Props> = (props) => {
        /* 初始化 monaco */
        const Instance = lazy(async () => {
            const id = controllers.length;
            /* 统一的文件管理 */
            const manager = new FileManager(fileStore, id, props.defaultTheme);
            info.watchingIndex = id;
            controllers.push(manager);
            init && (await init(manager));
            await getMonaco();
            return {
                default: FileEditorInstance(manager, () => {
                    info.watchingIndex = id;
                }),
            };
        });
        return (
            <Suspense
                fallback={
                    <div style={style.Void}>
                        <div>Loading Editor...</div>
                    </div>
                }
            >
                <Instance {...props}></Instance>
            </Suspense>
        );
    };
    /**
     * @param FileEditor 可以复用的文件编辑器
     * @param controllers 文件系统控制器
     */
    return [FileEditor, controllers, info] as const;
};
