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

  return {
      init: function () {
        getData();
        bindHTML();
      }
  }
})();
productRender.init();