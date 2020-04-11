var b2DebugDraw = function() {
this.__varz();
this.__constructor.apply(this, arguments);
}
b2DebugDraw.prototype.__constructor = function () {
		this.m_drawFlags = 0;
	}
b2DebugDraw.prototype.__varz = function(){
}
// static methods
// static attributes
b2DebugDraw.e_shapeBit =  0x0001;
b2DebugDraw.e_jointBit =  0x0002;
b2DebugDraw.e_aabbBit =  0x0004;
b2DebugDraw.e_pairBit =  0x0008;
b2DebugDraw.e_centerOfMassBit =  0x0010;
b2DebugDraw.e_controllerBit =  0x0020;
// methods
b2DebugDraw.prototype.SetFlags = function (flags) {
		this.m_drawFlags = flags;
	}
b2DebugDraw.prototype.GetFlags = function () {
		return this.m_drawFlags;
	}
b2DebugDraw.prototype.AppendFlags = function (flags) {
		this.m_drawFlags |= flags;
	}
b2DebugDraw.prototype.ClearFlags = function (flags) {
		this.m_drawFlags &= ~flags;
	}
b2DebugDraw.prototype.SetSprite = function (sprite) {
		this.m_sprite = sprite; 
	}
b2DebugDraw.prototype.GetSprite = function () {
		return this.m_sprite;
	}
b2DebugDraw.prototype.SetDrawScale = function (drawScale) {
		this.m_drawScale = drawScale; 
	}
b2DebugDraw.prototype.GetDrawScale = function () {
		return this.m_drawScale;
	}
b2DebugDraw.prototype.SetLineThickness = function (lineThickness) {
		this.m_lineThickness = lineThickness; 
	}
b2DebugDraw.prototype.GetLineThickness = function () {
		return this.m_lineThickness;
	}
b2DebugDraw.prototype.SetAlpha = function (alpha) {
		this.m_alpha = alpha; 
	}
b2DebugDraw.prototype.GetAlpha = function () {
		return this.m_alpha;
	}
b2DebugDraw.prototype.SetFillAlpha = function (alpha) {
		this.m_fillAlpha = alpha; 
	}
b2DebugDraw.prototype.GetFillAlpha = function () {
		return this.m_fillAlpha;
	}
b2DebugDraw.prototype.SetXFormScale = function (xformScale) {
		this.m_xformScale = xformScale; 
	}
b2DebugDraw.prototype.GetXFormScale = function () {
		return this.m_xformScale;
	}
	
b2DebugDraw.prototype.Clear = function() {
	this.m_sprite.clearRect(0, 0, this.m_sprite.canvas.width, this.m_sprite.canvas.height);
}

b2DebugDraw.prototype.Y = function(y) {
	return this.m_sprite.canvas.height - y;
}

b2DebugDraw.prototype.ToWorldPoint = function(localPoint) {
	return new b2Vec2(localPoint.x / this.m_drawScale, this.Y(localPoint.y)/this.m_drawScale);
}

b2DebugDraw.prototype.ColorStyle = function(color, alpha) {
	return "rgba("+color.r+", "+color.g +", " + color.b + ", " + alpha + ")";
}
	
b2DebugDraw.prototype.DrawPolygon = function (vertices, vertexCount, color) {
		
		this.m_sprite.graphics.lineStyle(this.m_lineThickness, color.color, this.m_alpha);
		this.m_sprite.graphics.moveTo(vertices[0].x * this.m_drawScale, vertices[0].y * this.m_drawScale);
		for (var i = 1; i < vertexCount; i++){
				this.m_sprite.graphics.lineTo(vertices[i].x * this.m_drawScale, vertices[i].y * this.m_drawScale);
		}
		this.m_sprite.graphics.lineTo(vertices[0].x * this.m_drawScale, vertices[0].y * this.m_drawScale);
		
	}
