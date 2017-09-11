# gulp-project
通过gulp构建纯html、css、js工程，并对测试版本和发行版本进行优化处理控制，开发过程中环境依赖有nodejs、npm等
# 目录结构
* > src ----根目录
  * > controller ----每个页面对应的js类
  * > holder ----页面中部分功能的封装
  * > http ----网络请求-未用
  * > images ----项目图标素材
  * > lib ----第三方js
  * > mp3 ----项目中用到的消息通知音频
  * > styles ----每个界面样式和公共样式
  * > utils ----js工具类
  * > view ----html
  * > widget ----封装的控件，如吐司，alert，confirm，snackbar等
  
  注：以上目录结构可根据自己实际需求进行删减，并对gulpfile.js进行对应的修改

# 工程优势
* > 目录结构清晰
* > 集成browser-sync，支持同步刷新，即修改完代码后浏览器自动刷新，无需手动刷新
* > 支持调试模式和非调试模式
  * > 调试模式下不做任何修改，直接同步刷新源代码，不用重新启动服务。
  * > 非调试模式（发行版本）
    1. html压缩，去掉不必要属性，可将html压缩为一行，减少文件大小。
    2. img引用图片，将一定大小的图片如30k以下（可自己指定大小）文件进行base64编码替换到img:src属性，从而减少http请求，提升加载速度。
    3. css压缩处理，并去掉部分无用样式，只保留一行。
    4. 将css中设置的背景，如background:url(xxx)中的xxx文件进行base64编码处理替换到url中，从而减少http请求，提升加载速度。
    5. 压缩混淆js为一行，减小文件大小。
    6. 压缩资源图片，减小图片大小
    7. 可自定义是否将 css、js内容直接引入到html中，减少http请求，需在<style></style> <script></script>中加入inline，如<style inline></style>,如不注明inline，则不会将当前css或者js引入到html中
    
# 使用方式
* > 确保安装并配置好了nodejs
* > 终端进入工程目录，执行npm install
* > 终端进入工程目录，输入:gulp default true/false，或者简写为:gulp true/false
* > webstorm中的使用方式，将gulp添加到快速运行，然后修改Gulpfile为:xxxx/xxxx/gulpfile.js文件，Tasks:default,Arguments:--a false/true,Node interpreter:xxxx/xxxx/xxxx/node.exe,Gulp package为工程目录下的/node_modules/gulp
