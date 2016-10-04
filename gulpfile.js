var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");

gulp.task("build", function () {
    var bundle = browserify({
        basedir: '.',
        debug: true,
        entries: ['./examples-main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .on('error',function(e){
        console.log(e);
        this.emit("end");
    });

    bundle
    .pipe(source('bundle.js'))
    .pipe(gulp.dest("dist"))
});

gulp.task('watch',["build"], function(){
    gulp.watch('src/**/*.ts', ['build'])
});

gulp.task('default', ['watch']);
