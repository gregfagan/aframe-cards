webpackJsonp([1],{100:function(e,t,n){"use strict";var o=n(249);o.keys().forEach(o)},204:function(e,t,n){"use strict";var o=n(548);o.keys().forEach(o)},205:function(e,t,n){"use strict";n(14),n(208),n(209),n(100),n(204),n(551)},249:function(e,t,n){function o(e){return n(r(e))}function r(e){var t=i[e];if(!(t+1))throw new Error("Cannot find module '"+e+"'.");return t}var i={"./body-thickness.js":250,"./deck.js":251,"./grabbable.js":252,"./grabber.js":546,"./index.js":100,"./only-grab-once.js":547};o.keys=function(){return Object.keys(i)},o.resolve=r,e.exports=o,o.id=249},250:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(14);t.default=(0,o.registerComponent)("body-thickness",{dependencies:["dynamic-body"],schema:{type:"number",default:.2},init:function(){var e=this;this.el.body&&this.adjustBody(),this.el.addEventListener("body-loaded",function(){return e.adjustBody()})},adjustBody:function(){var e=this.el,t=this.data,n=e.body,o=e.components,r=e.sceneEl,i=o["dynamic-body"],a=i.wireframe,s=t/2,c=!0,u=!1,l=void 0;try{for(var d,f=n.shapes[Symbol.iterator]();!(c=(d=f.next()).done);c=!0){var v=d.value;if(v.halfExtents){var b=v.halfExtents.clone();b.z=s;var m=new CANNON.Box(b);n.shapes.length=0,n.addShape(m),a&&(r.object3D.remove(a),i.createWireframe(n,m),r.object3D.add(i.wireframe))}}}catch(e){u=!0,l=e}finally{try{!c&&f.return&&f.return()}finally{if(u)throw l}}}})},251:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(14);t.default=(0,o.registerComponent)("deck",{schema:{cards:{type:"array"}},init:function(){this.draw()},play:function(){},pause:function(){},remove:function(){},draw:function(){var e=this;console.log("draw");var t=this.el,n=this.data,o=t.sceneEl,r=n.cards,i=document.getElementById("hand"),a=i.components.constraint;if(r&&r.length&&!a){var s=r.shift(),c=i.getAttribute("position"),u=i.getAttribute("rotation");console.log("drawing "+s);var l=document.createElement("a-card");l.setAttribute("id",s),l.setAttribute("position",c),l.setAttribute("rotation",u),l.setAttribute("material","shader",s),l.addEventListener("body-loaded",function(){var t="constraint__"+s;console.log(l.body),i.setAttribute(t,{type:"lock",collideConnected:!1,target:"#"+s}),l.setAttribute("grabbable",!0),l.setAttribute("only-grab-once",!0),l.addEventListener("grab-begin",function(){i.removeAttribute(t)}),l.addEventListener("grab-end",function(){setTimeout(function(){return e.draw()},1e3)})}),o.appendChild(l)}}})},252:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(14),r=n(253),i=function(e){return e&&e.__esModule?e:{default:e}}(r);t.default=(0,o.registerComponent)("grabbable",{init:function(){var e=this,t=this.el;this.dragEvents=new i.default(t,function(t){var n=void 0;return t.do({next:function(t){n||(n=e.attachGrabber(t));var o=n.el.components["dynamic-body"];o&&(n.el.setAttribute("position",t),o.syncToPhysics())},complete:function(){return n.detach()},error:function(e){n.detach(),console.error(e)}})})},attachGrabber:function(e){var t=this.el,n=t.sceneEl,o=t.body;o.velocity.setZero(),o.angularVelocity.setZero();var r=document.createElement("a-grabber");r.setAttribute("position",e);var i=e.clone();return t.object3D.worldToLocal(i),r.setAttribute("constraint",{type:"pointToPoint",collideConnected:!1,target:"#"+t.id,targetPivot:i}),n.appendChild(r),t.emit("grab-begin",{target:t}),{el:r,detach:function(){n.removeChild(r),t.emit("grab-end",{target:t})}}},play:function(){this.subscription=this.dragEvents.subscribe()},pause:function(){this.subscription&&this.subscription.unsubscribe()},remove:function(){this.pause()}})},253:function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var r=n(14),i=n(101),a=function e(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(e){return e};o(this,e);var a=i.Observable.fromEvent(t,"mousedown"),s=i.Observable.fromEvent(t.sceneEl.canvas,"mousemove"),c=i.Observable.fromEvent(t,"mouseup");return a.switchMap(function(e){var t=e.detail,o=t.intersection,i=t.cursorEl,a=o.point,u=i.components.raycaster.raycaster.ray,l=i.object3D.localToWorld(new r.THREE.Vector3(0,0,1)).normalize(),d=new r.THREE.Plane(l,-1*a.length()),f=s.takeUntil(c).startWith(a).map(function(){return u.intersectPlane(d)});return n(f)})};t.default=a},546:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(14);t.default=(0,o.registerComponent)("grabber",{init:function(){var e=this.el;e.addEventListener("body-loaded",function(){e.body.collisionResponse=!1})}})},547:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(14),r=n(101);t.default=(0,o.registerComponent)("only-grab-once",{init:function(){this.observable=r.Observable.fromEvent(this.el,"grab-end").take(1)},play:function(){var e=this.el;this.subscription=this.observable.subscribe(function(){e.removeAttribute("grabbable")})},pause:function(){this.subscription.unsubscribe(),this.subscription=null},remove:function(){this.pause(),this.observable=null}})},548:function(e,t,n){function o(e){return n(r(e))}function r(e){var t=i[e];if(!(t+1))throw new Error("Cannot find module '"+e+"'.");return t}var i={"./a-card.js":549,"./a-grabber.js":550,"./index.js":204};o.keys=function(){return Object.keys(i)},o.resolve=r,e.exports=o,o.id=548},549:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(14);t.default=(0,o.registerPrimitive)("a-card",{defaultComponents:{geometry:{primitive:"plane",width:.0635,height:.0889},material:{shader:"void",side:"double"},"dynamic-body":{mass:1,linearDamping:.1,angularDamping:.5},"body-thickness":.0025}})},550:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(14);t.default=(0,o.registerPrimitive)("a-grabber",{defaultComponents:{"static-body":{shape:"sphere",sphereRadius:.002},grabber:!0}})},551:function(e,t,n){"use strict";var o=n(14),r=n(552);r.keys().forEach(function(e){var t=/\.\/(.*)\.glsl/i.exec(e)[1];(0,o.registerShader)(t,{schema:{color:{type:"color",is:"uniform",default:"#333333"},secondaryColor:{type:"color",is:"uniform",default:"#CCCCCC"},opacity:{type:"number",is:"uniform",default:1}},fragmentShader:r(e),vertexShader:"\nvarying vec2 vUv;\nvoid main() {\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}\n"})})},552:function(e,t,n){function o(e){return n(r(e))}function r(e){var t=i[e];if(!(t+1))throw new Error("Cannot find module '"+e+"'.");return t}var i={"./death.glsl":553,"./justice.glsl":554,"./strength.glsl":555,"./the-wall.glsl":556,"./void.glsl":557};o.keys=function(){return Object.keys(i)},o.resolve=r,e.exports=o,o.id=552},553:function(e,t){e.exports="uniform vec3 color;\nuniform vec3 secondaryColor;\nuniform float opacity;\n\nvarying vec2 vUv;\n\nvoid main() {\n  float mixture = step(.5, (vUv.x + vUv.y) * .5);\n  gl_FragColor = vec4(mix(color, secondaryColor, mixture), opacity);\n}"},554:function(e,t){e.exports="uniform vec3 color;\nuniform vec3 secondaryColor;\nuniform float opacity;\n\nvarying vec2 vUv;\n\nvoid main() {\n  gl_FragColor = vec4(mix(color, secondaryColor, step(0.5, vUv.x)), opacity);\n}"},555:function(e,t){e.exports="uniform vec3 color;\nuniform vec3 secondaryColor;\nuniform float opacity;\n\nvarying vec2 vUv;\n\n#define PI 3.14159265359\n\nvoid main() {\n  float mixture = step(.5 + .15 * cos((vUv.y - 0.15) * 1.6 * PI), vUv.x);\n  gl_FragColor = vec4(mix(color, secondaryColor, mixture), opacity);\n}"},556:function(e,t){e.exports="uniform vec3 color;\nuniform vec3 secondaryColor;\nuniform float opacity;\n\nvarying vec2 vUv;\n\nfloat stroke(float x, float s, float w) {\n  float d = step(s, x + w * .5) - step(s, x - w * .5);\n  return clamp(d, 0., 1.);\n}\n\nvoid main() {\n  float mixture = stroke(vUv.x, .5, .15);\n  gl_FragColor = vec4(mix(color, secondaryColor, mixture), opacity);\n}"},557:function(e,t){e.exports="uniform vec3 color;\nuniform float opacity;\n\nvoid main() {\n  gl_FragColor = vec4(color, opacity);\n}"}},[205]);