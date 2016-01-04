var BackChart = BackChart || {};

(function () {

	BackChart.BarsChart = BackChart.BaseChart.extend({

		initialize: function (options) {
			BackChart.BaseChart.prototype.initialize.apply(this, arguments);

			this.labelPlacement = options.labelPlacement;

			this.gutter = options.gutter;

			this.barWidth = (this.width - this.gutter) / this.data.length - this.gutter;

			this.hueRange = {};

			if (options.hueRange) {
				this.hueRange.start = d3.rgb(options.hueRange.start).hsl().h;
				this.hueRange.end = d3.rgb(options.hueRange.end).hsl().h;
			} else {
				this.hueRange.start = 0;
				this.hueRange.end = 360;
			}

			this.scaleHue = d3.scale.linear()
				.domain([0, d3.max(this.data)])
				.range([this.hueRange.start, this.hueRange.end]);

			this.scaleX = d3.scale.linear()
				.domain([0, this.data.length])
				.range([0, this.width - this.gutter]);

			this.scaleY = d3.scale.linear()
				.domain([d3.min(this.data), d3.max(this.data)])
				.range([0, this.height]);
		},

		getChartStyle: function () {
			var self = this;
			return {
				width: this.barWidth + 'px',
				height: function(data) {
					var y;

					if (data >= 0) {
						y = self.scaleY(data) - self.scaleY(0);
					} else {
						y = self.scaleY(0) - self.scaleY(data);
					}

					return y + 'px';
				},
				fill: function(data, index) {
					return 'hsl(' + self.scaleHue(data) + ',100%,50%)';
				}
			};
		},
		getChartGroupAttr: function () {
			var self = this;

			return {
				transform: function(data, index) {
					var y;
					if (data >= 0) {
						y = self.height - self.scaleY(data) + self.margin.top;
					} else {
						y = self.height - self.scaleY(0) + self.margin.top;
					}

					return 'translate(' + (self.scaleX(index) + self.gutter + self.margin.left) + ', ' + y + ')';
				}
			};
		},

		getLabelText: function () {
			return function (data) {
				return Math.round(data);
			};
		},

		getLabelAttr: function () {
			var self = this;
			return {
				'alignment-baseline': function(data) {
					switch(self.labelPlacement) {
						case BackChart.placement.top:
							return data >= 0 ? 'text-after-edge' : 'text-before-edge';
						case BackChart.placement.bottom:
							return data >= 0 ? 'text-before-edge' : 'text-after-edge';
					}
				},
				'x': this.barWidth*0.5,
				'y': function (data) {
					if (data >= 0) {
						return 0;
					} else {
						return self.scaleY(0) - self.scaleY(data);
					}
				}
			};
		},

		createChart: function() {
			this.chartGroup.append('rect')
				.style(this.getChartStyle());

			this.chartGroup.append('text')
				.text(this.getLabelText())
				.attr(this.getLabelAttr());
		},
		appendBeforeChart: function() {
			var self = this;

			this.svg.append('line')
				.attr({
					x1: 0,
					y1: self.height - self.scaleY(0) + self.margin.top,
					x2: self.width,
					y2: self.height - self.scaleY(0) + self.margin.top
				})
				.style({
					'stroke-width': 1,
					stroke: '#ffffff'
				});
		}
	});

})();