(function () {
	'use strict';

	var root = this;

	var Backbone = root.Backbone,
	$ = root.Backbone.$,
	_ = root._;

	var BackboneGravity = root.BackboneGravity = root.BackboneGravity || {};
	BackboneGravity.Config = BackboneGravity.Config || {};
	BackboneGravity.Config.SCALE = 30;
	BackboneGravity.Config.interval = 1000 / 60;
	BackboneGravity.Config.step = 1 / 60;

	BackboneGravity.loop = (function () {
		return  root.requestAnimationFrame	||
		root.webkitRequestAnimationFrame	||
		root.mozRequestAnimationFrame		||
		root.oRequestAnimationFrame			||
		root.msRequestAnimationFrame		||
		function (/* function */ callback, /* DOMElement */ element) {
			root.setTimeout(callback, BackboneGravity.Config.interval);
		};
	})();

	BackboneGravity.Views = BackboneGravity.Views || {};

	var WorldView = BackboneGravity.Views.WorldView = Backbone.View.extend({

		bodies: [],

		initialize: function () {
			this.world = new B2.b2World(new B2.b2Vec2(0, 10), true);
		},

		createBody: function (view) {
			var body = _.extend({}, view, Body);
			body.createBody(this.world);
			this.bodies[view.cid] = body;
		},

		removeBody: function (view) {
			this.bodies[view.cid] = null;
		},

		resetBodies: function () {
			this.bodies = null;
		},

		update: function () {
			this.world.Step(BackboneGravity.Config.step, 10, 10);

			_.each(this.bodies, _.bind(function (body) {
				body.update();
		    }, this));

		    this.world.ClearForces();

		    BackboneGravity.loop(_.bind(this.update, this));
		}

	});

	var Body = BackboneGravity.Body = {

		createBody: function (world) {
			var width = this.$el.width(),
				height = this.$el.height();

			var fixDef = new B2.b2FixtureDef();
			fixDef.density = 1.0;
			fixDef.friction = 0.5;
			fixDef.restitution = 0.2;
			fixDef.shape = new B2.b2PolygonShape();
			fixDef.shape.SetAsBox(width / BackboneGravity.Config.SCALE / 2, height / BackboneGravity.Config.SCALE / 2);
			
			var bodyDef = new B2.b2BodyDef();
			bodyDef.type = B2.b2Body.b2_dynamicBody;
			bodyDef.position.x = 0;
			bodyDef.position.y = 0;
			bodyDef.angle = this.angle;
			
			var body = this.body = this.world.world.CreateBody(bodyDef);
			body.CreateFixture(fixDef);

			return body;
		},

		getPosition: function () {
			var position = this.body.GetPosition();
			return {
				x: position.x * BackboneGravity.Config.SCALE - this.$el.outerWidth() / 2,
				y: position.y * BackboneGravity.Config.SCALE - this.$el.outerHeight() / 2
			};
		},

		getAngle: function () {
			return this.body.GetAngle() * 180 / Math.PI;
		},

		update: function () {
			var position = this.getPosition();
			this.$el.css({
				left: position.x,
				top: position.y,
				transform: 'rotate(' + this.getAngle() + 'deg)'
			});
		}

	};


}).call(this);