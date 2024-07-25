// script.js
document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('buttons-container');
  const loadDataButton = document.getElementById('load-data');
  const rowSelector = document.getElementById('row-selector');

  // 設定Apps Script網頁應用程式的基本URL
  const URL1 = '您的Apps Script網頁應用程式URL';

  // 初始化按鈕和對應的變數值
  for (let i = 0; i < 30; i++) {
    const button = document.createElement('button');
    button.textContent = `編號${i + 1} 按鈕變數0`;
    button.dataset.value = 0; // 使用dataset來儲存每個按鈕的變數值
    button.addEventListener('click', function() {
      let value = parseInt(button.dataset.value, 10);
      value = (value + 1) % 6; // 變數值+1，大於5時重置為0
      button.dataset.value = value;
      button.textContent = `編號${i + 1} 按鈕變數${value}`;
    });
    container.appendChild(button);
  }

  // 載入數據按鈕的事件處理器
  loadDataButton.addEventListener('click', function() {
    const selectedRow = rowSelector.value;
    // 根據下拉選單的值動態生成URL2
    const URL2 = `?row=${selectedRow}`;
    // 組合URL
    const URL = URL1 + URL2;

    fetch(URL)
      .then(response => response.json())
      .then(data => {
        data[0].forEach((value, index) => {
          if (index < 30) { // 確保只處理前30個數據
            const button = container.children[index];
            button.dataset.value = value;
            button.textContent = `編號${index + 1} 按鈕變數${value}`;
          }
        });
      })
      .catch(error => console.error('Error:', error));
  });
});