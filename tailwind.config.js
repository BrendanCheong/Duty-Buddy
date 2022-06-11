module.exports = {
    content: ['./screens/**/*.tsx', './components/**/*.tsx', './navigation/**/*.tsx'],
    theme: {
        fontFamily: {
            sans: ['Ubuntu', 'sans-serif'],
            display: ['Ubuntu', 'sans-serif'],
            body: ['Ubuntu', 'sans-serif']
        },
        extend: {}
    },
    plugins: [],
    corePlugins: require('tailwind-rn/unsupported-core-plugins')
};
