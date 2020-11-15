// 基于高级单例模式进行义务逻辑开发
let productRender = (function () {
  // 自执行函数形成的私有作用域不销毁（闭包）

  // 定义公共的变量，供各个模块存取
  let productData = null,
      // querySelector方法获取的集合是静态集合，无DOM映射机制
      productBox = document.querySelector('.productBox'),
      headerBox = document.querySelector('.headerBox'),
      linkList = headerBox.querySelectorAll('a'),
      productList = null;
  // 基于AJAX从服务器端获取数据
  let getData = function () {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'json/product.json', false);
    xhr.onreadystatechange = function () {
      xhr.readyState === 4 && xhr.status === 200
        ? productData = JSON.parse(xhr.responseText)
        : null;
    };
    xhr.send(null);
  };

  // 完成数据的绑定
  let bindHTML = function () {
    let str = ``;
    productData.forEach(({title, price, hot, time, img}, index) => {
      str += `<li data-time="${time}"
                  data-hot="${hot}"
                  data-price="${price}"
              ><a href="#">
                <img src="${img}" alt="">
                <p title="${title}">${title}</p>
                <span>￥${price}</span>
                <span>时间：${time}</span>
                <span>热度：${hot}</span>
            </a></li>`;
    })
    productBox.innerHTML = str;
    productList = productBox.querySelectorAll('li');
  };

  // 给三个排序标签绑定点击事件
  let bindClick = function () {
    [].forEach.call(linkList, (curLink, index) => {
      // 循环三次，执行三次这个方法，每一次执行都会形成一个闭包，每一个闭包中保存了当前这个A对应的索引index
      curLink.flag = -1;
      curLink.onclick = function () {
        //1.给PRODUCT-LIST进行排序(依据点击列的不同进行排序)
        // 点击的需要获取每一个LI的价格、热度等信息,此时我们可以在绑定的时候，把这些信息存储到自定义属性上，点击的时候根据自定义属性获取即可
        this.flag *= -1;
        // 根据点击LI的索引获取按照谁来排序
        let aType = ['data-time', 'data-price', 'data-hot'];
        productList = [].slice.call(productList);
        productList.sort((a, b) => {
          let curA = a.getAttribute(aType[index])
            , curB = b.getAttribute(aType[index]);
          if (index === 0) {
            // 对于日期来说,我们需要去除字符串之间的中杠，才能实现数学相减
            curA = curA.replace(/-/g, '');
            curB = curB.replace(/-/g, '');
          }
          return (curA - curB) * this.flag;
        });
        //2.按照最新顺序依次添加到容器中
        /*productList.forEach((item) => {
          // 每一次都改变了原有的DOM结构，引发浏览器的回流
          productBox.appendChild(item);
        });*/
        // 基于文档碎片减少DOM回流
        let frg = document.createDocumentFragment();
        productList.forEach(curLi => {
          frg.appendChild(curLi);
        });
        productBox.appendChild(frg);
        frg = null;
      };
    })
  };

  return {
      init: function () {
        getData();
        bindHTML();
        bindClick();
      }
  }
})();
productRender.init();