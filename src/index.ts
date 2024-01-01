export * from '@codingame/monaco-editor-wrapper'
import "@codingame/monaco-editor-wrapper/features/jsonContribution"
import "@codingame/monaco-editor-wrapper/features/htmlContribution"
import "@codingame/monaco-editor-wrapper/features/typescriptContribution"
import "@codingame/monaco-editor-wrapper/features/cssContribution"
import "@codingame/monaco-editor-wrapper/features/extensionConfigurations"
export { AllThemes } from "./Theme/AllThemes";
export { applyTheme } from "./Theme/initTheme";
export { getMonaco } from "./getMonaco/getMonaco";

export { FileEditorList } from "./FileEditorList";
export type { Expose } from "./FileEditorList";
