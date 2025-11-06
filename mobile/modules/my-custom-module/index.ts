// Reexport the native module. On web, it will be resolved to MyCustomModule.web.ts
// and on native platforms to MyCustomModule.ts
export { default } from './src/MyCustomModule';
export { default as MyCustomModuleView } from './src/MyCustomModuleView';
export * from  './src/MyCustomModule.types';
