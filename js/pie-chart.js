var BackChart = BackChart || {};

(function () {

	BackChart.PieChart = BackChart.BaseChart.extend({

		initialize: function (options) {
			BackChart.BaseChart.prototype.initialize.apply(this, arguments);

			this.format = d3.format('.4r');
			
			this.offset = options.offset;

			if (this.width < this.height) {
				this.radius = this.width / 2 - this.offset * 2;
			} else {
				this.radius = this.height / 2 - this.offset * 2;
			}

			this.scaleHue = d3.scale.linear()
				.domain([0, d3.sum(this.data)])
				.range([0, 100]);

			this.scaleRad = d3.scale.linear()
				.domain([0, d3.sum(this.data)])
				.range([0, 2*Math.PI]);
		},

		getChartStyle: function () {
			var self = this;
			return {
				fill: function (data, index) {
					return 'hsl(' + (index * 10 + 180) + ', 100%, 50%)';
					// return 'hsl(' + self.scaleHue(data) + ', 100%, 50%)';
				},
				stroke: function (data, index) {
					return 'hsl(' + (index * 10 + 180) + ', 100%, 50%)';
					// return 'hsl(' + self.scaleHue(data) + ', 100%, 50%)';
				},
				'stroke-width': 1
			};
		},
		getChartAttr: function () {
			var self = this;
				startRad = 0;
			return {
	 			d: function (data) {
					var endRad = startRad + self.scaleRad(data),
						xArc1 = Math.cos(startRad) * self.radius,
						yArc1 = Math.sin(startRad) * self.radius,
						xArc2 = Math.cos(endRad) * self.radius,
						yArc2 = Math.sin(endRad) * self.radius,
						largeArcFlag = (endRad - startRad) > Math.PI ? 1 : 0,
						d = 'M 0 0' +
							' L ' + xArc1 + ' ' + yArc1 + 
							' A ' + self.radius + ' ' + self.radius + ' 0 ' + largeArcFlag + ' 1 ' + xArc2 + ' ' + yArc2;
					startRad = endRad;
	 				return d;
	 			}
			};
		},
		getChartGroupAttr: function () {
			var self = this,
				startRad = 0;
			return {
				transform: function(data, index) {
					var transform,
						endRad = startRad + self.scaleRad(data),
						x = self.margin.left + self.radius + self.offset + Math.cos(startRad + (endRad - startRad) / 2) * self.offset,
						y = self.margin.top + self.radius + self.offset + Math.sin(startRad + (endRad - startRad) / 2) * self.offset;

					transform = 'translate(' + x + ', ' + y + ')';

					startRad = endRad;

					return transform;
				}
			};
		},

		getLabelText: function () {
			var self = this;
			return function (data) {
				return self.format(data);
			};
		},

		getLabelAttr: function () {
			var self = this;
				startRadX = 0;
				startRadY = 0;
			return {
				x: function (data, index) {
					var endRad = startRadX + self.scaleRad(data);
					
					xText = Math.cos(startRadX + self.scaleRad(data) / 2) * (self.radius * 0.75);

					startRadX = endRad;
					return xText;
				},
				y: function (data, index) {
					var endRad = startRadY + self.scaleRad(data);

					yText = Math.sin(startRadY + self.scaleRad(data) / 2) * (self.radius * 0.75);

					startRadY = endRad;
					return yText;
				}
			};
		},

		createChart: function() {
			this.chartGroup.append('path')
				.style(this.getChartStyle())
				.attr(this.getChartAttr());

			this.chartGroup.append('text')
				.text(this.getLabelText())
				.attr(this.getLabelAttr());
		}
	});

})();