```
    {
        module: {
            rules: [
                {
                    test: /\.(woff2?|ttf|svg|eot)$/,
                    exclude: [path.resolve(p.src, 'components/svg-icon')],
                    loader: 'file-loader',
                },
                {
                    test: /\.svg$/,
                    include: [path.resolve(p.src, 'components/svg-icon')],
                    use: [
                        {loader: 'svg-sprite-loader', options: {}},
                        {
                            loader: 'svgo-loader',
                            options: {
                                plugins: [{
                                    name: 'removeAttrs',
                                    params: {
                                        attrs: '(fill|stroke)',
                                    },
                                }],
                            },
                        },
                    ],
                },
            ]
        }
    }
```