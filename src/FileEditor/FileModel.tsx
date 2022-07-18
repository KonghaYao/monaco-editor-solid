import { wrapper } from "../getMonaco/loadMonaco";
import { editor } from "@codingame/monaco-editor";

/* 保存单个文件 Monaco Model 的类 */
export class FileModel {
    path!: string;
    model!: editor.ITextModel;
    async init(path: string, code: string, language?: string) {
        this.path = path;

        this.model = monaco.editor.createModel(
            code,
            language,
            monaco.Uri.file(path)
        );
    }
    destroy() {
        this.model.dispose();
    }
    async changeLanguage(language: string) {
        await wrapper.loadLanguage(language);

        monaco.editor.setModelLanguage(this.model, language);
        console.log("语言更换为 " + language);
    }
}
