var b2Controller = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2Controller.prototype.__constructor = function(){}
b2Controller.prototype.__varz = function(){
}
// static methods
// static attributes
// methods
b2Controller.prototype.Step = function (step) {}
b2Controller.prototype.Draw = function (debugDraw) { }
b2Controller.prototype.AddBody = function (body) {
		var edge = new b2ControllerEdge();
		edge.controller = this;
		edge.body = body;
		
		edge.nextBody = m_bodyList;
		edge.prevBody = null;
		m_bodyList = edge;
		if (edge.nextBody)
			edge.nextBody.prevBody = edge;
		m_bodyCount++;
		
		edge.nextController = body.m_controllerList;
		edge.prevController = null;
		body.m_controllerList = edge;
		if (edge.nextController)
			edge.nextController.prevController = edge;
		body.m_controllerCount++;
	}
b2Controller.prototype.RemoveBody = function (body) {
		var edge = body.m_controllerList;
		while (edge && edge.controller != this)
			edge = edge.nextController;
			
		
		
		
		if (edge.prevBody)
			edge.prevBody.nextBody = edge.nextBody;
		if (edge.nextBody)
			edge.nextBody.prevBody = edge.prevBody;
		if (edge.nextController)
			edge.nextController.prevController = edge.prevController;
		if (edge.prevController)
			edge.prevController.nextController = edge.nextController;
		if (m_bodyList == edge)
			m_bodyList = edge.nextBody;
		if (body.m_controllerList == edge)
			body.m_controllerList = edge.nextController;
		body.m_controllerCount--;
		m_bodyCount--;
		
		
	}
b2Controller.prototype.Clear = function () {
		while (m_bodyList)
			this.RemoveBody(m_bodyList.body);
	}
b2Controller.prototype.GetNext = function () {return this.m_next;}
b2Controller.prototype.GetWorld = function () { return this.m_world; }
b2Controller.prototype.GetBodyList = function () {
		return m_bodyList;
	}
// attributes
b2Controller.prototype.m_next =  null;
b2Controller.prototype.m_prev =  null;
b2Controller.prototype.m_world =  null;