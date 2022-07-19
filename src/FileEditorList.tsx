import FS from "@isomorphic-git/lightning-fs";
import { Component, createSignal, For, onCleanup } from "solid-js";
import { createFileEditor } from "./FileEditor/FileEditor";
import style from "./FileEditor.module.less";
import { FileModel } from "./FileEditor/FileModel";
import { LayoutSidebarLeft, SplitHorizontal } from "./utils/Icon";

export type Expose = {
    watchingEditor: WatchingEditor;
};
export type WatchingEditor = ReturnType<typeof createFileEditor>[2];
export const FileEditorList: Component<{
    files: string[][];
    fs: FS;
    expose: (data: Expose) => void;
    toggleExplorer: Function;
}> = (props) => {
    const fs = props.fs;
    const [fileList, setFileList] = createSignal(props.files);
    const save = (model: FileModel) => {
        /* 这里会引起一个类型错误，但是是可以的 */
        fs.promises.writeFile(model.path, model.model.getValue() as any);
        console.log("写入 ", model.path, "成功");
    };
    const getFile = async (path: string) => {
        const code = (await fs.promises.readFile(path, {
            encoding: "utf8",
        })) as any as string;
        return { code };
    };
    const [FileEditor, ControllerList, watchingEditor] = createFileEditor(
        (manager) => {
            manager.hub.on("save", save);
        }
    );
    props.expose({ watchingEditor });
    onCleanup(() => {
        ControllerList.forEach((manager) => manager.hub.off("save", save));
    });
    return (
        <div class={[style.editor_list, "monaco-editor"].join(" ")}>
            <header class={style.editor_header}>
                <span data-icon onclick={() => props.toggleExplorer()}>
                    {LayoutSidebarLeft()}
                </span>
                <div>File Editor</div>
                <span
                    data-icon
                    onclick={() => {
                        setFileList([...fileList(), []]);
                    }}
                >
                    {SplitHorizontal()}
                </span>
            </header>
            <div class={style.file_list}>
                {/* 使用循环遍历构建多个 Editor */}
                <For each={fileList()}>
                    {(el) => {
                        return (
                            <FileEditor
                                requestSelect={() => {
                                    props.toggleExplorer(true);
                                }}
                                fileList={el}
                                getFile={getFile}
                                closeSelf={() => {
                                    const newList = fileList().filter(
                                        (i) => !Object.is(i, el)
                                    );
                                    // 删除保护，防止没有的事件
                                    if (newList.length === 0) {
                                        setFileList([[]]);
                                    } else {
                                        setFileList(newList);
                                    }
                                }}
                            ></FileEditor>
                        );
                    }}
                </For>
            </div>
        </div>
    );
};
