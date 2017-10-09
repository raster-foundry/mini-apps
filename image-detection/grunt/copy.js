module.exports = {
    dist: {
        files: [
            {
                expand: true,
                cwd: 'app',
                src: '*.html',
                dest: 'dist/'
            },
            {
                expand: true,
                cwd: 'app/assets/css',
                src: '*',
                dest: 'dist/assets/css/'
            },
            {
                expand: true,
                cwd: 'app/assets/js',
                src: '*',
                dest: 'dist/assets/js/'
            },
            {
                expand: true,
                cwd: 'app/assets/js/data/projects',
                src: '*',
                dest: 'dist/assets/js/data/projects/'
            },
            {
                expand: true,
                cwd: 'app/assets/js/data/predictions',
                src: '*',
                dest: 'dist/assets/js/data/predictions/'
            },
            {
                expand: true,
                cwd: 'app/assets/js/data/',
                src: '*',
                dest: 'dist/assets/js/data/'
            },
            {
                expand: true,
                cwd: 'app/assets/js/images',
                src: '*',
                dest: 'dist/assets/js/images/'
            },
            {
                expand: true,
                cwd: 'app/assets/js/vendor',
                src: '*',
                dest: 'dist/assets/js/vendor/'
            },
            {
                expand: true,
                cwd: 'app/assets/fonts',
                src: '**',
                dest: 'dist/assets/fonts/'
            },
            {
                expand: true,
                cwd: 'app/assets/images',
                src: '**',
                dest: 'dist/assets/images/'
            }
        ]
    }
};
