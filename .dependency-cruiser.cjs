module.exports = {
    forbidden: [{ name: 'product-must-not-import-test-or-evaluation', severity: 'error',
        from: { path: '^(electron|src)/', pathNot: 'electron/ailis-humanlike-eval\\.cjs$' },
        to: { path: '^(tests|Test|evals|manual-tests)/|^scripts/(run-.*-eval|benchmark-|smoke-)' } }],
    options: { doNotFollow: { path: 'node_modules' }, exclude: 'node_modules',
        enhancedResolveOptions: { exportsFields: ['exports'], conditionNames: ['import', 'require', 'node', 'default'] } }
};
