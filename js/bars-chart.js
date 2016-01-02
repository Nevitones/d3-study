var BackChart = BackChart || {};

function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

(function () {


	BackChart.placement = {
		top:1,
		right:2,
		bottom:3,
		left:4
	};

	BackChart.BarsChart = Backbone.View.extend({
		// tagName: 'svg',
		// className: 'chart-container',

		initialize: function (options) {
			this.data = options.data;

			this.width = options.width;
			this.height = options.height;

			this.margin = options.margin;

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

			// d3.rgb('#BADA55').hsl()

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

		createSVGElement: function() {
			this.svg = d3.select(this.el).append('svg')
				.classed('chart-container', true)
				.style( {
					width: (this.width + this.margin.left + this.margin.right) + 'px',
					height: (this.height + this.margin.top + this.margin.bottom) + 'px'
				});			
		},

		getLabelText: function () {
		},

		getLabelTextAttr: function () {
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
			var self = this,
				chartGroup = this.svg.selectAll('g')
				.data(this.data)
				.enter()
					.append('g')
					.attr('transform', function(data, index) {
						var y;
						if (data >= 0) {
							y = self.height - self.scaleY(data) + self.margin.top;
						} else {
							y = self.height - self.scaleY(0) + self.margin.top;
						}

						return 'translate(' + (self.scaleX(index) + self.gutter + self.margin.left) + ', ' + y + ')';
					});

			chartGroup.append('rect')
				.style({
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
				});

			chartGroup.append('text')
				.text(function(data){return Math.round(data);})
				.attr(this.getLabelTextAttr());
		},
		createHLine: function() {
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
		},
		render: function () {

			this.createSVGElement();

			this.createHLine();
				
			this.createChart();

			return this;
		}
	});

})();