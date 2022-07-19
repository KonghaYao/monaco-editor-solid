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
    const [fileList, setFileList] = createSignal(
        props.fileList.map((i) => {
            return { path: i, isSave: true };
        })
    );
    const [opening, setOpening] = createSignal(props.fileList[0]);
    const event = {
        open({ path }: { path: string }) {
            setFileList((list) => {
                if (!list.find((i) => i.path === path)) {
                    return [{ path, isSave: true }, ...list];
                }
                return list;
            });
            setOpening(path);
        },
        close({ path }: { path: string }) {
            setFileList((list) => list.filter((item) => item.path !== path));
            fileList().length === 0 && props.closeSelf();
        },
    };
    props.hub.on("open", event.open);
    props.hub.on("close", event.close);
    props.hub.on("unSave", (path) => {
        setFileList((list) => {
            const index = list.findIndex((i) => i.path === path && i.isSave);
            if (index !== -1) {
                const item = { ...list[index], isSave: false };
                const newList = [...list];
                newList[index] = item;
                return newList;
            } else {
                return list;
            }
        });
    });
    props.hub.on("save", (model) => {
        const path = model.path;
        setFileList((list) => {
            const index = list.findIndex((i) => i.path === path && !i.isSave);
            if (index !== -1) {
                const item = { ...list[index], isSave: true };
                const newList = [...list];
                newList[index] = item;
                return newList;
            } else {
                return list;
            }
        });
    });
    onCleanup(() => {
        props.hub.off("open", event.open);
        props.hub.off("close", event.close);
    });
    return (
        <>
            <div class={style.file_tabs}>
                <For each={fileList()} fallback={props.Void}>
                    {(i) => {
                        const tabName = i.path.replace(/^.*?([^\/]+)$/, "$1");
                        return (
                            <FileTab
                                name={tabName}
                                path={i.path}
                                selected={opening() === i.path}
                                onselect={() => props.onselect(i.path)}
                                onclose={() => {
                                    props.onclose(i.path);
                                }}
                                isSave={i.isSave}
                            ></FileTab>
                        );
                    }}
                </For>
            </div>
        </>
    );
};
