module.exports = {
    default: {
        requireModule: ['ts-node/register'],
        require: ['src/test/steps/*.ts', 'src/test/hooks/*.ts', 'src/test/support/*.ts'],
        paths: ['src/test/features/*.feature'],
        format: [
            'summary',
            'progress-bar',
            'html:src/test-results/reports/report.html'
        ],
        formatOptions: { snippetInterface: 'async-await' },
        publishQuiet: true
    }
};