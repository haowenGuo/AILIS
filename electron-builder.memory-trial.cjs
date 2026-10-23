// Side-by-side personal trial; never publish this as a regular AILIS update.
module.exports = {
    extends: './electron-builder.yml',
    appId: 'com.ailis.desktop.memorytrial',
    productName: 'AILIS Memory Trial',
    artifactName: 'AILIS-Memory-Trial-${version}-${arch}.${ext}',
    directories: { output: 'release-memory-trial' },
    extraMetadata: { ailisHierarchicalMemoryTrial: true },
    win: { executableName: 'AILIS Memory Trial', target: [{ target: 'nsis', arch: ['x64'] }] },
    nsis: {
        artifactName: 'AILIS-Memory-Trial-Setup-${version}-win-${arch}.${ext}',
        shortcutName: 'AILIS Memory Trial',
        uninstallDisplayName: 'AILIS Memory Trial',
        deleteAppDataOnUninstall: false
    }
};
