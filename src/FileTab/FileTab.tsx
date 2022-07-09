import { Component } from "solid-js";
import { getIconForFile } from "vscode-icons-js";
import { Close } from "../utils/Icon";
import style from "./FileTabs.module.less";
export const FileTab: Component<{
    name: string;
    path: string;
    selected: boolean;
    onselect: Function;
    onclose: Function;
}> = (props) => {
    const src =
        "https://cdn.jsdelivr.net/gh/vscode-icons/vscode-icons/icons/" +
        getIconForFile(props.name);
    return (
        <div
            class={style.file_tab}
            data-selected={props.selected}
            onclick={() => props.onselect()}
        >
            <img height="1em" width="1em" src={src} alt="" />

            <span>{props.name}</span>
            <div
                onclick={(e) => {
                    e.cancelBubble = true;
                    props.onclose();
                }}
            >
                {Close()}
            </div>
        </div>
    );
};
