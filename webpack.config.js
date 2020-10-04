const base = require('@zefiros/npm-defaults/webpack.library')({
    root: __dirname,
})
const nodeExternals = require('webpack-node-externals')

const path = require('path')
const fs = require('fs')

module.exports = {
    ...base,

    resolve: {
        ...base.resolve,
        alias: {
            'readable-stream': path.join(__dirname, 'src', 'readable-stream.ts'),
            lie: path.join(__dirname, 'src', 'lie.ts'),
        },
    },
    externals: [
        nodeExternals({
            modulesFromFile: {
                exclude: ['devDependencies'],
                include: ['dependencies'],
            },
        }),
    ],
    plugins: [
        ...(base.plugins || []),
        {
            /** @param {import('webpack').Compiler} compiler */
            apply(compiler) {
                compiler.hooks.compilation.tap('copy-plugin', (compilation) => {
                    compilation.hooks.processAssets.tap(
                        {
                            name: 'copy-plugin',
                            stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
                        },
                        (assets) => {
                            const hoistFiles = [
                                {
                                    from: path.join(__dirname, 'node_modules', 'jszip', 'index.d.ts'),
                                    to: 'jszip.d.ts',
                                    /** @param {string} contents */
                                    replacer: (contents) => contents.replace(/blob:\s*Blob/g, 'blob: Buffer'),
                                },
                            ]
                            for (const { replacer, from, to } of hoistFiles) {
                                assets[to] = {
                                    source: () => {
                                        const contents = fs.readFileSync(from, 'utf-8')
                                        if (replacer !== undefined) {
                                            return replacer(contents)
                                        }
                                        return contents
                                    },
                                }
                            }
                        }
                    )
                })
            },
        },
    ],
}
