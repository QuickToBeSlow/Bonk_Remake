var b2Settings = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2Settings.prototype.__constructor = function(){}
b2Settings.prototype.__varz = function(){
}
// static methods
b2Settings.b2MixFriction = function (friction1, friction2) {
		return Math.sqrt(friction1 * friction2);
	}
b2Settings.b2MixRestitution = function (restitution1, restitution2) {
		return restitution1 > restitution2 ? restitution1 : restitution2;
	}
b2Settings.b2Assert = function (a) {
		if (!a){
			
			
			throw "Assertion Failed";
		}
	}
// static attributes
b2Settings.VERSION =  "2.1alpha";
b2Settings.USHRT_MAX =  0x0000ffff;
b2Settings.b2_pi =  Math.PI;
b2Settings.b2_maxManifoldPoints =  2;
b2Settings.b2_aabbExtension =  0.1;
b2Settings.b2_aabbMultiplier =  2.0;
b2Settings.b2_polygonRadius =  2.0 * b2Settings.b2_linearSlop;
b2Settings.b2_linearSlop =  0.005;
b2Settings.b2_angularSlop =  2.0 / 180.0 * b2Settings.b2_pi;
b2Settings.b2_toiSlop =  8.0 * b2Settings.b2_linearSlop;
b2Settings.b2_maxTOIContactsPerIsland =  32;
b2Settings.b2_maxTOIJointsPerIsland =  32;
b2Settings.b2_velocityThreshold =  1.0;
b2Settings.b2_maxLinearCorrection =  0.2;
b2Settings.b2_maxAngularCorrection =  8.0 / 180.0 * b2Settings.b2_pi;
b2Settings.b2_maxTranslation =  2.0;
b2Settings.b2_maxTranslationSquared =  b2Settings.b2_maxTranslation * b2Settings.b2_maxTranslation;
b2Settings.b2_maxRotation =  0.5 * b2Settings.b2_pi;
b2Settings.b2_maxRotationSquared =  b2Settings.b2_maxRotation * b2Settings.b2_maxRotation;
b2Settings.b2_contactBaumgarte =  0.2;
b2Settings.b2_timeToSleep =  0.5;
b2Settings.b2_linearSleepTolerance =  0.01;
b2Settings.b2_angularSleepTolerance =  2.0 / 180.0 * b2Settings.b2_pi;
// methods
// attributes