// script.js
document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('buttons-container');
  const loadDataButton = document.getElementById('load-data');
  const rowSelector = document.getElementById('row-selector');
  const toggleUpdateButton = document.getElementById('toggle-update');
  let isUpdateEnabled = false; // 追蹤即時更新狀態

  // 切換即時更新狀態
  toggleUpdateButton.addEventListener('click', function() {
    isUpdateEnabled = !isUpdateEnabled;
    toggleUpdateButton.textContent = `即時更新: ${isUpdateEnabled ? '開啟' : '關閉'}`;
  });

  // 設定Apps Script網頁應用程式的基本URL
  const URL1 = 'https://script.google.com/macros/s/AKfycbyppQc68QzzSExSsyAV6l5d1rgUSJxAcYnWEljonF-nCgrpFVaKsK9_wUZuY8OjNu4/exec';

  // 初始化按鈕和對應的變數值
  for (let i = 0; i < 30; i++) {
    const button = document.createElement('button');
    button.innerHTML = `<img src="images/0.png" alt=""><span>${i + 1} (${0})</span>`;
    button.dataset.value = 0;
    button.addEventListener('click', function() {
      let value = parseInt(button.dataset.value, 10);
      value = (value + 1) % 6;
      button.dataset.value = value;
      button.innerHTML = `<img src="images/${value}.png" alt=""><span>${i + 1} (${value})</span>`;

      // 如果即時更新狀態為開啟，則將變數值寫入試算表
      if (isUpdateEnabled) {
        const selectedRow = rowSelector.value;
        const column = i + 1; // 按鈕編號對應的欄(column)
        const updateURL = `${URL1}?action=update&row=${selectedRow}&column=${column}&value=${value}`;
        fetch(updateURL)
          .then(response => response.json())
          .then(data => console.log('Update response:', data))
          .catch(error => console.error('Error:', error));
      }
    });
    container.appendChild(button);
  }

  loadDataButton.addEventListener('click', function() {
	if (confirm('確定要載入暫存數據嗎？')) {
      // 執行載入數據的操作
 	        console.log('載入暫存數據...');    
	const selectedRow = rowSelector.value;
    // 根據下拉選單的值動態生成URL2
    const URL2 = `?action=readData&row=${selectedRow}`;
    // 組合URL
    const URL = URL1 + URL2;

    fetch(URL)
      .then(response => response.json())
      .then(data => {
        data[0].forEach((value, index) => {
          if (index < 30) { // 確保只處理前30個數據
            const button = container.children[index];
            button.dataset.value = value;
            //button.textContent = `編號${index + 1} 按鈕變數${value}`;
			button.innerHTML = `<img src="images/${value}.png" alt=""><span>${index + 1} (${value})</span>`;
          }
        });
      })
      .catch(error => console.error('Error:', error));
	}  
  });
  
  const batchUploadButton = document.getElementById('batch-upload');
  // 批次上傳按鈕的事件處理器
  batchUploadButton.addEventListener('click', function() {
    if (confirm('確定要批次上傳暫存數據嗎？')) {
      // 執行載入數據的操作
 	        console.log('批次上傳暫存數據...');
	const selectedRow = rowSelector.value;
    const updates = [];

    // 遍歷所有按鈕，準備批次上傳的數據
    for (let i = 0; i < 30; i++) {
      const button = container.children[i];
      const value = button.dataset.value;
      const column = i + 1; // 按鈕編號對應的欄(column)
      updates.push({row: selectedRow, column: column, value: value});
    }

    // 將批次上傳的數據發送到Apps Script
    const batchUpdateURL = `${URL1}?action=batchUpdate&updates=${encodeURIComponent(JSON.stringify(updates))}`;
    fetch(batchUpdateURL)
      .then(response => response.json())
      .then(data => console.log('Batch update response:', data))
      .catch(error => console.error('Error:', error));

    }   
  });
  
  const assignmentNameInput = document.getElementById('assignment-name');
  const uploadGradeButton = document.getElementById('upload-grade');
  // 階段成績上傳按鈕的事件處理器
  uploadGradeButton.addEventListener('click', function() {
   if (confirm('確定要上傳階段作業成績嗎？')) {
      // 執行載入數據的操作
 	        console.log('上傳階段作業成績...');	  
			
    const assignmentName = assignmentNameInput.value.trim();
	// 檢查文字輸入框（作業名稱）的值是否為空
    if (!assignmentName) {
      alert('作業名稱不可為空！');
      return; // 終止後續操作
    }

    const selectedRow = rowSelector.value;
	switch (selectedRow) {
		case '1':
			var classname = '902';
			break;
		case '2':
			var classname = '903';
			break;
		case '3':
			var classname = '904';
			break;
		case '4':
			var classname = '905';
			break;
		case '5':
			var classname = '906';
			break;
		case '6':
			var classname = '907';
			break;
		case '7':
			var classname = '社團';
			break;
		case '8':
			var classname = 'YDWS';
			break;					
		default:
			var classname = 'YDWS'; // 如果SELECTITEM不是A、B、C中的任何一個，TEMO為undefined
			break;
	};
    const buttonValues = Array.from(container.children).map(button => button.dataset.value);
    const timestamp = new Date().toISOString();

    // 準備上傳的數據
    const data = {
      timestamp: timestamp,
      row: classname,
      assignmentName: assignmentName,
      buttonValues: buttonValues
    };

    // 將數據發送到Apps Script
    const uploadURL = `${URL1}?action=uploadGrade&data=${encodeURIComponent(JSON.stringify(data))}`;
    fetch(uploadURL)
      .then(response => response.json())
      .then(data => console.log('Grade upload response:', data))
      .catch(error => console.error('Error:', error));
   }
  });

  
});