/**
 * @author い 狂奔的蜗牛
 * @date 2016/10/29
 * @description  js压缩混淆  css压缩 图片压缩  及时更新等
 * @version 1.0
 */
'use strict';
// 在gulpfile中先载入gulp包，因为这个包提供了一些API
var gulp = require('gulp');
// css压缩true
// var cssnano = require('gulp-cssnano'); //z-index存在会被还原为1的问题
var cleanCSS = require('gulp-clean-css');
//复制文件
var changed = require('gulp-changed');

//文件名加根据文件生成的md5值 防止缓存 已废弃
// const rev = require('gulp-rev');
//html中引用时对应
// var collector = require('gulp-rev-collector');

// 判断是否为debug模式
var gulpif = require('gulp-if');
//图片压缩
var imagemin = require('gulp-imagemin');

//标识是否为调试模式  debug === true 不会优化 false才会进行优化  minimist为一传参数插件 通过传入的参数判断是不是debug模式
var argv = require('minimist')(process.argv.slice(2));
var isDebug = argv.a === "false" ? false : true;

// 1.  css样式 压缩 --合并没有必要
// 将css中设置的背景等url指向的图片进行base64编码 替换url 减少http请求 以达到优化加载速度的目的
var base64 = require('gulp-base64');
gulp.task('style', function () {
    // 这里是在执行style任务时自动执行的
    return gulp.src(['src/styles/*.css', '!src/styles/_*.css'])
        .pipe(gulpif(!isDebug, base64({
            maxImageSize: 30720//30k
        })))
        .pipe(gulpif(!isDebug, cleanCSS()))
        .pipe(gulp.dest('dist/styles'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// 1.1. 控件中的css压缩
gulp.task('widgetStyle', function () {
    // 这里是在执行style任务时自动执行的
    return gulp.src(['src/widget/*/*.css', '!src/widget/*/_*.css'])
        .pipe(gulpif(!isDebug, base64({
            maxImageSize: 30720//30k
        })))
        .pipe(gulpif(!isDebug, cleanCSS()))
        .pipe(gulp.dest('dist/widget'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// 1.2 holder中的样式
gulp.task('holderStyles', function () {
    // 这里是在执行style任务时自动执行的
    return gulp.src(['src/holder/*.css', '!src/holder/_*.css'])
        .pipe(gulpif(!isDebug, base64({
            maxImageSize: 30720//30k
        })))
        .pipe(gulpif(!isDebug, cleanCSS()))
        .pipe(gulp.dest('dist/holder'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// 2. 控制器JS 压缩混淆
var uglify = require('gulp-uglify');
gulp.task('js', function () {
    return gulp.src('src/controller/*.js')
        .pipe(gulpif(!isDebug, uglify()))
        .pipe(gulp.dest('dist/controller'))
        .pipe(browserSync.reload({
            stream: true
        }));
});
// 2.1 holder 压缩混淆
gulp.task('holder', function () {
    return gulp.src('src/holder/*.js')
        .pipe(gulpif(!isDebug, uglify()))
        .pipe(gulp.dest('dist/holder'))
        .pipe(browserSync.reload({
            stream: true
        }));
});
// 2. 2 httpJS 压缩混淆
gulp.task('http', function () {
    return gulp.src('src/http/*.js')
        .pipe(gulpif(!isDebug, uglify()))
        .pipe(gulp.dest('dist/http'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// 2. 2 工具类JS 压缩混淆
gulp.task('utils', function () {
    return gulp.src('src/utils/*.js')
        .pipe(gulpif(!isDebug, uglify()))
        .pipe(gulp.dest('dist/utils'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// 2. 3 控件类JS 压缩混淆
gulp.task('widgetJS', function () {
    return gulp.src('src/widget/*/*.js')
        .pipe(gulpif(!isDebug, uglify()))
        .pipe(gulp.dest('dist/widget'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// 2. 3 复制第三方js
gulp.task('lib', function () {
    return gulp.src('src/lib/*/*.js')
        .pipe(changed('dist/lib'))
        .pipe(gulp.dest('dist/lib'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// 3. 图片复制 压缩
gulp.task('image', function () {
    return gulp.src('src/images/*.*')
        .pipe(changed('dist/images'))
        .pipe(gulpif(!isDebug, imagemin()))
        .pipe(gulp.dest('dist/images'))
        .pipe(browserSync.reload({
            stream: true
        }));
});
// 3. 1 表情复制 压缩
gulp.task('imageFaces', function () {
    return gulp.src('src/images/faces/*.*')
        .pipe(gulpif(!isDebug, imagemin()))
        .pipe(gulp.dest('dist/images/faces'))
        .pipe(browserSync.reload({
            stream: true
        }));
});
// 3. 2 mp3复制 音频
gulp.task('mp3', function () {
    return gulp.src('src/mp3/*.*')
        .pipe(gulp.dest('dist/mp3'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

var rename = require('gulp-rename');
// 3. 2  控件图片复制
gulp.task('widgetImage', function () {
    return gulp.src('src/widget/*/images/*.*')
        .pipe(changed('dist/widget'))
        .pipe(gulpif(!isDebug, rename({dirname: 'images'})))//非调试模式下 才重命名
        .pipe(gulpif(!isDebug, imagemin()))
        .pipe(gulpif(isDebug, gulp.dest('dist/widget')))
        .pipe(gulpif(!isDebug, gulp.dest('dist/view/')))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// html压缩 去掉换行等演示
var htmlmin = require('gulp-htmlmin');
// 将 css 和 js内联到html 需要在script 或者 style标签上注明 inline 否者忽略
var inlinesource = require('gulp-inline-source');
//img 将src指定的小图片替换成图片的base64编码
var img64 = require('gulp-img64-2');
// 4. HTML
gulp.task('html', function () {
    var options = {
        compress: false
    };
    return gulp.src(
        'src/view/*.html')
        .pipe(gulpif(!isDebug, inlinesource(options)))
        .pipe(gulpif(!isDebug, img64({
            maxWeightResource: 30720//30k
        })))
        .pipe(gulpif(!isDebug, htmlmin({//配置压缩html规则
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            minifyJS: true,
            minifyCSS: true
        })))
        .pipe(changed('dist/view'))
        .pipe(gulp.dest('dist/view'))
        .pipe(browserSync.reload({
            stream: true
        }));
});
//删除文件夹
var del = require('del');
gulp.task('clean', function () {
    return del('dist/*');
});
//执行完成之后删除无用文件夹 与gulp-inline-source 配合使用
gulp.task('del', function () {
    return del(['dist/controller', 'dist/holder', 'dist/utils', 'dist/widget']);
});

//浏览器同步刷新
var browserSync = require('browser-sync');
var gulpSequence = require('gulp-sequence').use(gulp);
gulp.task('serve', function () {
    browserSync({
        server: {
            baseDir: ['dist'],
            index: "view/index.html"
        }
    }, function (err, bs) {
        console.log(bs.options.getIn(["urls", "local"]));
    });
    //监视css改变
    gulp.watch('src/styles/*.css', ['style']);
    // 监视控件css改变后 执行
    gulp.watch('src/widget/*/*.css', ['widgetStyle']);
    //监听holder中的css 干煸
    gulp.watch('src/holder/*.css', ['holderStyles']);
    //监视控制器改变
    gulp.watch('src/controller/*.js', ['js']);
    //holder内文件改变
    gulp.watch('src/holder/*.js', ['holder']);
    //网络请求文件改变
    gulp.watch('src/http/*.js', ['js']);
    //监视工具累改变
    gulp.watch('src/utils/*.js', ['utils']);
    //监视控件js改变
    gulp.watch('src/widget/*/*.js', ['widgetJS']);
    //复制第三方js
    gulp.watch('src/lib/*/*.js', ['lib']);
    //监视图片文件改变
    gulp.watch('src/images/*.*', ['image']);
    //监视表情文件夹变化
    gulp.watch('src/images/faces/*.gif', ['imageFaces']);
    //音频资源文件
    gulp.watch('src/mp3/*.*', ['mp3']);
    //控件依赖的图片改变
    gulp.watch('src/widget/*/images/*.*', ['widgetImage']);
    //监视视图改变
    gulp.watch('src/view/*.html', ['html']);
});


gulp.task('build_other', gulpSequence(['image', 'imageFaces', 'widgetImage', "mp3"], ['style', "holderStyles", 'widgetStyle'], ['lib', 'js', "holder", "http", 'utils', 'widgetJS']));

//清理 编译 运行
gulp.task('build', gulpSequence("clean", ["build_other"], "html"));
//  根据isDebug判断是不是主要进行优化处理
if (isDebug) {// 不处理
    gulp.task('default', gulpSequence("clean", ["build_other"], "html", "serve"))
} else {
    gulp.task('default', gulpSequence("clean", ["build_other"], "html", "serve", "del"))
}
