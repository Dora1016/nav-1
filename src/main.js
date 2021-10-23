// 新增一个网站只需要提供一个网址，怎么让用户输入网址呢？
// 只需要弹一个框，也就是监听div的点击事件，用jQuery来监听
// 搜索bootcdn 引入jQuery
// 测试jQuery是否被引入 console.log(jQuery)

const $siteList = $('.siteList')
const $lastLi = $siteList.find('li.lastLi')
const x = localStorage.getItem('x')
const xObject = JSON.parse(x)  //把字符串变对象
const hashMap = xObject || [
    {logo:'A', url:'https://www.acfun.cn'},
    {logo:'B',  url:'https://www.bilibili.com'},
]
const simplifyUrl = (url)=>{
  return url.replace('https://', '')
            .replace('http://', '')
            .replace('www.', '')
            .replace(/\/.*/, '')  //删除/开头的内容知道结尾

}
const render = ()=>{
    $siteList.find('li:not(.lastLi)').remove() //hashMap重新渲染时，会多出两个li
    hashMap.forEach((node, index)=>{
      const $li= $(`
        <li>
          <div class="site">
            <div class="logo">
              ${node.logo[0]}
            </div>
            <div class="link">${simplifyUrl(node.url)}</div>
            <div class="close">
              <svg class="icon">
                <use xlink:href="#icon-close_light"></use>
              </svg>  
            </div>
          </div>           
        </li>`).insertBefore($lastLi)
            //阻止点击x会冒泡
            $li.on('click', (e)=>{
              window.open(node.url)
            })
            $li.on('click', '.close', (e)=>{
              e.stopPropagation()
              hashMap.splice(index,1)
              render()
            })
    })
}
render()
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
$('.addButton')
  .on('click', ()=>{
     let url = window.prompt('请问你要添加的网址是啥') 
     //需要判断一下用户输入的网址是不是以http开头  url就是用户输入的网址
     if(url.indexOf('http') !== 0){
         // alert('请输入http开头的网址')
         url = 'https://' + url
     }
     console.log(url)
     hashMap.push({
        logo:simplifyUrl(url)[0].toUpperCase(),
        url: url}
     )     
     render()  
})
// 当用户退出网站之前触发什么
window.onbeforeunload = ()=>{
    console.log('页面要关闭了')
    //把一个对象变成字符串
    const string = JSON.stringify(hashMap)
    localStorage.setItem('x', string)  //意思时在本地存储里设置一个x，它的值就是string
}

// 监听键盘
// document.addEventListener()
$(document).on('keypress', (e)=>{
  // 按的键盘键：e.key,但注意是小写
  // const key = e.key 也就是
  const {key} = e
  for(let i=0; i<hashMap.length; i++){
    if(hashMap[i].logo.toLowerCase() === key){
      window.open(hashMap[i].url)
    }
  }
})