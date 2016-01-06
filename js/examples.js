var dataNagativeValues = [],
	data = [],
	data2 = [],
	data3 = [],
	barsChartNagativeValues,
	barsChart1,
	barsChart2,
	barsChart3,
	i;


// for (i = 0; i <= 20; i = i + 2) {
// 	// dataNagativeValues.push(Math.random() * 100 - 50);
// 	dataNagativeValues.push(i - 15);
// }

// barsChartNagativeValues = new BackChart.BarsChart({
// 	className: 'chart-green',
// 	data : dataNagativeValues,
// 	width : 600,
// 	height :200,
// 	margin: {
// 		top: 20,
// 		right: 0,
// 		bottom: 20,
// 		left: 0
// 	},
// 	labelPlacement: BackChart.placement.top,
// 	gutter : 20
// });

// for (i = 0; i < (2*Math.PI); i = i + (Math.PI / 12)) {
// 	data.push(Math.sin(i) * 50);
// }

// barsChart1 = new BackChart.BarsChart({
// 	data : data,
// 	width : 600,
// 	height :200,
// 	margin: {
// 		top: 50,
// 		right: 0,
// 		bottom: 50,
// 		left: 0
// 	},
// 	labelPlacement: BackChart.placement.top,
// 	gutter : 4,
// 	hueRange : {
// 		start: '#ff0000',
// 		end: '#00ff00'
// 	}
// });

// for (i = 0; i <= Math.PI; i = i + (Math.PI / 31)) {
// 	data2.push(Math.sin(i) * 25);
// }
// barsChart2 = new BackChart.BarsChart({
// 	data : data2,
// 	// data : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
// 	width : 600,
// 	height :200,
// 	margin: {
// 		top: 20,
// 		right: 0,
// 		bottom: 20,
// 		left: 0
// 	},
// 	labelPlacement: BackChart.placement.top,
// 	gutter : 1,
// 	hueRange : {
// 		start: '#ff00ff',
// 		end: '#ffff00'
// 	}
// });


// for (i = 0; i <= 100; i = i + 1) {
// 	data3.push(i);
// }

// barsChart3 = new BackChart.BarsChart({
// 	data : data3,
// 	width : 600,
// 	height :200,
// 	margin: {
// 		top: 20,
// 		right: 0,
// 		bottom: 0,
// 		left: 0
// 	},
// 	labelPlacement: BackChart.placement.top,
// 	gutter : 2
// });

// $('body').append(barsChartNagativeValues.render().el);
// $('body').append(barsChart1.render().el);
// $('body').append(barsChart2.render().el);
// $('body').append(barsChart3.render().el);
var d = [];
for (i = 0; i <= 2; i = i + 1) {
	d.push(Math.random()*100);
}


var parseKpiData = function (kpi, dataType) {
	var kpiData = _.find(kpi, {name: dataType}),
		parsedData = {
			labels: [],
			values: []
		};

	for (var key in kpiData.value) {
		parsedData.labels.push(key);
		parsedData.values.push(kpiData.value[key]);
	}

	return parsedData;
};

