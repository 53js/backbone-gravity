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
		return  function (callback, element) {
			(root.requestAnimationFrame			||
			root.webkitRequestAnimationFrame	||
			root.mozRequestAnimationFrame		||
			root.oRequestAnimationFrame			||
			root.msRequestAnimationFrame		||
			function (/* function */ callback, /* DOMElement */ element) {
				root.setTimeout(callback, BackboneGravity.Config.interval);
			})(callback, element);
		};
	})();

	BackboneGravity.Views = BackboneGravity.Views || {};

	var WorldView = BackboneGravity.Views.WorldView = Backbone.View.extend({

		bodies: {},

		initialize: function () {
			this.world = new B2.b2World(new B2.b2Vec2(0, 10), true);
		},

		debug: function () {
			if (this.debugCanvas) {
				$(this.debugCanvas).fadeOut('fast');
				this.debugCanvas = null;
				return;
			} else {
				this.debugCanvas = document.getElementById('debug');
				$(this.debugCanvas).fadeIn('fast');
				this.debugCanvas.height = this.$el.height();
				var debugDraw = new B2.b2DebugDraw();
				debugDraw.SetSprite(this.debugCanvas.getContext('2d'));
				debugDraw.SetDrawScale(BackboneGravity.Config.SCALE);
				debugDraw.SetFillAlpha(0.3);
				debugDraw.SetLineThickness(1.0);
				debugDraw.SetFlags(B2.b2DebugDraw.e_shapeBit | B2.b2DebugDraw.e_jointBit);
				this.world.SetDebugDraw(debugDraw);
				this.world.DrawDebugData();
			}
		},

		createBody: function (view, options) {
			if (!(view instanceof Backbone.View)) {
				options = _.extend({}, view);
				view = {};
			}
			var body = _.extend({}, Body, view);
			var opts = {};
			if (view instanceof Backbone.View) {
				_.extend(opts, {
					width: view.$el.outerWidth(),
					height: view.$el.outerHeight(),
					angle: Math.random() * 1.5 - 1.5
				});
			}
			_.extend(opts, options);
			body.create(this.world, opts);
			var cid = view.cid || options.cid;
			if (!cid) {
				throw 'You must provide a view or an options.cid';
			}
			this.bodies[cid] = body;
		},

		removeBody: function (view) {
			this.bodies[view.cid] = null;
		},

		resetBodies: function () {
			this.bodies = null;
		},

		t: 0,

		update: function () {
			if (this.stopped) {
				return;
			}

			this.started = true;
			this.world.Step(BackboneGravity.Config.step, 10, 10);

			_.each(this.bodies, _.bind(function (body) {
				body.update();
		    }, this));

		    this.world.ClearForces();
		    if (this.debugCanvas) {
				this.world.DrawDebugData();
			}
		   // if (this.t > 100)
		    //	this.stop();
		    this.t++;

		    BackboneGravity.loop(_.bind(this.update, this));
		},

		stop: function () {
			if (this.started) {
				this.stopped = true;
				this.started = false;
			}
		}

	});

	var Body = BackboneGravity.Body = {

		settings: {
			dynamic: true,
			density: 1.0,
			friction: 0.5,
			restitution: 0.2,
			x: 0,
			y: 0,
			angle: 0
		},

		create: function (world, options) {

			var settings = _.extend({}, this.settings, options);

			var fixDef = new B2.b2FixtureDef();
			fixDef.density = settings.density;
			fixDef.friction = settings.friction;
			fixDef.restitution = settings.restitution;
			fixDef.shape = new B2.b2PolygonShape();
			fixDef.shape.SetAsBox(settings.width / BackboneGravity.Config.SCALE / 2, settings.height / BackboneGravity.Config.SCALE / 2);
			
			var bodyDef = new B2.b2BodyDef();
			bodyDef.type = settings.dynamic ? B2.b2Body.b2_dynamicBody : B2.b2Body.b2_staticBody;
			bodyDef.position.x = settings.x / BackboneGravity.Config.SCALE;
			bodyDef.position.y = settings.y / BackboneGravity.Config.SCALE;
			bodyDef.angle = settings.angle;
			
			var body = this.body = world.CreateBody(bodyDef);
			body.CreateFixture(fixDef);

			return body;
		},

		getPosition: function () {
			var position = this.body.GetPosition();
			return {
				x: position.x * BackboneGravity.Config.SCALE,
				y: position.y * BackboneGravity.Config.SCALE
			};
		},

		setPosition: function (options) {
			//options.x = options.left ? options.x / BackboneGravity.Config.SCALE
			var position = this.body.GetPosition();
			_.extend(position, {
				x: options.x ? options.x / BackboneGravity.Config.SCALE : position.x,
				y: options.y ? options.y / BackboneGravity.Config.SCALE : position.y
			});
			this.body.SetPosition(new B2.b2Vec2(position.x, position.y));
			return position;
		},

		getAngle: function () {
			return this.body.GetAngle() * 180 / Math.PI;
		},

		update: function () {
			// Override in subclass
		}

	};


}).call(this);