(function(){"use strict";var e=this,i=e.Backbone,o=(e.Backbone.$,e._),t=e.BackboneGravity||{};t.Config=t.Config||{},t.Config.SCALE=30,t.Config.interval=1e3/60,t.Config.step=1/60,t.loop=function(){return e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.oRequestAnimationFrame||e.msRequestAnimationFrame||function(i){e.setTimeout(i,t.Config.interval)}}(),t.Views=t.Views||{},t.Views.WorldView=i.View.extend({bodies:[],initialize:function(){this.world=new B2.b2World(new B2.b2Vec2(0,10),!0)},createBody:function(e){var i=o.extend({},e,n);i.createBody(this.world),this.bodies[e.cid]=i},removeBody:function(e){this.bodies[e.cid]=null},resetBodies:function(){this.bodies=null},update:function(){this.world.Step(t.Config.step,10,10),o.each(this.bodies,o.bind(function(e){e.update()},this)),this.world.ClearForces(),t.loop(o.bind(this.update,this))}});var n=t.Body={createBody:function(){var e=this.$el.width(),i=this.$el.height(),o=new B2.b2FixtureDef;o.density=1,o.friction=.5,o.restitution=.2,o.shape=new B2.b2PolygonShape,o.shape.SetAsBox(e/t.Config.SCALE/2,i/t.Config.SCALE/2);var n=new B2.b2BodyDef;n.type=B2.b2Body.b2_dynamicBody,n.position.x=0,n.position.y=0,n.angle=this.angle;var s=this.body=this.world.world.CreateBody(n);return s.CreateFixture(o),s},getPosition:function(){var e=this.body.GetPosition();return{x:e.x*t.Config.SCALE-this.$el.outerWidth()/2,y:e.y*t.Config.SCALE-this.$el.outerHeight()/2}},getAngle:function(){return 180*this.body.GetAngle()/Math.PI},update:function(){var e=this.getPosition();this.$el.css({left:e.x,top:e.y,transform:"rotate("+this.getAngle()+"deg)"})}}}).call(this),function(){"use strict";window.B2={b2Vec2:Box2D.Common.Math.b2Vec2,b2AABB:Box2D.Collision.b2AABB,b2BodyDef:Box2D.Dynamics.b2BodyDef,b2Body:Box2D.Dynamics.b2Body,b2FixtureDef:Box2D.Dynamics.b2FixtureDef,b2Fixture:Box2D.Dynamics.b2Fixture,b2World:Box2D.Dynamics.b2World,b2MassData:Box2D.Collision.Shapes.b2MassData,b2PolygonShape:Box2D.Collision.Shapes.b2PolygonShape,b2CircleShape:Box2D.Collision.Shapes.b2CircleShape,b2DebugDraw:Box2D.Dynamics.b2DebugDraw,b2MouseJointDef:Box2D.Dynamics.Joints.b2MouseJointDef}}();