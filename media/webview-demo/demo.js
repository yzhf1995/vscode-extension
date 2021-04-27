function showChart() {
	const rand = function (from, to) {
		return Math.round(from + Math.random() * (to - from));
	};
	const chart = Highcharts.chart('container', {
		chart: {
			type: 'column',
			options3d: {
				enabled: true,
				alpha: 20,
				beta: 30,
				depth: 400, // Set deph
				viewDistance: 5,
				frame: {
					bottom: {
						size: 1,
						color: 'rgba(0,0,0,0.05)'
					}
				}
			}
		},
		title: {
			text: ''
		},
		subtitle: {
			text: ''
		},
		yAxis: {
			min: 0,
			max: 10
		},
		xAxis: {
			min: 0, // Set min on xAxis
			max: 3,
			gridLineWidth: 1
		},
		zAxis: {
			min: 0,
			max: 3,
			categories: ['A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07', 'A08', 'A09', 'A10', 'A11', 'A12'],
			labels: {
				y: 5,
				rotation: 18
			}
		},
		plotOptions: {
			series: {
				groupZPadding: 10,
				depth: 100,
				groupPadding: 0,
				grouping: false,
			}
		},
		series: [{
			stack: 0,
			data: [...Array(4)].map((v, i) => ({ x: i, y: rand(0, 10) }))
		}, {
			stack: 1,
			data: [...Array(4)].map((v, i) => ({ x: i, y: rand(0, 10) }))
		}, {
			stack: 2,
			data: [...Array(4)].map((v, i) => ({ x: i, y: rand(0, 10) }))
		},{
			stack: 3,
			data: [...Array(4)].map((v, i) => ({ x: i, y: rand(0, 10) }))
		}]
	});
};
showChart();