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
		totalInstallmentsByType,
		totalDealsByMonth,
		totalDealsByType,
		totalFreightCampaignsByMonth,
		totalClusters,
		totalDealsWithCoupons,
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
			svgClassName: 'pie-chart',
			width : 300,
			height :250,
			offset: 4,
            labelOffset: 1.04,
			valueOffset: 0.5,
			margin: {
				top: 50,
				right: 75,
				bottom: 40,
				left: 75
			}
		},
		barChartDefaults = {
			className: 'chart chart-green',
            dataAslabel: false,
			width : 250,
			height :250,
			margin: {
				top: 40,
				right: 20,
				bottom: 20,
				left: 20
			},
            labelPlacement: BackChart.placement.OUTSIDE,
			valuePlacement: BackChart.placement.OUTSIDE,
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

		totalDealsWithCoupons = {
			labels: ['Promoções'],
			values: [
				_.find(kpi, {name: 'totalDealsWithCoupons'}).value
			]			
		};

		totalInstallmentsByType = {
			labels: ['Com Juros', 'Sem Juros'],
			values: [
				_.find(kpi, {name: 'totalInstallmentsWithInterest'}).value,
				_.find(kpi, {name: 'totalInstallmentsWithoutInterest'}).value
			]
		};
		
		totalClusters = {
			labels: ['Promoções', 'Campanhas'],
			values: [
				_.find(kpi, {name: 'totalDealsWithClusters'}).value,
				_.find(kpi, {name: 'totalFreightCampaignsWithClusters'}).value
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
	barChartDefaults.data = totals.values;
	barChartDefaults.labels = totals.labels;
	barChartDefaults.width = 345;
	barChartDefaults.gutter = 20;
	barChartDefaults.margin = {
		top: 40,
		right: 10,
		bottom: 20,
		left: 10
	};
	var totalsBarsChart = new BackChart.BarsChart(barChartDefaults);

	barChartDefaults.title = 'Coupons';
	barChartDefaults.data = totalDealsWithCoupons.values;
	barChartDefaults.labels = totalDealsWithCoupons.labels;
	barChartDefaults.gutter = 120;
	var totalDealsWithCouponsBarsChart = new BackChart.BarsChart(barChartDefaults);

	barChartDefaults.title = 'Parcelamentos por mês';
	barChartDefaults.data = totalInstallmentsByMonth.values;
	barChartDefaults.labels = totalInstallmentsByMonth.labels;
	barChartDefaults.width = 345;
	barChartDefaults.gutter = 20;
	barChartDefaults.margin = {
		top: 40,
		right: 20,
		bottom: 20,
		left: 20
	};
	var totalInstallmentsByMonthBarsChart = new BackChart.BarsChart(barChartDefaults);

	barChartDefaults.title = 'Parcelamentos por tipo';
	barChartDefaults.data = totalInstallmentsByType.values;
	barChartDefaults.labels = totalInstallmentsByType.labels;
	var totalInstallmentsByTypeBarsChart = new BackChart.BarsChart(barChartDefaults);

	barChartDefaults.title = 'Promoções por mês';
	barChartDefaults.data = totalDealsByMonth.values;
	barChartDefaults.labels = totalDealsByMonth.labels;
	var totalDealsByMonthBarsChart = new BackChart.BarsChart(barChartDefaults);

	barChartDefaults.title = 'Promoções por tipo';
	barChartDefaults.data = totalDealsByType.values;
	var totalDealsByTypeBarsChart = new BackChart.BarsChart(barChartDefaults);

	barChartDefaults.title = 'Campanhas por mês';
	barChartDefaults.data = totalFreightCampaignsByMonth.values;
	barChartDefaults.labels = totalFreightCampaignsByMonth.labels;
	var totalFreightCampaignsByMonthBarsChart = new BackChart.BarsChart(barChartDefaults);

	barChartDefaults.title = 'Campanhas por tipo';
	barChartDefaults.data = totalFreightCampaignsByType.values;
	var totalFreightCampaignsByTypeBarsChart = new BackChart.BarsChart(barChartDefaults);

	/* PIE CHARTS */
	pieChartDefaults.title = 'Clusters';
    pieChartDefaults.data = totalClusters.values;
	pieChartDefaults.labels = totalClusters.labels;
	var totalClustersPieChart = new BackChart.PieChart(pieChartDefaults);

	pieChartDefaults.title = 'Parcelamentos por mês';
	pieChartDefaults.data = totalInstallmentsByMonth.values;
	pieChartDefaults.labels = totalInstallmentsByMonth.labels;
	var totalInstallmentsByMonthPieChart = new BackChart.PieChart(pieChartDefaults);

	pieChartDefaults.title = 'Parcelamentos por tipo';
	pieChartDefaults.data = totalInstallmentsByType.values;
	pieChartDefaults.labels = totalInstallmentsByType.labels;
	var totalInstallmentsByTypePieChart = new BackChart.PieChart(pieChartDefaults);

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
		createChartCard = function (chart, className) {
			return $('<div/>')
				.addClass(className)
                .append(chart.el);
		};

	$charts
		.append(createChartCard(totalsBarsChart.render(), 'col-xs-12'))
		
		.append(createChartCard(totalDealsWithCouponsBarsChart.render(), 'col-md-12 col-lg-6'))
		.append(createChartCard(totalClustersPieChart.render(), 'col-md-12 col-lg-6'))

		.append(createChartCard(totalInstallmentsByTypeBarsChart.render(), 'col-xs-12 col-sm-6 col-lg-4'))
		.append(createChartCard(totalInstallmentsByTypePieChart.render(), 'col-xs-12 col-sm-6 col-lg-4'))

		.append(createChartCard(totalInstallmentsByMonthBarsChart.render(), 'col-xs-12 col-sm-6 col-lg-4'))
		.append(createChartCard(totalInstallmentsByMonthPieChart.render(), 'col-xs-12 col-sm-6 col-lg-4'))

		.append(createChartCard(totalDealsByMonthBarsChart.render(), 'col-xs-12 col-sm-6 col-lg-4'))
		.append(createChartCard(totalDealsByMonthPieChart.render(), 'col-xs-12 col-sm-6 col-lg-4'))

		.append(createChartCard(totalDealsByTypeBarsChart.render(), 'col-xs-12 col-sm-6 col-lg-4'))
		.append(createChartCard(totalDealsByTypePieChart.render(), 'col-xs-12 col-sm-6 col-lg-4'))

		.append(createChartCard(totalFreightCampaignsByMonthBarsChart.render(), 'col-xs-12 col-sm-6 col-lg-4'))
		.append(createChartCard(totalFreightCampaignsByMonthPieChart.render(), 'col-xs-12 col-sm-6 col-lg-4'))

		.append(createChartCard(totalFreightCampaignsByTypeBarsChart.render(), 'col-xs-12 col-sm-6 col-lg-4'))	
		.append(createChartCard(totalFreightCampaignsByTypePieChart.render(), 'col-xs-12 col-sm-6 col-lg-4'));	
});