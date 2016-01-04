var BackChart = BackChart || {};

(function () {


	BackChart.placement = {
		top:1,
		right:2,
		bottom:3,
		left:4
	};

	BackChart.BaseChart = Backbone.View.extend({

		initialize: function (options) {
			this.data = options.data;

			this.width = options.width;
			this.height = options.height;

			this.margin = options.margin;
		},

		createSVGElement: function() {
			this.svg = d3.select(this.el).append('svg')
				.classed('chart-container', true)
				.style({
					width: (this.width + this.margin.left + this.margin.right) + 'px',
					height: (this.height + this.margin.top + this.margin.bottom) + 'px'
				});
		},

		appendBeforeChart: function () {
		},
		appendAfterChart: function () {
		},

		getChartStyle: function () {
			throw 'Not implemented';
		},
		getChartAttr: function () {
			throw 'Not implemented';
		},
		getLabelText: function () {
			throw 'Not implemented';
		},
		getLabelAttr: function () {
			throw 'Not implemented';
		},
		createChartGroup: function() {
			this.chartGroup = this.svg.selectAll('g')
				.data(this.data)
				.enter()
					.append('g')
					.attr(this.getChartGroupAttr());
		},
		createChart: function () {
			throw 'Not implemented';
		},
		render: function () {

			this.createSVGElement();

			this.appendBeforeChart();

			this.createChartGroup();

			this.createChart();

			this.appendAfterChart();

			return this;
		}
	});

})();