b2DebugDraw.prototype.DrawSolidPolygon = function (vertices, vertexCount, color) {
		this.m_sprite.strokeSyle = this.ColorStyle(color, this.m_alpha);
		this.m_sprite.lineWidth = this.m_lineThickness;
		this.m_sprite.fillStyle = this.ColorStyle(color, this.m_fillAlpha);
		
		this.m_sprite.beginPath();
		this.m_sprite.moveTo(vertices[0].x * this.m_drawScale, this.Y(vertices[0].y * this.m_drawScale));
		for (var i = 1; i < vertexCount; i++){
				this.m_sprite.lineTo(vertices[i].x * this.m_drawScale, this.Y(vertices[i].y * this.m_drawScale));
		}
		this.m_sprite.lineTo(vertices[0].x * this.m_drawScale, this.Y(vertices[0].y * this.m_drawScale));
		this.m_sprite.fill();
		this.m_sprite.stroke();
		this.m_sprite.closePath();
	}
b2DebugDraw.prototype.DrawCircle = function (center, radius, color) {
		
		this.m_sprite.graphics.lineStyle(this.m_lineThickness, color.color, this.m_alpha);
		this.m_sprite.graphics.drawCircle(center.x * this.m_drawScale, center.y * this.m_drawScale, radius * this.m_drawScale);
		
	}
b2DebugDraw.prototype.DrawSolidCircle = function (center, radius, axis, color) {
		this.m_sprite.strokeSyle = this.ColorStyle(color, this.m_alpha);
		this.m_sprite.lineWidth = this.m_lineThickness;
		this.m_sprite.fillStyle = this.ColorStyle(color, this.m_fillAlpha);
		
		this.m_sprite.beginPath();
		this.m_sprite.arc(center.x * this.m_drawScale, this.Y(center.y * this.m_drawScale), radius * this.m_drawScale, 0, Math.PI*2, true);
		this.m_sprite.fill();
		this.m_sprite.stroke();
		this.m_sprite.closePath();
	}
b2DebugDraw.prototype.DrawSegment = function (p1, p2, color) {
		
		this.m_sprite.lineWidth = this.m_lineThickness;
		this.m_sprite.strokeSyle = this.ColorStyle(color, this.m_alpha);
		this.m_sprite.beginPath();
		this.m_sprite.moveTo(p1.x * this.m_drawScale, this.Y(p1.y * this.m_drawScale));
		this.m_sprite.lineTo(p2.x * this.m_drawScale, this.Y(p2.y * this.m_drawScale));
		this.m_sprite.stroke();
		this.m_sprite.closePath();		
		
	}
b2DebugDraw.prototype.DrawTransform = function (xf) {
		this.m_sprite.lineWidth = this.m_lineThickness;
		
		this.m_sprite.strokeSyle = this.ColorStyle(new b2Color(255, 0, 0), this.m_alpha);
		this.m_sprite.beginPath();
		this.m_sprite.moveTo(xf.position.x * this.m_drawScale, this.Y(xf.position.y * this.m_drawScale));
		this.m_sprite.lineTo((xf.position.x + this.m_xformScale*xf.R.col1.x) * this.m_drawScale, this.Y((xf.position.y + this.m_xformScale*xf.R.col1.y) * this.m_drawScale));
		this.m_sprite.stroke();
		this.m_sprite.closePath();
		
		this.m_sprite.strokeSyle = this.ColorStyle(new b2Color(0, 255, 0), this.m_alpha);
		this.m_sprite.beginPath();
		this.m_sprite.moveTo(xf.position.x * this.m_drawScale, this.Y(xf.position.y * this.m_drawScale));
		this.m_sprite.lineTo((xf.position.x + this.m_xformScale*xf.R.col2.x) * this.m_drawScale, this.Y((xf.position.y + this.m_xformScale*xf.R.col2.y) * this.m_drawScale));
		this.m_sprite.stroke();
		this.m_sprite.closePath();
	}
// attributes
b2DebugDraw.prototype.m_drawFlags =  0;
b2DebugDraw.prototype.m_sprite =  null;
b2DebugDraw.prototype.m_drawScale =  1.0;
b2DebugDraw.prototype.m_lineThickness =  1.0;
b2DebugDraw.prototype.m_alpha =  1.0;
b2DebugDraw.prototype.m_fillAlpha =  1.0;
b2DebugDraw.prototype.m_xformScale =  1.0;