var app = app || {};

(function($) {

	var Bus = Backbone.Model.extend({
		defaults: {
			timerStarted: false,
			timer: ""
		},
		refresh: function() {
			this.set({
				timerStarted: false,
				departureTime: null,
				timer: null,
				arrivalTime: new Date() 
			});
		}
	});

	var Buses = Backbone.Collection.extend({
		model: Bus,
		localStorage: new Backbone.LocalStorage('amub-buses')
	});	

	var BusView = Backbone.View.extend({
		tagName: 'tr',

		template: _.template($('#bus-template').html()),

		events: {
			'click .start-timer': 'startTimer',
			'click .refresh-bus': 'refreshBus',
			'click .remove-bus': 'removeBus'
		},

		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		startTimer: function() {
			this.model.set({
				timerStarted: true,
				departureTime: Date.now(),
				timer: 0
			});
			this.model.save();
		},

		refreshBus: function() {
			this.model.refresh();
			this.model.save();
			app.buses.remove(this.model);
			app.buses.add(this.model, {at: 0, trigger: true});
		},

		removeBus: function() {
			this.model.destroy();
		}
	});

	var BusesView = Backbone.View.extend({
		el: '#content',

		template: _.template($('#buses-template').html()),

		initialize: function() {
			this.listenTo(app.buses, 'add', this.render);
			this.listenTo(app.buses, 'remove', this.render);
			this.listenTo(app.buses, 'fetch', this.render);
		},

		render: function() {
			var that = this;
			that.$el.html(this.template({buses: app.buses}));
			app.buses.each(function(bus) {
				that.$('table').append(
					new BusView({model: bus}).render().el
				);
			});
		}
	});

	var ControlPanelView = Backbone.View.extend({
		el: '#control-panel',

		events: {
			'click .btn-primary': 'addBus'
		},

		addBus: function() {
			var that = this;
			app.buses.create({
				name: that.$('input').val(),
				arrivalTime: Date.now()
			});
			that.$('input').val('');
		}
	})

	app.buses = new Buses(); // collection
	new ControlPanelView();
	new BusesView().render();
	app.buses.fetch();

	setInterval(function() {
		app.buses.each(function(bus) {
			if (bus.get('timerStarted')) {
				bus.set('timer', Date.now() - bus.get('departureTime'));
				bus.save();
			}
		});
	}, 1000);

})(jQuery);