// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"epB2":[function(require,module,exports) {
// 新增一个网站只需要提供一个网址，怎么让用户输入网址呢？
// 只需要弹一个框，也就是监听div的点击事件，用jQuery来监听
// 搜索bootcdn 引入jQuery
// 测试jQuery是否被引入 console.log(jQuery)

var $siteList = $('.siteList');
var $lastLi = $siteList.find('li.lastLi');
var x = localStorage.getItem('x');
var xObject = JSON.parse(x); //把字符串变对象
var hashMap = xObject || [{ logo: 'A', url: 'https://www.acfun.cn' }, { logo: 'B', url: 'https://www.bilibili.com' }];
var simplifyUrl = function simplifyUrl(url) {
  return url.replace('https://', '').replace('http://', '').replace('www.', '').replace(/\/.*/, ''); //删除/开头的内容知道结尾
};
var render = function render() {
  $siteList.find('li:not(.lastLi)').remove(); //hashMap重新渲染时，会多出两个li
  hashMap.forEach(function (node, index) {
    var $li = $('\n        <li>\n          <div class="site">\n            <div class="logo">\n              ' + node.logo[0] + '\n            </div>\n            <div class="link">' + simplifyUrl(node.url) + '</div>\n            <div class="close">\n              <svg class="icon">\n                <use xlink:href="#icon-close_light"></use>\n              </svg>  \n            </div>\n          </div>           \n        </li>').insertBefore($lastLi);
    //阻止点击x会冒泡
    $li.on('click', function (e) {
      window.open(node.url);
    });
    $li.on('click', '.close', function (e) {
      e.stopPropagation();
      hashMap.splice(index, 1);
      render();
    });
  });
};
render();
/*
<li>
          <a href="https://www.acfun.cn">
            <div class="site">
              <div class="logo">A</div>
              <div class="link">acfun.cn</div>
            </div>
          </a>
        </li>
        <li>
          <a href="https://www.bilibili.com/">
            <div class="site">
              <div class="logo">
                <img src="../images/bilibili.jpeg" alt="" />
              </div>
              <div class="link">bilibili.com</div>
            </div>
          </a>
        </li>
*/
$('.addButton').on('click', function () {
  var url = window.prompt('请问你要添加的网址是啥');
  //需要判断一下用户输入的网址是不是以http开头  url就是用户输入的网址
  if (url.indexOf('http') !== 0) {
    // alert('请输入http开头的网址')
    url = 'https://' + url;
  }
  console.log(url);
  hashMap.push({
    logo: simplifyUrl(url)[0].toUpperCase(),
    url: url });
  render();
});
// 当用户退出网站之前触发什么
window.onbeforeunload = function () {
  console.log('页面要关闭了');
  //把一个对象变成字符串
  var string = JSON.stringify(hashMap);
  localStorage.setItem('x', string); //意思时在本地存储里设置一个x，它的值就是string
};

// 监听键盘
// document.addEventListener()
$(document).on('keypress', function (e) {
  // 按的键盘键：e.key,但注意是小写
  // const key = e.key 也就是
  var key = e.key;

  for (var i = 0; i < hashMap.length; i++) {
    if (hashMap[i].logo.toLowerCase() === key) {
      window.open(hashMap[i].url);
    }
  }
});
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.805d4a58.map