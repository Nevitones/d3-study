var BackChart = BackChart || {};

(function () {


	BackChart.placement = {
		TOP:1,
		RIGHT:2,
		BOTTOM:3,
		LEFT:4,
        INSIDE: 5,
        OUTSIDE: 6
	};

	BackChart.BaseChart = Backbone.View.extend({

        defaults: {
            svgClassName: ''
        },

		initialize: function (options) {
            this.svgClassName = options.svgClassName || this.defaults.svgClassName;

			this.title = options.title;
			
			this.data = options.data;

			this.width = options.width;
			this.height = options.height;

			this.margin = options.margin;

			this.innerWidth = options.width - (this.margin.left + this.margin.right);
			this.innerHeight = options.height - (this.margin.top + this.margin.bottom);
		},

		createTitle: function () {
			if (this.title) {
				d3.select(this.el)
                    .append('div')
                        .classed('card-title clearfix', true)
                        .append('h3')
        					.text(this.title);
			}
		},

		createSVGElement: function() {
			this.svg = d3.select(this.el).append('svg')
				.classed(this.svgClassName, true)
				.style({
					// width        : (this.width + this.margin.left + this.margin.right) + 'px',
					// height       : (this.height + this.margin.top + this.margin.bottom) + 'px',
					width        : this.width + 'px',
					height       : this.height + 'px',
					'text-anchor':'middle'
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
        getValueText: function () {
            throw 'Not implemented';
        },
        getValueAttr: function () {
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

			this.createTitle();

			return this;
		}
	});

})();