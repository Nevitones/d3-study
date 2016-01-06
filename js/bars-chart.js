var BackChart = BackChart || {};

(function () {

	BackChart.BarsChart = BackChart.BaseChart.extend({

		initialize: function (options) {
			BackChart.BaseChart.prototype.initialize.apply(this, arguments);

			var minData = d3.min(this.data),
				maxData = d3.max(this.data);

			if (minData > 0) {
				minData = 0;
			}

			this.dataAslabel = options.dataAslabel;

			this.labels = options.labels;

            this.labelPlacement = options.labelPlacement;
			this.valuePlacement = options.valuePlacement;

			this.gutter = options.gutter;

			this.barWidth = (this.innerWidth - this.gutter) / this.data.length - this.gutter;

			this.hueRange = {};

			if (options.hueRange) {
				this.hueRange.start = d3.rgb(options.hueRange.start).hsl().h;
				this.hueRange.end = d3.rgb(options.hueRange.end).hsl().h;
			} else {
				this.hueRange.start = 0;
				this.hueRange.end = 360;
			}

			this.scaleHue = d3.scale.linear()
				.domain([0, maxData])
				.range([this.hueRange.start, this.hueRange.end]);

			this.scaleX = d3.scale.linear()
				.domain([0, this.data.length])
				.range([0, this.innerWidth - this.gutter]);

			this.scaleY = d3.scale.linear()
				.domain([minData, maxData])
				.range([0, this.innerHeight]);
		},

		getChartStyle: function () {
			var self = this;
			return {
				width: this.barWidth + 'px',
				height: function(data) {
					var h;

					if (data >= 0) {
						h = self.scaleY(data) - self.scaleY(0);
					} else {
						h = self.scaleY(0) - self.scaleY(data);
					}

					return h + 'px';
				}
				// fill: function(data, index) {
				// 	return 'hsl(' + self.scaleHue(data) + ',100%,50%)';
				// }
			};
		},
		getChartGroupAttr: function () {
			var self = this;

			return {
				transform: function(data, index) {
					var y;
					if (data >= 0) {
						y = self.innerHeight - self.scaleY(data) + self.margin.top;
					} else {
						y = self.innerHeight - self.scaleY(0) + self.margin.top;
					}
					return 'translate(' + (self.scaleX(index) + self.gutter + self.margin.left) + ', ' + y + ')';
				}
			};
		},

		getLabelText: function () {
			var self = this;
			return function (data, index) {
                return  self.labels[index];
			};
		},

		getLabelAttr: function () {
			var self = this;
			return {
                class: 'chart-label',
				'alignment-baseline': function(data) {
					switch(self.labelPlacement) {
                        case BackChart.placement.INSIDE:
                            return data >= 0 ? 'text-after-edge' : 'text-before-edge';
                        case BackChart.placement.OUTSIDE:
                            return data >= 0 ? 'text-before-edge' : 'text-after-edge';
					}
				},
				x: this.barWidth*0.5,
                y: function (data) {
                    if (data >= 0) {
                        return self.scaleY(data);
                    } else {
                        return self.scaleY(0) + self.scaleY(data);
                    }
                },
                dy: '0.25em'
			};
		},

        getValueText: function () {
            var self = this;
            return function (data) {
                return data;
            };
        },

        getValueAttr: function () {
            var self = this;
            return {
                class: 'chart-value',
                'alignment-baseline': function(data) {
                    switch(self.valuePlacement) {
                        case BackChart.placement.OUTSIDE:
                            return data >= 0 ? 'text-after-edge' : 'text-before-edge';
                        case BackChart.placement.INSIDE:
                            return data >= 0 ? 'text-before-edge' : 'text-after-edge';
                    }
                },
                x: this.barWidth*0.5,
                y: function (data) {
                    if (data >= 0) {
                        return 0;
                    } else {
                        return self.scaleY(0) - self.scaleY(data);
                    }
                },
                dy: '-0.25em'
            };
        },

		createChart: function() {
			this.chartGroup.append('rect')
				.style(this.getChartStyle());

			this.chartGroup.append('text')
				.text(this.getLabelText())
				.attr(this.getLabelAttr());

            this.chartGroup.append('text')
                .text(this.getValueText())
                .attr(this.getValueAttr());
		},
		appendBeforeChart: function() {
			var self = this;

			// this.svg.append('line')
			// 	.attr({
			// 		x1: 0,
			// 		y1: self.height - self.scaleY(0) + self.margin.top,
			// 		x2: self.width,
			// 		y2: self.height - self.scaleY(0) + self.margin.top
			// 	})
			// 	.style({
			// 		'stroke-width': 1,
			// 		stroke: '#ffffff'
			// 	});
		}
	});

})();