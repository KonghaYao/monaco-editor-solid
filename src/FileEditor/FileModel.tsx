import { loadLanguage } from "@codingame/monaco-editor-wrapper";
import { editor } from "@codingame/monaco-editor";
import { monaco } from "@codingame/monaco-editor-wrapper";
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
        await loadLanguage(language);

        monaco.editor.setModelLanguage(this.model, language);
        console.log("语言更换为 " + language);
    }
}
