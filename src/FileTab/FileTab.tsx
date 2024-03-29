import { Component, Show } from "solid-js";
import { getIconForFile } from "vscode-icons-js";
import { Close } from "../utils/Icon";
import style from "./FileTabs.module.less";
export const FileTab: Component<{
    name: string;
    path: string;
    selected: boolean;
    onselect: Function;
    onclose: Function;
    isSave: boolean;
}> = (props) => {
    const src =
        "https://jsdelivr.deno.dev/gh/vscode-icons/vscode-icons/icons/" +
        getIconForFile(props.name);
    return (
        <div
            class={style.file_tab}
            data-selected={props.selected}
            onclick={() => props.onselect()}
        >
            <img height="1em" width="1em" src={src} alt="" />

            <span>{props.name}</span>
            <Show when={!props.isSave}>●</Show>
            <div
                onclick={(e) => {
                    e.cancelBubble = true;
                    props.onclose();
                }}
                innerHTML={Close}
            >
            </div>
        </div>
    );
};
