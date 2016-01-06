var BackChart = BackChart || {};

(function () {

	BackChart.PieChart = BackChart.BaseChart.extend({

		initialize: function (options) {
			BackChart.BaseChart.prototype.initialize.apply(this, arguments);
			
			this.labels = options.labels;

			// this.format = d3.format('.4r');
			this.format = d3.format('d');
			
			this.offset = options.offset;

			this.textOffset = options.textOffset;

			if (this.innerWidth < this.innerHeight) {
				this.radius = this.innerWidth / 2 - this.offset;
			} else {
				this.radius = this.innerHeight / 2 - this.offset;
			}

			if (options.hueRange) {
				this.hueRange = {
					start : d3.rgb(options.hueRange.start).hsl().h,
					end : d3.rgb(options.hueRange.end).hsl().h
				};

				this.scaleHue = d3.scale.linear()
					.domain([0, d3.sum(this.data)])
					.range([this.hueRange.start, this.hueRange.end]);
			}


			this.scaleRad = d3.scale.linear()
				.domain([0, d3.sum(this.data)])
				.range([0, 2*Math.PI]);
		},

		getChartStyle: function () {
			var self = this,
				style = {};

			if (self.hueRange) {
				style.fill = function (data, index) {
					return 'hsl(' + (index * 10 + 180) + ', 100%, 50%)';
					// return 'hsl(' + self.scaleHue(data) + ', 100%, 50%)';
				};
				style.stroke = function (data, index) {
					return 'hsl(' + (index * 10 + 180) + ', 100%, 50%)';
					// return 'hsl(' + self.scaleHue(data) + ', 100%, 50%)';
				};
			}

			style['stroke-width'] = 1;

			return style;
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
			return function (data, index) {
				// return self.format(data);
				return self.labels[index];
			};
		},

		getLabelAttr: function () {
			var self = this;
				startRadX = 0;
				startRadY = 0;
			return {
				x: function (data, index) {
					var endRad = startRadX + self.scaleRad(data);
					
					xText = Math.cos(startRadX + self.scaleRad(data) / 2) * (self.radius * self.textOffset);

					startRadX = endRad;
					return xText;
				},
				y: function (data, index) {
					var endRad = startRadY + self.scaleRad(data);

					yText = Math.sin(startRadY + self.scaleRad(data) / 2) * (self.radius * self.textOffset);

					startRadY = endRad;
					return yText;
				}
			};
		},

		appendAfterChart: function () {
			// this.svg.append('g')
			// 	.append('rect')
			// 	.attr({
			// 		width: this.margin.left,
			// 		height: this.margin.top + this.height + this.margin.bottom
			// 	})
			// 	.style({
			// 		opacity: '0.5'
			// 	});

			// this.svg.append('g')
			// 	.append('rect')
			// 	.attr({
			// 		width: this.margin.left + this.width + this.margin.right,
			// 		height: this.margin.top
			// 	})
			// 	.style({
			// 		opacity: '0.5'
			// 	});

			// this.svg.append('g')
			// 	.attr({
			// 		transform: 'translate(' + (this.width + this.margin.left) + ', ' + 0 + ')'
			// 	})
			// 	.append('rect')
			// 	.attr({
			// 		width: this.margin.right,
			// 		height: this.margin.top + this.height + this.margin.bottom
			// 	})
			// 	.style({
			// 		opacity: '0.5'
			// 	});

			// this.svg.append('g')
			// 	.attr({
			// 		transform: 'translate(' + 0 + ', ' + (this.height + this.margin.top) + ')'
			// 	})
			// 	.append('rect')
			// 	.attr({
			// 		width: this.margin.left + this.width + this.margin.right,
			// 		height: this.margin.bottom
			// 	})
			// 	.style({
			// 		opacity: '0.5'
			// 	});

			// this.svg.append('circle')
			// 	.attr({
			// 		cx: this.margin.left + this.radius + this.offset,
			// 		cy: this.margin.top + this.radius + this.offset,
			// 		r: 2
			// 	})
			// 	.style({
			// 		fill: 'red'
			// 	});

		},

		createChartGroup: function() {
			this.chartGroup = this.svg.selectAll('g')
				.data(this.data)
				.enter()
					.append('g')
					.attr(this.getChartGroupAttr());

			this.chartTextGroup = this.svg.selectAll('g.chart-label')
				.data(this.data)
				.enter()
					.append('g')
					.classed('chart-label', true)
					.attr(this.getChartGroupAttr());
		},

		createChart: function() {
			var self = this,
				svgText;

			this.chartGroup.append('title')
				.text(function(data){
					return data;
				});

			this.chartGroup.append('path')
				.style(this.getChartStyle())
				.attr(this.getChartAttr());

			this.chartTextGroup.append('text')
				.text(this.getLabelText())
				.attr(this.getLabelAttr());
		}
	});

})();