var BackChart = BackChart || {};

(function () {

	BackChart.PieChart = BackChart.BaseChart.extend({

        defaults: {
            svgClassName: 'pie-chart'
        },

		initialize: function (options) {
			BackChart.BaseChart.prototype.initialize.apply(this, arguments);
			
            this.svgClassName = options.svgClassName || this.defaults.svgClassName;

			this.labels = options.labels;

			// this.format = d3.format('.4r');
			this.format = d3.format('d');
			
			this.offset = options.offset;

            this.labelOffset = options.labelOffset;
			this.valueOffset = options.valueOffset;

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

			this.pieces = this.calculatePieceSizes();

			this.alignmentAreas = [Math.PI/8, 3*Math.PI/8, 5*Math.PI/8, 7*Math.PI/8, 9*Math.PI/8, 11*Math.PI/8, 13*Math.PI/8, 15*Math.PI/8];

		},

		calculatePieceSizes: function () {
			var self = this,
				currentRad = 0,
				pieces = [];

			_.each(this.data, function(data, index) {
				pieces.push(currentRad);
				currentRad += self.scaleRad(data);
			});

			return pieces;
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
				return self.labels[index];
			};
		},

		getXArc: function (data, index, offset, svgElement) {
			var radians = this.pieces[index] + this.scaleRad(data) / 2,
				xArc = Math.cos(radians);
			
			xText = xArc * (this.radius * offset);


            if (radians >= this.alignmentAreas[6] || radians <= this.alignmentAreas[1]) {
                d3.select(svgElement).style('text-anchor', 'start');
            } else if (radians <= this.alignmentAreas[2]) {
                d3.select(svgElement).style('text-anchor', 'middle');
            } else if (radians <= this.alignmentAreas[5]) {
            	d3.select(svgElement).style('text-anchor', 'end');
            } else if (radians <= this.alignmentAreas[7]) {
                d3.select(svgElement).style('text-anchor', 'middle');
            }


            // if(radians < Math.PI/2 || radians > 3*Math.PI/2) {
            //     d3.select(svgElement).style('text-anchor', 'start');
            // } else {
            //     d3.select(svgElement).style('text-anchor', 'end');
            // }

			return xText;
		},

		getYArc: function (data, index, offset, svgElement) {
			var radians = this.pieces[index] + this.scaleRad(data) / 2,
				yArc = Math.sin(radians);

			yText = yArc * (this.radius * offset);

            if (radians >= this.alignmentAreas[7] || radians <= this.alignmentAreas[0]) {
                d3.select(svgElement).style('alignment-baseline', 'middle');
            } else if (radians <= this.alignmentAreas[3]) {
                d3.select(svgElement).style('alignment-baseline', 'text-before-edge');
            } else if (radians <= this.alignmentAreas[4]) {
            	d3.select(svgElement).style('alignment-baseline', 'middle');
            } else if (radians <= this.alignmentAreas[7]) {
                d3.select(svgElement).style('alignment-baseline', 'text-after-edge');
            }

            // if(radians < Math.PI) {
            //     d3.select(svgElement).style('alignment-baseline', 'text-before-edge');
            // } else {
            //     d3.select(svgElement).style('alignment-baseline', 'text-after-edge');
            // }

			return yText;
		},

		getLabelAttr: function () {
			var self = this;

			return {
                class: 'chart-label',
				x: function (data, index) {
					return self.getXArc(data, index, self.labelOffset, this);
				},
				y: function (data, index) {
					return self.getYArc(data, index, self.labelOffset, this);
				}
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
				x: function (data, index) {
					return self.getXArc(data, index, self.valueOffset, this);
				},
				y: function (data, index) {
					return self.getYArc(data, index, self.valueOffset, this);
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

            this.chartTextGroup.append('text')
                .text(this.getValueText())
                .attr(this.getValueAttr());


            /* HELPERS */
            // var startRadX = 0,
            //     startRadY = 0;

            // this.chartTextGroup.append('circle')
            //     .attr({
            //             cx: function (data, index) {
            //                 var endRad = startRadX + self.scaleRad(data);
                            
            //                 xText = Math.cos(startRadX + self.scaleRad(data) / 2) * (self.radius * self.valueOffset);

            //                 startRadX = endRad;
            //                 return xText;
            //             },
            //             cy: function (data, index) {
            //                 var endRad = startRadY + self.scaleRad(data);

            //                 yText = Math.sin(startRadY + self.scaleRad(data) / 2) * (self.radius * self.valueOffset);

            //                 startRadY = endRad;
            //                 return yText;
            //             },
            //             r: 2
            //         })
            //     .style({
            //         fill: 'red'
            //     });

            // this.chartTextGroup.append('circle')
            //     .attr({
            //             cx: function (data, index) {
            //                 var endRad = startRadX + self.scaleRad(data);
                            
            //                 xText = Math.cos(startRadX + self.scaleRad(data) / 2) * (self.radius * self.labelOffset);

            //                 startRadX = endRad;
            //                 return xText;
            //             },
            //             cy: function (data, index) {
            //                 var endRad = startRadY + self.scaleRad(data);

            //                 yText = Math.sin(startRadY + self.scaleRad(data) / 2) * (self.radius * self.labelOffset);

            //                 startRadY = endRad;
            //                 return yText;
            //             },
            //             r: 2
            //         })
            //     .style({
            //         fill: 'red'
            //     });
		}
	});

})();