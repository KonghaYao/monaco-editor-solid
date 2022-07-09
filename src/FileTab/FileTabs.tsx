import { Component, createSignal, JSXElement, onCleanup } from "solid-js";
import { For } from "solid-js/web";
import style from "./FileTabs.module.less";

import { FileTab } from "./FileTab";
import { FileManager } from "../FileManager";

export const FileTabs: Component<{
    fileList: string[];
    onselect: (i: string) => void;
    onclose: (i: string) => void;
    Void: JSXElement;
    hub: FileManager["hub"];
    closeSelf: Function;
}> = (props) => {
    const [fileList, setFileList] = createSignal(props.fileList);
    const [opening, setOpening] = createSignal(props.fileList[0]);
    const event = {
        open({ path }: { path: string }) {
            const list = fileList();
            if (list.indexOf(path) === -1) {
                setFileList([path, ...list]);
            }
            setOpening(path);
        },
        close({ path }: { path: string }) {
            const list = fileList();

            setFileList(list.filter((item) => item !== path));
            fileList().length === 0 && props.closeSelf();
        },
    };
    props.hub.on("open", event.open);
    props.hub.on("close", event.close);
    onCleanup(() => {
        props.hub.off("open", event.open);
        props.hub.off("close", event.close);
    });
    return (
        <>
            <div class={style.file_tabs}>
                <For each={fileList()} fallback={props.Void}>
                    {(i) => {
                        const tabName = i.replace(/^.*?([^\/]+)$/, "$1");
                        return (
                            <FileTab
                                name={tabName}
                                path={i}
                                selected={opening() === i}
                                onselect={() => props.onselect(i)}
                                onclose={() => {
                                    props.onclose(i);
                                }}
                            ></FileTab>
                        );
                    }}
                </For>
            </div>
        </>
    );
};
