// 这个文件存在的意义是 vite 不支持在 index.html 中直接使用虚拟文件作为入口（下面是错误记录），所以只能创建这个文件，实际上这个文件被加载时会被内部生成的代码覆盖
// 可能有关的 issue 号：https://github.com/vitejs/vite/issues/9662
// [vite]: Rollup failed to resolve import "@virtual:index" from "/home/yinxulai/github/home-work/packages/yinxulai.com/index.html".
// This is most likely unintended because it can break your application at runtime.
// If you do want to externalize this module explicitly add it to
// `build.rollupOptions.external`
// error during build:
// Error: [vite]: Rollup failed to resolve import "@virtual:index" from "/home/yinxulai/github/home-work/packages/yinxulai.com/index.html".
// This is most likely unintended because it can break your application at runtime.
// If you do want to externalize this module explicitly add it to
// `build.rollupOptions.external`
//     at viteWarn (file:///home/yinxulai/github/home-work/node_modules/vite/dist/node/chunks/dep-e8f070e8.js:46597:23)
//     at onRollupWarning (file:///home/yinxulai/github/home-work/node_modules/vite/dist/node/chunks/dep-e8f070e8.js:46621:9)
//     at onwarn (file:///home/yinxulai/github/home-work/node_modules/vite/dist/node/chunks/dep-e8f070e8.js:46368:13)
//     at Object.onwarn (file:///home/yinxulai/github/home-work/node_modules/rollup/dist/es/shared/node-entry.js:25346:13)
//     at ModuleLoader.handleInvalidResolvedId (file:///home/yinxulai/github/home-work/node_modules/rollup/dist/es/shared/node-entry.js:23981:26)
//     at file:///home/yinxulai/github/home-work/node_modules/rollup/dist/es/shared/node-entry.js:23941:26
