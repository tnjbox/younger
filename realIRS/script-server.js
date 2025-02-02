// 初始化為null
let myChart = null;

document.addEventListener('DOMContentLoaded', function() {

  // 設定Apps Script網頁應用程式的基本URL
  const URL1 = 'https://script.google.com/macros/s/AKfycbxUc3BbVivUmZUpmjklabjSU7GJLiXVIA0C15mB8bCQTb3QMGE_OAUT5Q_GV9rGsiw9/exec';

	//載入長條圖數據，並繪製長條圖
  const loadDataButton = document.getElementById('load-data');
  loadDataButton.addEventListener('click', function() {
	const URL2 = `?action=readData&row=51`;
    // 組合URL
    const URL = URL1 + URL2;
    fetch(URL)
      .then(response => response.json())
      .then(data => {
            const values = data[0];
			console.log(values);
            const labels = ['A', 'B', 'C', 'D', 'E'];
			//data改為DATA1(因為重名)
            const data1 = {
                labels: labels,
                datasets: [{
                    label: '數值',
                    data: [values[0], values[1], values[2], values[3], values[4]],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                    borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                    borderWidth: 1
                }]
            };
            //圖表設定
			const config = {
                type: 'bar',
                data: data1,
                options: {
                    indexAxis: 'y', // 將圖表轉90度
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(tooltipItem) {
                                    return tooltipItem.label + ': ' + tooltipItem.raw;
                                }
                            }
                        },
                        datalabels: {
                            anchor: 'end',
                            align: 'end',
                            formatter: (value) => value
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true
                        }
                    }
                },
            };
			//如果圖表已經存在，清除之
            if (myChart) {
                myChart.destroy();
            }
			//繪製圖表
            const ctx = document.getElementById('myBarChart').getContext('2d');
            myChart = new Chart(ctx, config);

			//建構表格呈現詳細答題狀況
			const table = document.getElementById('data-table');
			table.innerHTML = '';
            const options = ['A', 'B', 'C', 'D', 'E'];
            for (let i = 0; i < options.length; i++) {
                const row = table.insertRow();
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                cell1.textContent = options[i];
                cell2.textContent = values[i+5];
            }
      })
      .catch(error => console.error('Error:', error));
  });

  // 重置數據，清除所有數據
  const clearData = document.getElementById('clear-Data');
  clearData.addEventListener('click', function() {
    // 將批次上傳的數據發送到Apps Script
    const batchUpdateURL = `${URL1}?action=clearData`;
    fetch(batchUpdateURL)
      .then(response => response.json())
      .then(data => {
		console.log('clearData response:', data);
		if (myChart) {
                myChart.destroy();
            }
		const table = document.getElementById('data-table');
		table.innerHTML = '';	
		})
      .catch(error => console.error('Error:', error));  
  });
 
});