$.getJSON('json/kpi.json', function (kpi) {
	var totals,
		totalInstallmentsByMonth,
		totalDealsByMonth,
		totalDealsByType,
		totalFreightCampaignsByMonth,
		months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
		dealTypes = {
			DEAL_NOMINAL_ON_CART: 'Nominal',
			DEAL_DISCOUNT       : 'Simples',
			DEAL_FIXED_DISCOUNT : 'Preço Fixo',
			DEAL_PAY_METHOD     : 'Meio/Forma'
		},
		freightTypes = {
			FREIGHT_VALUE: 'Serviço de Frete',
			FREIGHT_PRODUCT: 'Produto',
			CART_PRICE: 'Total do carrinho',
			FREIGHT_FIXED_VALUE: 'Valor Fixo'
		},
		pieChartDefaults = {
			className: 'chart chart-green',
			width : 250,
			height :250,
			offset: 2,
			textOffset: 1.25,
			margin: {
				top: 40,
				right: 40,
				bottom: 40,
				left: 40
			}
		},
		barChartDefaults = {
			className: 'chart chart-green',
			width : 250,
			height :250,
			margin: {
				top: 40,
				right: 20,
				bottom: 20,
				left: 20
			},
			labelPlacement: BackChart.placement.top,
			gutter : 10
		};

		totals = {
			labels:['Promoções', 'Campanhas', 'Parcelamentos'],
			values: [
				_.find(kpi, {name: 'totalInstallments'}).value,
				_.find(kpi, {name: 'totalDeals'}).value,
				_.find(kpi, {name: 'totalFreightCampaigns'}).value
			]
		};

		totalInstallmentsByMonth = parseKpiData(kpi, 'totalInstallmentsByMonth');
		totalInstallmentsByMonth.labels = _.map(totalInstallmentsByMonth.labels, function (n) {
			return months[(new Date(n)).getMonth()].substr(0, 3);
		});

		totalDealsByMonth = parseKpiData(kpi, 'totalDealsByMonth');
		totalDealsByMonth.labels = _.map(totalDealsByMonth.labels, function (n) {
			return months[(new Date(n)).getMonth()].substr(0, 3);
		});

		totalDealsByType = parseKpiData(kpi, 'totalDealsByType');
		totalDealsByType.labels = _.map(totalDealsByType.labels, function (n) {
			return dealTypes[n];
		});

		totalFreightCampaignsByMonth = parseKpiData(kpi, 'totalFreightCampaignsByMonth');
		totalFreightCampaignsByMonth.labels = _.map(totalFreightCampaignsByMonth.labels, function (n) {
			return months[(new Date(n)).getMonth()].substr(0, 3);
		});

		totalFreightCampaignsByType = parseKpiData(kpi, 'totalFreightCampaignsByType');
		totalFreightCampaignsByType.labels = _.map(totalFreightCampaignsByType.labels, function (n) {
			return freightTypes[n];
		});

	/* BAR CHARTS */
	barChartDefaults.title = 'Totais';
	barChartDefaults.dataAslabel = false;
	barChartDefaults.data = totals.values;
	barChartDefaults.labels = totals.labels;
	barChartDefaults.width = 600;
	barChartDefaults.gutter = 100;
	var totalsBarsChart = new BackChart.BarsChart(barChartDefaults);

	barChartDefaults.title = 'Parcelamentos por mês';
	barChartDefaults.dataAslabel = true;
	barChartDefaults.data = totalInstallmentsByMonth.values;
	barChartDefaults.width = 250;
	barChartDefaults.gutter = 10;
	var totalInstallmentsByMonthBarsChart = new BackChart.BarsChart(barChartDefaults);

	barChartDefaults.title = 'Promoções por mês';
	barChartDefaults.data = totalDealsByMonth.values;
	var totalDealsByMonthBarsChart = new BackChart.BarsChart(barChartDefaults);

	barChartDefaults.title = 'Promoções por tipo';
	barChartDefaults.data = totalDealsByType.values;
	var totalDealsByTypeBarsChart = new BackChart.BarsChart(barChartDefaults);

	barChartDefaults.title = 'Campanhas por mês';
	barChartDefaults.data = totalFreightCampaignsByMonth.values;
	var totalFreightCampaignsByMonthBarsChart = new BackChart.BarsChart(barChartDefaults);


	barChartDefaults.title = 'Campanhas por tipo';
	barChartDefaults.data = totalFreightCampaignsByType.values;
	var totalFreightCampaignsByTypeBarsChart = new BackChart.BarsChart(barChartDefaults);

	/* PIE CHARTS */
	pieChartDefaults.title = 'Parcelamentos por mês';
	pieChartDefaults.data = totalInstallmentsByMonth.values;
	pieChartDefaults.labels = totalInstallmentsByMonth.labels;
	var totalInstallmentsByMonthPieChart = new BackChart.PieChart(pieChartDefaults);

	pieChartDefaults.title = 'Promoções por mês';
	pieChartDefaults.data = totalDealsByMonth.values;
	pieChartDefaults.labels = totalDealsByMonth.labels;
	var totalDealsByMonthPieChart = new BackChart.PieChart(pieChartDefaults);

	pieChartDefaults.title = 'Promoções por tipo';
	pieChartDefaults.data = totalDealsByType.values;
	pieChartDefaults.labels = totalDealsByType.labels;
	var totalDealsByTypePieChart = new BackChart.PieChart(pieChartDefaults);

	pieChartDefaults.title = 'Campanhas por mês';
	pieChartDefaults.data = totalFreightCampaignsByMonth.values;
	pieChartDefaults.labels = totalFreightCampaignsByMonth.labels;
	var totalFreightCampaignsByMonthPieChart = new BackChart.PieChart(pieChartDefaults);

	pieChartDefaults.title = 'Campanhas por tipo';
	pieChartDefaults.data = totalFreightCampaignsByType.values;
	pieChartDefaults.labels = totalFreightCampaignsByType.labels;
	var totalFreightCampaignsByTypePieChart = new BackChart.PieChart(pieChartDefaults);


	var $charts = $('.charts'),
		wrapChart = function (chart, cols) {
			return $('<div/>')
				.addClass('col-xs-' + cols)
				.append(chart);
		};

	$charts
		.append(wrapChart(totalsBarsChart.render().el, 12))

		.append(wrapChart(totalInstallmentsByMonthBarsChart.render().el, 6))
		.append(wrapChart(totalInstallmentsByMonthPieChart.render().el, 6))

		.append(wrapChart(totalDealsByMonthBarsChart.render().el, 6))
		.append(wrapChart(totalDealsByMonthPieChart.render().el, 6))

		.append(wrapChart(totalDealsByTypeBarsChart.render().el, 6))
		.append(wrapChart(totalDealsByTypePieChart.render().el, 6))

		.append(wrapChart(totalFreightCampaignsByMonthBarsChart.render().el, 6))
		.append(wrapChart(totalFreightCampaignsByMonthPieChart.render().el, 6))

		.append(wrapChart(totalFreightCampaignsByTypeBarsChart.render().el, 6))	
		.append(wrapChart(totalFreightCampaignsByTypePieChart.render().el, 6));	
});