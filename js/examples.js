var dataNagativeValues = [],
	data = [],
	data2 = [],
	data3 = [],
	barsChartNagativeValues,
	barsChart1,
	barsChart2,
	barsChart3,
	i;


for (i = 0; i <= 20; i = i + 2) {
	// dataNagativeValues.push(Math.random() * 100 - 50);
	dataNagativeValues.push(i - 15);
}

barsChartNagativeValues = new BackChart.BarsChart({
	data : dataNagativeValues,
	width : 600,
	height :200,
	margin: {
		top: 20,
		right: 0,
		bottom: 20,
		left: 0
	},
	labelPlacement: BackChart.placement.top,
	gutter : 2
});

for (i = 0; i < (2*Math.PI); i = i + (Math.PI / 12)) {
	data.push(Math.sin(i) * 50);
}

barsChart1 = new BackChart.BarsChart({
	data : data,
	width : 600,
	height :200,
	margin: {
		top: 50,
		right: 0,
		bottom: 50,
		left: 0
	},
	labelPlacement: BackChart.placement.top,
	gutter : 4,
	hueRange : {
		start: '#ff0000',
		end: '#00ff00'
	}
});

for (i = 0; i <= Math.PI; i = i + (Math.PI / 31)) {
	data2.push(Math.sin(i) * 25);
}
barsChart2 = new BackChart.BarsChart({
	data : data2,
	// data : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
	width : 600,
	height :200,
	margin: {
		top: 20,
		right: 0,
		bottom: 20,
		left: 0
	},
	labelPlacement: BackChart.placement.top,
	gutter : 1,
	hueRange : {
		start: '#ff00ff',
		end: '#ffff00'
	}
});


for (i = 0; i <= 100; i = i + 1) {
	data3.push(i);
}

barsChart3 = new BackChart.BarsChart({
	data : data3,
	width : 600,
	height :200,
	margin: {
		top: 20,
		right: 0,
		bottom: 0,
		left: 0
	},
	labelPlacement: BackChart.placement.top,
	gutter : 2
});

// $('body').append(barsChartNagativeValues.render().el);
// $('body').append(barsChart1.render().el);
// $('body').append(barsChart2.render().el);
// $('body').append(barsChart3.render().el);
var d = [];
for (i = 0; i <= 4; i = i + 1) {
	d.push(Math.random()*100);
}

var pieChart = new BackChart.PieChart({
	data : d,
	width : 400,
	height :600,
	radius: 250,
	offset: 10,
	margin: {
		top: 25,
		right: 25,
		bottom: 25,
		left: 25
	}
});

$('body').append(pieChart.render().el);