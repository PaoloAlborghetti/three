import resolve from '@rollup/plugin-node-resolve';

export default{
    input: 'model-viewer.js',
    output: [
        {
            format:'cjs',
            file: 'model-viewer-bundle.js',
        }
    ],
    plugins:[
        resolve()
    ]
}