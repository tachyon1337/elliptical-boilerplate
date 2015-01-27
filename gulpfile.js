/**
 * Created by admin on 1/15/15.
 */

var gulp=require('gulp'),
    http = require('http'),
    ecstatic = require('elliptical-ecstatic'),
    tasks=require('elliptical-gulp'),
    config=require('./config.json');


gulp.task('default',function(){
    console.log('welcome to elliptical html project');
});

gulp.task('start',function(){

    //start server
    startServer({
        port:config.port,
        path:config.path
    });

    tasks.scripts({
        src:config.src,
        dest:config.dest
    })


});

function startServer(opts){
    var path=__dirname + opts.path;
    console.log(path);
    http.createServer(
        ecstatic({ root: path })
    ).listen(opts.port);
}
