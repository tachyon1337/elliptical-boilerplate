

var gulp=require('gulp'),
    http = require('http'),
    ecstatic = require('elliptical-ecstatic'),
    tasks=require('elliptical-gulp'),
    sass = require('gulp-sass'),
    liveServer = require("live-server"),
    watch=require('gulp-watch'),
    config=require('./config.json');


gulp.task('default',function(){
    console.log('welcome to elliptical html project');
});

gulp.task('start-live',function(){

    //start server
    startLiveServer({
        port:config.livePort,
        path:config.path,
        host:config.liveHost
    });

    tasks.scripts({
        src:config.src,
        dest:config.dest,
        destFile:config.destFile
    });

    var src='./sass/**/*.scss';
    watch(src,function(files){
        compileSass();
    });

});

gulp.task('start',function(){

    //start server
    var path=config.path;
    path=path.replace('.','');
    startEcstaticServer({
        port:config.port,
        path:path
    });

    tasks.scripts({
        src:config.src,
        dest:config.dest,
        destFile:config.destFile
    });

    var src='./sass/**/*.scss';
    watch(src,function(files){
        compileSass();
    });
});

gulp.task('sass', function () {
    compileSass(config.path);
});


gulp.task('sass-watch', function () {
    var src = './sass/**/*.scss';
    watch(src, function (files) {
        compileSass();
    });
});


gulp.task('build', function () {
    copyScripts();
});


gulp.task('compile',function(){
    var opts={
        src:['templates/**/*.html'],
        fragmentsSrc:['templates/**/*.html'],
        dest:'public/scripts'
    };
    console.log('compiling templates...');
    tasks.compileTemplates(opts);
});


function startLiveServer(opts){
    var params={
        port:opts.port,
        host:opts.host,
        root:opts.path,
        noBrowser:true
    };
    liveServer.start(params);
}

function startEcstaticServer(opts){
    var path=__dirname + opts.path;
    console.log(path);
    http.createServer(
        ecstatic({ root: path })
    ).listen(opts.port);
}

function compileSass(){
    gulp.src('./app.scss')
        .pipe(sass())
        .pipe(gulp.dest(config.path + '/css'));
}

function copyScripts(){
    gulp.src('node_modules/elliptical-bundle/*.js')
        .pipe(gulp.dest(config.path + '/scripts/'));
}
