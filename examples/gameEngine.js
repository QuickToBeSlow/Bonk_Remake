(function(){

	var Test = function() {
		this.__constructor(arguments);
	}
	
	var supaSpeed =1; //set supaSpeed to 1 when the page is loaded.
	var convnetjs=convnetjs||{REVISION:"ALPHA"};(function(d){var k=false;var e=0;var l=function(){if(k){k=false;return e}var q=2*Math.random()-1;var p=2*Math.random()-1;var s=q*q+p*p;if(s==0||s>1){return l()}var t=Math.sqrt(-2*Math.log(s)/s);e=p*t;k=true;return q*t};var i=function(q,p){return Math.random()*(p-q)+q};var g=function(q,p){return Math.floor(Math.random()*(p-q)+q)};var c=function(q,p){return q+l()*p};var f=function(r){if(typeof(r)==="undefined"||isNaN(r)){return[]}if(typeof ArrayBuffer==="undefined"){var p=new Array(r);for(var q=0;q<r;q++){p[q]=0}return p}else{return new Float64Array(r)}};var n=function(p,q){for(var r=0,s=p.length;r<s;r++){if(p[r]===q){return true}}return false};var o=function(q){var p=[];for(var r=0,s=q.length;r<s;r++){if(!n(p,q[r])){p.push(q[r])}}return p};var b=function(q){if(q.length===0){return{}}var p=q[0];var s=q[0];var r=0;var u=0;var v=q.length;for(var t=1;t<v;t++){if(q[t]>p){p=q[t];r=t}if(q[t]<s){s=q[t];u=t}}return{maxi:r,maxv:p,mini:u,minv:s,dv:p-s}};var j=function(v){var s=v,r=0,p;var u=[];for(var t=0;t<v;t++){u[t]=t}while(s--){r=Math.floor(Math.random()*(s+1));p=u[s];u[s]=u[r];u[r]=p}return u};var h=function(q,v){var t=i(0,1);var s=0;for(var r=0,u=q.length;r<u;r++){s+=v[r];if(t<s){return q[r]}}};var m=function(s,t,p){if(typeof t==="string"){return(typeof s[t]!=="undefined")?s[t]:p}else{var q=p;for(var r=0;r<t.length;r++){var u=t[r];if(typeof s[u]!=="undefined"){q=s[u]}}return q}};function a(q,p){if(!q){p=p||"Assertion failed";if(typeof Error!=="undefined"){throw new Error(p)}throw p}}d.randf=i;d.randi=g;d.randn=c;d.zeros=f;d.maxmin=b;d.randperm=j;d.weightedSample=h;d.arrUnique=o;d.arrContains=n;d.getopt=m;d.assert=a})(convnetjs);(function(b){var a=function(k,g,f,j){if(Object.prototype.toString.call(k)==="[object Array]"){this.sx=1;this.sy=1;this.depth=k.length;this.w=b.zeros(this.depth);this.dw=b.zeros(this.depth);for(var d=0;d<this.depth;d++){this.w[d]=k[d]}}else{this.sx=k;this.sy=g;this.depth=f;var h=k*g*f;this.w=b.zeros(h);this.dw=b.zeros(h);if(typeof j==="undefined"){var e=Math.sqrt(1/(k*g*f));for(var d=0;d<h;d++){this.w[d]=b.randn(0,e)}}else{for(var d=0;d<h;d++){this.w[d]=j}}}};a.prototype={get:function(c,g,f){var e=((this.sx*g)+c)*this.depth+f;return this.w[e]},set:function(c,h,g,f){var e=((this.sx*h)+c)*this.depth+g;this.w[e]=f},add:function(c,h,g,f){var e=((this.sx*h)+c)*this.depth+g;this.w[e]+=f},get_grad:function(c,g,f){var e=((this.sx*g)+c)*this.depth+f;return this.dw[e]},set_grad:function(c,h,g,f){var e=((this.sx*h)+c)*this.depth+g;this.dw[e]=f},add_grad:function(c,h,g,f){var e=((this.sx*h)+c)*this.depth+g;this.dw[e]+=f},cloneAndZero:function(){return new a(this.sx,this.sy,this.depth,0)},clone:function(){var c=new a(this.sx,this.sy,this.depth,0);var e=this.w.length;for(var d=0;d<e;d++){c.w[d]=this.w[d]}return c},addFrom:function(c){for(var d=0;d<this.w.length;d++){this.w[d]+=c.w[d]}},addFromScaled:function(d,c){for(var e=0;e<this.w.length;e++){this.w[e]+=c*d.w[e]}},setConst:function(c){for(var d=0;d<this.w.length;d++){this.w[d]=c}},toJSON:function(){var c={};c.sx=this.sx;c.sy=this.sy;c.depth=this.depth;c.w=this.w;return c},fromJSON:function(d){this.sx=d.sx;this.sy=d.sy;this.depth=d.depth;var e=this.sx*this.sy*this.depth;this.w=b.zeros(e);this.dw=b.zeros(e);for(var c=0;c<e;c++){this.w[c]=d.w[c]}}};b.Vol=a})(convnetjs);(function(c){var a=c.Vol;var b=function(f,h,n,m,g){if(typeof(g)==="undefined"){var g=false}if(typeof(n)==="undefined"){var n=c.randi(0,f.sx-h)}if(typeof(m)==="undefined"){var m=c.randi(0,f.sy-h)}var e;if(h!==f.sx||n!==0||m!==0){e=new a(h,h,f.depth,0);for(var l=0;l<h;l++){for(var k=0;k<h;k++){if(l+n<0||l+n>=f.sx||k+m<0||k+m>=f.sy){continue}for(var j=0;j<f.depth;j++){e.set(l,k,j,f.get(l+n,k+m,j))}}}}else{e=f}if(g){var i=e.cloneAndZero();for(var l=0;l<e.sx;l++){for(var k=0;k<e.sy;k++){for(var j=0;j<e.depth;j++){i.set(l,k,j,e.get(e.sx-l-1,k,j))}}}e=i}return e};var d=function(o,n){if(typeof(n)==="undefined"){var n=false}var h=document.createElement("canvas");h.width=o.width;h.height=o.height;var u=h.getContext("2d");try{u.drawImage(o,0,0)}catch(q){if(q.name==="NS_ERROR_NOT_AVAILABLE"){return false}else{throw q}}try{var v=u.getImageData(0,0,h.width,h.height)}catch(q){if(q.name==="IndexSizeError"){return false}else{throw q}}var g=v.data;var k=o.width;var s=o.height;var t=[];for(var m=0;m<g.length;m++){t.push(g[m]/255-0.5)}var r=new a(k,s,4,0);r.w=t;if(n){var f=new a(k,s,1,0);for(var m=0;m<k;m++){for(var l=0;l<s;l++){f.set(m,l,0,r.get(m,l,0))}}r=f}return r};c.augment=b;c.img_to_vol=d})(convnetjs);(function(c){var a=c.Vol;var d=function(g){var g=g||{};this.out_depth=g.filters;this.sx=g.sx;this.in_depth=g.in_depth;this.in_sx=g.in_sx;this.in_sy=g.in_sy;this.sy=typeof g.sy!=="undefined"?g.sy:this.sx;this.stride=typeof g.stride!=="undefined"?g.stride:1;this.pad=typeof g.pad!=="undefined"?g.pad:0;this.l1_decay_mul=typeof g.l1_decay_mul!=="undefined"?g.l1_decay_mul:0;this.l2_decay_mul=typeof g.l2_decay_mul!=="undefined"?g.l2_decay_mul:1;this.out_sx=Math.floor((this.in_sx+this.pad*2-this.sx)/this.stride+1);this.out_sy=Math.floor((this.in_sy+this.pad*2-this.sy)/this.stride+1);this.layer_type="conv";var e=typeof g.bias_pref!=="undefined"?g.bias_pref:0;this.filters=[];for(var f=0;f<this.out_depth;f++){this.filters.push(new a(this.sx,this.sy,this.in_depth))}this.biases=new a(1,1,this.out_depth,e)};d.prototype={forward:function(h,k){this.in_act=h;var q=new a(this.out_sx|0,this.out_sy|0,this.out_depth|0,0);var w=h.sx|0;var u=h.sy|0;var r=this.stride|0;for(var t=0;t<this.out_depth;t++){var s=this.filters[t];var n=-this.pad|0;var l=-this.pad|0;for(var m=0;m<this.out_sy;l+=r,m++){n=-this.pad|0;for(var o=0;o<this.out_sx;n+=r,o++){var v=0;for(var e=0;e<s.sy;e++){var i=l+e;for(var g=0;g<s.sx;g++){var j=n+g;if(i>=0&&i<u&&j>=0&&j<w){for(var p=0;p<s.depth;p++){v+=s.w[((s.sx*e)+g)*s.depth+p]*h.w[((w*i)+j)*h.depth+p]}}}}v+=this.biases.w[t];q.set(o,m,t,v)}}}this.out_act=q;return this.out_act},backward:function(){var i=this.in_act;i.dw=c.zeros(i.w.length);var w=i.sx|0;var v=i.sy|0;var q=this.stride|0;for(var t=0;t<this.out_depth;t++){var r=this.filters[t];var n=-this.pad|0;var l=-this.pad|0;for(var m=0;m<this.out_sy;l+=q,m++){n=-this.pad|0;for(var o=0;o<this.out_sx;n+=q,o++){var e=this.out_act.get_grad(o,m,t);for(var g=0;g<r.sy;g++){var j=l+g;for(var h=0;h<r.sx;h++){var k=n+h;if(j>=0&&j<v&&k>=0&&k<w){for(var p=0;p<r.depth;p++){var u=((w*j)+k)*i.depth+p;var s=((r.sx*g)+h)*r.depth+p;r.dw[s]+=i.w[u]*e;i.dw[u]+=r.w[s]*e}}}}this.biases.dw[t]+=e}}}},getParamsAndGrads:function(){var e=[];for(var f=0;f<this.out_depth;f++){e.push({params:this.filters[f].w,grads:this.filters[f].dw,l2_decay_mul:this.l2_decay_mul,l1_decay_mul:this.l1_decay_mul})}e.push({params:this.biases.w,grads:this.biases.dw,l1_decay_mul:0,l2_decay_mul:0});return e},toJSON:function(){var f={};f.sx=this.sx;f.sy=this.sy;f.stride=this.stride;f.in_depth=this.in_depth;f.out_depth=this.out_depth;f.out_sx=this.out_sx;f.out_sy=this.out_sy;f.layer_type=this.layer_type;f.l1_decay_mul=this.l1_decay_mul;f.l2_decay_mul=this.l2_decay_mul;f.pad=this.pad;f.filters=[];for(var e=0;e<this.filters.length;e++){f.filters.push(this.filters[e].toJSON())}f.biases=this.biases.toJSON();return f},fromJSON:function(g){this.out_depth=g.out_depth;this.out_sx=g.out_sx;this.out_sy=g.out_sy;this.layer_type=g.layer_type;this.sx=g.sx;this.sy=g.sy;this.stride=g.stride;this.in_depth=g.in_depth;this.filters=[];this.l1_decay_mul=typeof g.l1_decay_mul!=="undefined"?g.l1_decay_mul:1;this.l2_decay_mul=typeof g.l2_decay_mul!=="undefined"?g.l2_decay_mul:1;this.pad=typeof g.pad!=="undefined"?g.pad:0;for(var f=0;f<g.filters.length;f++){var e=new a(0,0,0,0);e.fromJSON(g.filters[f]);this.filters.push(e)}this.biases=new a(0,0,0,0);this.biases.fromJSON(g.biases)}};var b=function(g){var g=g||{};this.out_depth=typeof g.num_neurons!=="undefined"?g.num_neurons:g.filters;this.l1_decay_mul=typeof g.l1_decay_mul!=="undefined"?g.l1_decay_mul:0;this.l2_decay_mul=typeof g.l2_decay_mul!=="undefined"?g.l2_decay_mul:1;this.num_inputs=g.in_sx*g.in_sy*g.in_depth;this.out_sx=1;this.out_sy=1;this.layer_type="fc";var e=typeof g.bias_pref!=="undefined"?g.bias_pref:0;this.filters=[];for(var f=0;f<this.out_depth;f++){this.filters.push(new a(1,1,this.num_inputs))}this.biases=new a(1,1,this.out_depth,e)};b.prototype={forward:function(h,l){this.in_act=h;var f=new a(1,1,this.out_depth,0);var k=h.w;for(var j=0;j<this.out_depth;j++){var g=0;var e=this.filters[j].w;for(var m=0;m<this.num_inputs;m++){g+=k[m]*e[m]}g+=this.biases.w[j];f.w[j]=g}this.out_act=f;return this.out_act},backward:function(){var e=this.in_act;e.dw=c.zeros(e.w.length);for(var f=0;f<this.out_depth;f++){var h=this.filters[f];var g=this.out_act.dw[f];for(var j=0;j<this.num_inputs;j++){e.dw[j]+=h.w[j]*g;h.dw[j]+=e.w[j]*g}this.biases.dw[f]+=g}},getParamsAndGrads:function(){var e=[];for(var f=0;f<this.out_depth;f++){e.push({params:this.filters[f].w,grads:this.filters[f].dw,l1_decay_mul:this.l1_decay_mul,l2_decay_mul:this.l2_decay_mul})}e.push({params:this.biases.w,grads:this.biases.dw,l1_decay_mul:0,l2_decay_mul:0});return e},toJSON:function(){var f={};f.out_depth=this.out_depth;f.out_sx=this.out_sx;f.out_sy=this.out_sy;f.layer_type=this.layer_type;f.num_inputs=this.num_inputs;f.l1_decay_mul=this.l1_decay_mul;f.l2_decay_mul=this.l2_decay_mul;f.filters=[];for(var e=0;e<this.filters.length;e++){f.filters.push(this.filters[e].toJSON())}f.biases=this.biases.toJSON();return f},fromJSON:function(g){this.out_depth=g.out_depth;this.out_sx=g.out_sx;this.out_sy=g.out_sy;this.layer_type=g.layer_type;this.num_inputs=g.num_inputs;this.l1_decay_mul=typeof g.l1_decay_mul!=="undefined"?g.l1_decay_mul:1;this.l2_decay_mul=typeof g.l2_decay_mul!=="undefined"?g.l2_decay_mul:1;this.filters=[];for(var f=0;f<g.filters.length;f++){var e=new a(0,0,0,0);e.fromJSON(g.filters[f]);this.filters.push(e)}this.biases=new a(0,0,0,0);this.biases.fromJSON(g.biases)}};c.ConvLayer=d;c.FullyConnLayer=b})(convnetjs);(function(c){var a=c.Vol;var b=function(d){var d=d||{};this.sx=d.sx;this.in_depth=d.in_depth;this.in_sx=d.in_sx;this.in_sy=d.in_sy;this.sy=typeof d.sy!=="undefined"?d.sy:this.sx;this.stride=typeof d.stride!=="undefined"?d.stride:2;this.pad=typeof d.pad!=="undefined"?d.pad:0;this.out_depth=this.in_depth;this.out_sx=Math.floor((this.in_sx+this.pad*2-this.sx)/this.stride+1);this.out_sy=Math.floor((this.in_sy+this.pad*2-this.sy)/this.stride+1);this.layer_type="pool";this.switchx=c.zeros(this.out_sx*this.out_sy*this.out_depth);this.switchy=c.zeros(this.out_sx*this.out_sy*this.out_depth)};b.prototype={forward:function(l,u){this.in_act=l;var h=new a(this.out_sx,this.out_sy,this.out_depth,0);var i=0;for(var p=0;p<this.out_depth;p++){var s=-this.pad;var q=-this.pad;for(var e=0;e<this.out_sx;s+=this.stride,e++){q=-this.pad;for(var w=0;w<this.out_sy;q+=this.stride,w++){var r=-99999;var o=-1,k=-1;for(var m=0;m<this.sx;m++){for(var j=0;j<this.sy;j++){var f=q+j;var g=s+m;if(f>=0&&f<l.sy&&g>=0&&g<l.sx){var t=l.get(g,f,p);if(t>r){r=t;o=g;k=f}}}}this.switchx[i]=o;this.switchy[i]=k;i++;h.set(e,w,p,r)}}}this.out_act=h;return this.out_act},backward:function(){var h=this.in_act;h.dw=c.zeros(h.w.length);var f=this.out_act;var g=0;for(var j=0;j<this.out_depth;j++){var l=-this.pad;var k=-this.pad;for(var e=0;e<this.out_sx;l+=this.stride,e++){k=-this.pad;for(var m=0;m<this.out_sy;k+=this.stride,m++){var i=this.out_act.get_grad(e,m,j);h.add_grad(this.switchx[g],this.switchy[g],j,i);g++}}}},getParamsAndGrads:function(){return[]},toJSON:function(){var d={};d.sx=this.sx;d.sy=this.sy;d.stride=this.stride;d.in_depth=this.in_depth;d.out_depth=this.out_depth;d.out_sx=this.out_sx;d.out_sy=this.out_sy;d.layer_type=this.layer_type;d.pad=this.pad;return d},fromJSON:function(d){this.out_depth=d.out_depth;this.out_sx=d.out_sx;this.out_sy=d.out_sy;this.layer_type=d.layer_type;this.sx=d.sx;this.sy=d.sy;this.stride=d.stride;this.in_depth=d.in_depth;this.pad=typeof d.pad!=="undefined"?d.pad:0;this.switchx=c.zeros(this.out_sx*this.out_sy*this.out_depth);this.switchy=c.zeros(this.out_sx*this.out_sy*this.out_depth)}};c.PoolLayer=b})(convnetjs);(function(c){var a=c.Vol;var d=c.getopt;var b=function(e){var e=e||{};this.out_depth=d(e,["out_depth","depth"],0);this.out_sx=d(e,["out_sx","sx","width"],1);this.out_sy=d(e,["out_sy","sy","height"],1);this.layer_type="input"};b.prototype={forward:function(e,f){this.in_act=e;this.out_act=e;return this.out_act},backward:function(){},getParamsAndGrads:function(){return[]},toJSON:function(){var e={};e.out_depth=this.out_depth;e.out_sx=this.out_sx;e.out_sy=this.out_sy;e.layer_type=this.layer_type;return e},fromJSON:function(e){this.out_depth=e.out_depth;this.out_sx=e.out_sx;this.out_sy=e.out_sy;this.layer_type=e.layer_type}};c.InputLayer=b})(convnetjs);(function(e){var a=e.Vol;var c=function(f){var f=f||{};this.num_inputs=f.in_sx*f.in_sy*f.in_depth;this.out_depth=this.num_inputs;this.out_sx=1;this.out_sy=1;this.layer_type="softmax"};c.prototype={forward:function(h,o){this.in_act=h;var f=new a(1,1,this.out_depth,0);var j=h.w;var k=h.w[0];for(var l=1;l<this.out_depth;l++){if(j[l]>k){k=j[l]}}var n=e.zeros(this.out_depth);var g=0;for(var l=0;l<this.out_depth;l++){var m=Math.exp(j[l]-k);g+=m;n[l]=m}for(var l=0;l<this.out_depth;l++){n[l]/=g;f.w[l]=n[l]}this.es=n;this.out_act=f;return this.out_act},backward:function(k){var f=this.in_act;f.dw=e.zeros(f.w.length);for(var h=0;h<this.out_depth;h++){var g=h===k?1:0;var j=-(g-this.es[h]);f.dw[h]=j}return -Math.log(this.es[k])},getParamsAndGrads:function(){return[]},toJSON:function(){var f={};f.out_depth=this.out_depth;f.out_sx=this.out_sx;f.out_sy=this.out_sy;f.layer_type=this.layer_type;f.num_inputs=this.num_inputs;return f},fromJSON:function(f){this.out_depth=f.out_depth;this.out_sx=f.out_sx;this.out_sy=f.out_sy;this.layer_type=f.layer_type;this.num_inputs=f.num_inputs}};var d=function(f){var f=f||{};this.num_inputs=f.in_sx*f.in_sy*f.in_depth;this.out_depth=this.num_inputs;this.out_sx=1;this.out_sy=1;this.layer_type="regression"};d.prototype={forward:function(f,g){this.in_act=f;this.out_act=f;return f},backward:function(l){var f=this.in_act;f.dw=e.zeros(f.w.length);var k=0;if(l instanceof Array||l instanceof Float64Array){for(var j=0;j<this.out_depth;j++){var g=f.w[j]-l[j];f.dw[j]=g;k+=0.5*g*g}}else{if(typeof l==="number"){var g=f.w[0]-l;f.dw[0]=g;k+=0.5*g*g}else{var j=l.dim;var h=l.val;var g=f.w[j]-h;f.dw[j]=g;k+=0.5*g*g}}return k},getParamsAndGrads:function(){return[]},toJSON:function(){var f={};f.out_depth=this.out_depth;f.out_sx=this.out_sx;f.out_sy=this.out_sy;f.layer_type=this.layer_type;f.num_inputs=this.num_inputs;return f},fromJSON:function(f){this.out_depth=f.out_depth;this.out_sx=f.out_sx;this.out_sy=f.out_sy;this.layer_type=f.layer_type;this.num_inputs=f.num_inputs}};var b=function(f){var f=f||{};this.num_inputs=f.in_sx*f.in_sy*f.in_depth;this.out_depth=this.num_inputs;this.out_sx=1;this.out_sy=1;this.layer_type="svm"};b.prototype={forward:function(f,g){this.in_act=f;this.out_act=f;return f},backward:function(m){var g=this.in_act;g.dw=e.zeros(g.w.length);var f=g.w[m];var k=1;var j=0;for(var h=0;h<this.out_depth;h++){if(m===h){continue}var l=-f+g.w[h]+k;if(l>0){g.dw[h]+=1;g.dw[m]-=1;j+=l}}return j},getParamsAndGrads:function(){return[]},toJSON:function(){var f={};f.out_depth=this.out_depth;f.out_sx=this.out_sx;f.out_sy=this.out_sy;f.layer_type=this.layer_type;f.num_inputs=this.num_inputs;return f},fromJSON:function(f){this.out_depth=f.out_depth;this.out_sx=f.out_sx;this.out_sy=f.out_sy;this.layer_type=f.layer_type;this.num_inputs=f.num_inputs}};e.RegressionLayer=d;e.SoftmaxLayer=c;e.SVMLayer=b})(convnetjs);(function(d){var a=d.Vol;var e=function(h){var h=h||{};this.out_sx=h.in_sx;this.out_sy=h.in_sy;this.out_depth=h.in_depth;this.layer_type="relu"};e.prototype={forward:function(j,l){this.in_act=j;var h=j.clone();var m=j.w.length;var n=h.w;for(var k=0;k<m;k++){if(n[k]<0){n[k]=0}}this.out_act=h;return this.out_act},backward:function(){var j=this.in_act;var h=this.out_act;var l=j.w.length;j.dw=d.zeros(l);for(var k=0;k<l;k++){if(h.w[k]<=0){j.dw[k]=0}else{j.dw[k]=h.dw[k]}}},getParamsAndGrads:function(){return[]},toJSON:function(){var h={};h.out_depth=this.out_depth;h.out_sx=this.out_sx;h.out_sy=this.out_sy;h.layer_type=this.layer_type;return h},fromJSON:function(h){this.out_depth=h.out_depth;this.out_sx=h.out_sx;this.out_sy=h.out_sy;this.layer_type=h.layer_type}};var g=function(h){var h=h||{};this.out_sx=h.in_sx;this.out_sy=h.in_sy;this.out_depth=h.in_depth;this.layer_type="sigmoid"};g.prototype={forward:function(j,m){this.in_act=j;var h=j.cloneAndZero();var n=j.w.length;var o=h.w;var l=j.w;for(var k=0;k<n;k++){o[k]=1/(1+Math.exp(-l[k]))}this.out_act=h;return this.out_act},backward:function(){var j=this.in_act;var h=this.out_act;var m=j.w.length;j.dw=d.zeros(m);for(var k=0;k<m;k++){var l=h.w[k];j.dw[k]=l*(1-l)*h.dw[k]}},getParamsAndGrads:function(){return[]},toJSON:function(){var h={};h.out_depth=this.out_depth;h.out_sx=this.out_sx;h.out_sy=this.out_sy;h.layer_type=this.layer_type;return h},fromJSON:function(h){this.out_depth=h.out_depth;this.out_sx=h.out_sx;this.out_sy=h.out_sy;this.layer_type=h.layer_type}};var f=function(h){var h=h||{};this.group_size=typeof h.group_size!=="undefined"?h.group_size:2;this.out_sx=h.in_sx;this.out_sy=h.in_sy;this.out_depth=Math.floor(h.in_depth/this.group_size);this.layer_type="maxout";this.switches=d.zeros(this.out_sx*this.out_sy*this.out_depth)};f.prototype={forward:function(l,w){this.in_act=l;var q=this.out_depth;var v=new a(this.out_sx,this.out_sy,this.out_depth,0);if(this.out_sx===1&&this.out_sy===1){for(var p=0;p<q;p++){var m=p*this.group_size;var u=l.w[m];var r=0;for(var o=1;o<this.group_size;o++){var h=l.w[m+o];if(h>u){u=h;r=o}}v.w[p]=u;this.switches[p]=m+r}}else{var k=0;for(var t=0;t<l.sx;t++){for(var s=0;s<l.sy;s++){for(var p=0;p<q;p++){var m=p*this.group_size;var u=l.get(t,s,m);var r=0;for(var o=1;o<this.group_size;o++){var h=l.get(t,s,m+o);if(h>u){u=h;r=o}}v.set(t,s,p,u);this.switches[k]=m+r;k++}}}}this.out_act=v;return this.out_act},backward:function(){var k=this.in_act;var j=this.out_act;var o=this.out_depth;k.dw=d.zeros(k.w.length);if(this.out_sx===1&&this.out_sy===1){for(var l=0;l<o;l++){var m=j.dw[l];k.dw[this.switches[l]]=m}}else{var q=0;for(var h=0;h<j.sx;h++){for(var p=0;p<j.sy;p++){for(var l=0;l<o;l++){var m=j.get_grad(h,p,l);k.set_grad(h,p,this.switches[q],m);q++}}}}},getParamsAndGrads:function(){return[]},toJSON:function(){var h={};h.out_depth=this.out_depth;h.out_sx=this.out_sx;h.out_sy=this.out_sy;h.layer_type=this.layer_type;h.group_size=this.group_size;return h},fromJSON:function(h){this.out_depth=h.out_depth;this.out_sx=h.out_sx;this.out_sy=h.out_sy;this.layer_type=h.layer_type;this.group_size=h.group_size;this.switches=d.zeros(this.group_size)}};function c(h){var i=Math.exp(2*h);return(i-1)/(i+1)}var b=function(h){var h=h||{};this.out_sx=h.in_sx;this.out_sy=h.in_sy;this.out_depth=h.in_depth;this.layer_type="tanh"};b.prototype={forward:function(j,l){this.in_act=j;var h=j.cloneAndZero();var m=j.w.length;for(var k=0;k<m;k++){h.w[k]=c(j.w[k])}this.out_act=h;return this.out_act},backward:function(){var j=this.in_act;var h=this.out_act;var m=j.w.length;j.dw=d.zeros(m);for(var k=0;k<m;k++){var l=h.w[k];j.dw[k]=(1-l*l)*h.dw[k]}},getParamsAndGrads:function(){return[]},toJSON:function(){var h={};h.out_depth=this.out_depth;h.out_sx=this.out_sx;h.out_sy=this.out_sy;h.layer_type=this.layer_type;return h},fromJSON:function(h){this.out_depth=h.out_depth;this.out_sx=h.out_sx;this.out_sy=h.out_sy;this.layer_type=h.layer_type}};d.TanhLayer=b;d.MaxoutLayer=f;d.ReluLayer=e;d.SigmoidLayer=g})(convnetjs);(function(c){var a=c.Vol;var b=function(d){var d=d||{};this.out_sx=d.in_sx;this.out_sy=d.in_sy;this.out_depth=d.in_depth;this.layer_type="dropout";this.drop_prob=typeof d.drop_prob!=="undefined"?d.drop_prob:0.5;this.dropped=c.zeros(this.out_sx*this.out_sy*this.out_depth)};b.prototype={forward:function(e,g){this.in_act=e;if(typeof(g)==="undefined"){g=false}var d=e.clone();var h=e.w.length;if(g){for(var f=0;f<h;f++){if(Math.random()<this.drop_prob){d.w[f]=0;this.dropped[f]=true}else{this.dropped[f]=false}}}else{for(var f=0;f<h;f++){d.w[f]*=this.drop_prob}}this.out_act=d;return this.out_act},backward:function(){var d=this.in_act;var f=this.out_act;var g=d.w.length;d.dw=c.zeros(g);for(var e=0;e<g;e++){if(!(this.dropped[e])){d.dw[e]=f.dw[e]}}},getParamsAndGrads:function(){return[]},toJSON:function(){var d={};d.out_depth=this.out_depth;d.out_sx=this.out_sx;d.out_sy=this.out_sy;d.layer_type=this.layer_type;d.drop_prob=this.drop_prob;return d},fromJSON:function(d){this.out_depth=d.out_depth;this.out_sx=d.out_sx;this.out_sy=d.out_sy;this.layer_type=d.layer_type;this.drop_prob=d.drop_prob}};c.DropoutLayer=b})(convnetjs);(function(c){var a=c.Vol;var b=function(d){var d=d||{};this.k=d.k;this.n=d.n;this.alpha=d.alpha;this.beta=d.beta;this.out_sx=d.in_sx;this.out_sy=d.in_sy;this.out_depth=d.in_depth;this.layer_type="lrn";if(this.n%2===0){console.log("WARNING n should be odd for LRN layer")}};b.prototype={forward:function(f,p){this.in_act=f;var e=f.cloneAndZero();this.S_cache_=f.cloneAndZero();var k=Math.floor(this.n/2);for(var n=0;n<f.sx;n++){for(var m=0;m<f.sy;m++){for(var h=0;h<f.depth;h++){var l=f.get(n,m,h);var o=0;for(var g=Math.max(0,h-k);g<=Math.min(h+k,f.depth-1);g++){var d=f.get(n,m,g);o+=d*d}o*=this.alpha/this.n;o+=this.k;this.S_cache_.set(n,m,h,o);o=Math.pow(o,this.beta);e.set(n,m,h,l/o)}}}this.out_act=e;return this.out_act},backward:function(){var f=this.in_act;f.dw=c.zeros(f.w.length);var d=this.out_act;var n=Math.floor(this.n/2);for(var r=0;r<f.sx;r++){for(var q=0;q<f.sy;q++){for(var l=0;l<f.depth;l++){var p=this.out_act.get_grad(r,q,l);var k=this.S_cache_.get(r,q,l);var e=Math.pow(k,this.beta);var s=e*e;for(var h=Math.max(0,l-n);h<=Math.min(l+n,f.depth-1);h++){var o=f.get(r,q,h);var m=-o*this.beta*Math.pow(k,this.beta-1)*this.alpha/this.n*2*o;if(h===l){m+=e}m/=s;m*=p;f.add_grad(r,q,h,m)}}}}},getParamsAndGrads:function(){return[]},toJSON:function(){var d={};d.k=this.k;d.n=this.n;d.alpha=this.alpha;d.beta=this.beta;d.out_sx=this.out_sx;d.out_sy=this.out_sy;d.out_depth=this.out_depth;d.layer_type=this.layer_type;return d},fromJSON:function(d){this.k=d.k;this.n=d.n;this.alpha=d.alpha;this.beta=d.beta;this.out_sx=d.out_sx;this.out_sy=d.out_sy;this.out_depth=d.out_depth;this.layer_type=d.layer_type}};c.LocalResponseNormalizationLayer=b})(convnetjs);(function(d){var a=d.Vol;var b=d.assert;var c=function(e){this.layers=[]};c.prototype={makeLayers:function(e){b(e.length>=2,"Error! At least one input layer and one loss layer are required.");b(e[0].type==="input","Error! First layer must be the input layer, to declare size of inputs");var f=function(){var m=[];for(var l=0;l<e.length;l++){var n=e[l];if(n.type==="softmax"||n.type==="svm"){m.push({type:"fc",num_neurons:n.num_classes})}if(n.type==="regression"){m.push({type:"fc",num_neurons:n.num_neurons})}if((n.type==="fc"||n.type==="conv")&&typeof(n.bias_pref)==="undefined"){n.bias_pref=0;if(typeof n.activation!=="undefined"&&n.activation==="relu"){n.bias_pref=0.1}}m.push(n);if(typeof n.activation!=="undefined"){if(n.activation==="relu"){m.push({type:"relu"})}else{if(n.activation==="sigmoid"){m.push({type:"sigmoid"})}else{if(n.activation==="tanh"){m.push({type:"tanh"})}else{if(n.activation==="maxout"){var k=n.group_size!=="undefined"?n.group_size:2;m.push({type:"maxout",group_size:k})}else{console.log("ERROR unsupported activation "+n.activation)}}}}}if(typeof n.drop_prob!=="undefined"&&n.type!=="dropout"){m.push({type:"dropout",drop_prob:n.drop_prob})}}return m};e=f(e);this.layers=[];for(var g=0;g<e.length;g++){var j=e[g];if(g>0){var h=this.layers[g-1];j.in_sx=h.out_sx;j.in_sy=h.out_sy;j.in_depth=h.out_depth}switch(j.type){case"fc":this.layers.push(new d.FullyConnLayer(j));break;case"lrn":this.layers.push(new d.LocalResponseNormalizationLayer(j));break;case"dropout":this.layers.push(new d.DropoutLayer(j));break;case"input":this.layers.push(new d.InputLayer(j));break;case"softmax":this.layers.push(new d.SoftmaxLayer(j));break;case"regression":this.layers.push(new d.RegressionLayer(j));break;case"conv":this.layers.push(new d.ConvLayer(j));break;case"pool":this.layers.push(new d.PoolLayer(j));break;case"relu":this.layers.push(new d.ReluLayer(j));break;case"sigmoid":this.layers.push(new d.SigmoidLayer(j));break;case"tanh":this.layers.push(new d.TanhLayer(j));break;case"maxout":this.layers.push(new d.MaxoutLayer(j));break;case"svm":this.layers.push(new d.SVMLayer(j));break;default:console.log("ERROR: UNRECOGNIZED LAYER TYPE: "+j.type)}}},forward:function(f,h){if(typeof(h)==="undefined"){h=false}var e=this.layers[0].forward(f,h);for(var g=1;g<this.layers.length;g++){e=this.layers[g].forward(e,h)}return e},getCostLoss:function(e,h){this.forward(e,false);var g=this.layers.length;var f=this.layers[g-1].backward(h);return f},backward:function(h){var g=this.layers.length;var f=this.layers[g-1].backward(h);for(var e=g-2;e>=0;e--){this.layers[e].backward()}return f},getParamsAndGrads:function(){var e=[];for(var g=0;g<this.layers.length;g++){var h=this.layers[g].getParamsAndGrads();for(var f=0;f<h.length;f++){e.push(h[f])}}return e},getPrediction:function(){var h=this.layers[this.layers.length-1];b(h.layer_type==="softmax","getPrediction function assumes softmax as last layer of the net!");var j=h.out_act.w;var e=j[0];var f=0;for(var g=1;g<j.length;g++){if(j[g]>e){e=j[g];f=g}}return f},toJSON:function(){var f={};f.layers=[];for(var e=0;e<this.layers.length;e++){f.layers.push(this.layers[e].toJSON())}return f},fromJSON:function(j){this.layers=[];for(var h=0;h<j.layers.length;h++){var f=j.layers[h];var g=f.layer_type;var e;if(g==="input"){e=new d.InputLayer()}if(g==="relu"){e=new d.ReluLayer()}if(g==="sigmoid"){e=new d.SigmoidLayer()}if(g==="tanh"){e=new d.TanhLayer()}if(g==="dropout"){e=new d.DropoutLayer()}if(g==="conv"){e=new d.ConvLayer()}if(g==="pool"){e=new d.PoolLayer()}if(g==="lrn"){e=new d.LocalResponseNormalizationLayer()}if(g==="softmax"){e=new d.SoftmaxLayer()}if(g==="regression"){e=new d.RegressionLayer()}if(g==="fc"){e=new d.FullyConnLayer()}if(g==="maxout"){e=new d.MaxoutLayer()}if(g==="svm"){e=new d.SVMLayer()}e.fromJSON(f);this.layers.push(e)}}};d.Net=c})(convnetjs);(function(b){var a=b.Vol;var c=function(e,d){this.net=e;var d=d||{};this.learning_rate=typeof d.learning_rate!=="undefined"?d.learning_rate:0.01;this.l1_decay=typeof d.l1_decay!=="undefined"?d.l1_decay:0;this.l2_decay=typeof d.l2_decay!=="undefined"?d.l2_decay:0;this.batch_size=typeof d.batch_size!=="undefined"?d.batch_size:1;this.method=typeof d.method!=="undefined"?d.method:"sgd";this.momentum=typeof d.momentum!=="undefined"?d.momentum:0.9;this.ro=typeof d.ro!=="undefined"?d.ro:0.95;this.eps=typeof d.eps!=="undefined"?d.eps:0.000001;this.k=0;this.gsum=[];this.xsum=[]};c.prototype={train:function(s,r){var h=new Date().getTime();this.net.forward(s,true);var f=new Date().getTime();var q=f-h;var h=new Date().getTime();var A=this.net.backward(r);var k=0;var d=0;var f=new Date().getTime();var G=f-h;this.k++;if(this.k%this.batch_size===0){var e=this.net.getParamsAndGrads();if(this.gsum.length===0&&(this.method!=="sgd"||this.momentum>0)){for(var E=0;E<e.length;E++){this.gsum.push(b.zeros(e[E].params.length));if(this.method==="adadelta"){this.xsum.push(b.zeros(e[E].params.length))}else{this.xsum.push([])}}}for(var E=0;E<e.length;E++){var H=e[E];var w=H.params;var F=H.grads;var z=typeof H.l2_decay_mul!=="undefined"?H.l2_decay_mul:1;var I=typeof H.l1_decay_mul!=="undefined"?H.l1_decay_mul:1;var l=this.l2_decay*z;var n=this.l1_decay*I;var u=w.length;for(var B=0;B<u;B++){k+=l*w[B]*w[B]/2;d+=n*Math.abs(w[B]);var D=n*(w[B]>0?1:-1);var o=l*(w[B]);var t=(o+D+F[B])/this.batch_size;var m=this.gsum[E];var C=this.xsum[E];if(this.method==="adagrad"){m[B]=m[B]+t*t;var v=-this.learning_rate/Math.sqrt(m[B]+this.eps)*t;w[B]+=v}else{if(this.method==="windowgrad"){m[B]=this.ro*m[B]+(1-this.ro)*t*t;var v=-this.learning_rate/Math.sqrt(m[B]+this.eps)*t;w[B]+=v}else{if(this.method==="adadelta"){m[B]=this.ro*m[B]+(1-this.ro)*t*t;var v=-Math.sqrt((C[B]+this.eps)/(m[B]+this.eps))*t;C[B]=this.ro*C[B]+(1-this.ro)*v*v;w[B]+=v}else{if(this.method==="nesterov"){var v=m[B];m[B]=m[B]*this.momentum+this.learning_rate*t;v=this.momentum*v-(1+this.momentum)*m[B];w[B]+=v}else{if(this.momentum>0){var v=this.momentum*m[B]-this.learning_rate*t;m[B]=v;w[B]+=v}else{w[B]+=-this.learning_rate*t}}}}}F[B]=0}}}return{fwd_time:q,bwd_time:G,l2_decay_loss:k,l1_decay_loss:d,cost_loss:A,softmax_loss:A,loss:A+d+k}}};b.Trainer=c;b.SGDTrainer=c})(convnetjs);(function(c){var e=c.randf;var d=c.randi;var j=c.Net;var g=c.Trainer;var b=c.maxmin;var h=c.randperm;var f=c.weightedSample;var i=c.getopt;var k=c.arrUnique;var a=function(m,n,l){var l=l||{};if(typeof m==="undefined"){m=[]}if(typeof n==="undefined"){n=[]}this.data=m;this.labels=n;this.train_ratio=i(l,"train_ratio",0.7);this.num_folds=i(l,"num_folds",10);this.num_candidates=i(l,"num_candidates",50);this.num_epochs=i(l,"num_epochs",50);this.ensemble_size=i(l,"ensemble_size",10);this.batch_size_min=i(l,"batch_size_min",10);this.batch_size_max=i(l,"batch_size_max",300);this.l2_decay_min=i(l,"l2_decay_min",-4);this.l2_decay_max=i(l,"l2_decay_max",2);this.learning_rate_min=i(l,"learning_rate_min",-4);this.learning_rate_max=i(l,"learning_rate_max",0);this.momentum_min=i(l,"momentum_min",0.9);this.momentum_max=i(l,"momentum_max",0.9);this.neurons_min=i(l,"neurons_min",5);this.neurons_max=i(l,"neurons_max",30);this.folds=[];this.candidates=[];this.evaluated_candidates=[];this.unique_labels=k(n);this.iter=0;this.foldix=0;this.finish_fold_callback=null;this.finish_batch_callback=null;if(this.data.length>0){this.sampleFolds();this.sampleCandidates()}};a.prototype={sampleFolds:function(){var o=this.data.length;var m=Math.floor(this.train_ratio*o);this.folds=[];for(var l=0;l<this.num_folds;l++){var n=h(o);this.folds.push({train_ix:n.slice(0,m),test_ix:n.slice(m,o)})}},sampleCandidate:function(){var A=this.data[0].w.length;var z=this.unique_labels.length;var s=[];s.push({type:"input",out_sx:1,out_sy:1,out_depth:A});var l=f([0,1,2,3],[0.2,0.3,0.3,0.2]);for(var m=0;m<l;m++){var n=d(this.neurons_min,this.neurons_max);var v=["tanh","maxout","relu"][d(0,3)];if(e(0,1)<0.5){var r=Math.random();s.push({type:"fc",num_neurons:n,activation:v,drop_prob:r})}else{s.push({type:"fc",num_neurons:n,activation:v})}}s.push({type:"softmax",num_classes:z});var x=new j();x.makeLayers(s);var C=d(this.batch_size_min,this.batch_size_max);var o=Math.pow(10,e(this.l2_decay_min,this.l2_decay_max));var t=Math.pow(10,e(this.learning_rate_min,this.learning_rate_max));var p=e(this.momentum_min,this.momentum_max);var y=e(0,1);var u;if(y<0.33){u={method:"adadelta",batch_size:C,l2_decay:o}}else{if(y<0.66){u={method:"adagrad",learning_rate:t,batch_size:C,l2_decay:o}}else{u={method:"sgd",learning_rate:t,momentum:p,batch_size:C,l2_decay:o}}}var B=new g(x,u);var w={};w.acc=[];w.accv=0;w.layer_defs=s;w.trainer_def=u;w.net=x;w.trainer=B;return w},sampleCandidates:function(){this.candidates=[];for(var l=0;l<this.num_candidates;l++){var m=this.sampleCandidate();this.candidates.push(m)}},step:function(){this.iter++;var r=this.folds[this.foldix];var p=r.train_ix[d(0,r.train_ix.length)];for(var q=0;q<this.candidates.length;q++){var u=this.data[p];var o=this.labels[p];this.candidates[q].trainer.train(u,o)}var n=this.num_epochs*r.train_ix.length;if(this.iter>=n){var m=this.evalValErrors();for(var q=0;q<this.candidates.length;q++){var s=this.candidates[q];s.acc.push(m[q]);s.accv+=m[q]}this.iter=0;this.foldix++;if(this.finish_fold_callback!==null){this.finish_fold_callback()}if(this.foldix>=this.folds.length){for(var q=0;q<this.candidates.length;q++){this.evaluated_candidates.push(this.candidates[q])}this.evaluated_candidates.sort(function(w,l){return(w.accv/w.acc.length)>(l.accv/l.acc.length)?-1:1});if(this.evaluated_candidates.length>3*this.ensemble_size){this.evaluated_candidates=this.evaluated_candidates.slice(0,3*this.ensemble_size)}if(this.finish_batch_callback!==null){this.finish_batch_callback()}this.sampleCandidates();this.foldix=0}else{for(var q=0;q<this.candidates.length;q++){var s=this.candidates[q];var t=new j();t.makeLayers(s.layer_defs);var v=new g(t,s.trainer_def);s.net=t;s.trainer=v}}}},evalValErrors:function(){var t=[];var r=this.folds[this.foldix];for(var p=0;p<this.candidates.length;p++){var s=this.candidates[p].net;var w=0;for(var m=0;m<r.test_ix.length;m++){var u=this.data[r.test_ix[m]];var o=this.labels[r.test_ix[m]];s.forward(u);var n=s.getPrediction();w+=(n===o?1:0)}w/=r.test_ix.length;t.push(w)}return t},predict_soft:function(q){var o=[];var r=0;if(this.evaluated_candidates.length===0){r=this.candidates.length;o=this.candidates}else{r=Math.min(this.ensemble_size,this.evaluated_candidates.length);o=this.evaluated_candidates}var l,m;for(var p=0;p<r;p++){var t=o[p].net;var u=t.forward(q);if(p===0){l=u;m=u.w.length}else{for(var s=0;s<m;s++){l.w[s]+=u.w[s]}}}for(var s=0;s<m;s++){l.w[s]/=r}return l},predict:function(n){var m=this.predict_soft(n);if(m.w.length!==0){var l=b(m.w);var o=l.maxi}else{var o=-1}return o},toJSON:function(){var l=Math.min(this.ensemble_size,this.evaluated_candidates.length);var n={};n.nets=[];for(var m=0;m<l;m++){n.nets.push(this.evaluated_candidates[m].net.toJSON())}return n},fromJSON:function(m){this.ensemble_size=m.nets.length;this.evaluated_candidates=[];for(var l=0;l<this.ensemble_size;l++){var n=new j();n.fromJSON(m.nets[l]);var o={};o.net=n;this.evaluated_candidates.push(o)}},onFinishFold:function(l){this.finish_fold_callback=l},onFinishBatch:function(l){this.finish_batch_callback=l}};c.MagicNet=a})(convnetjs);(function(a){if(typeof module==="undefined"||typeof module.exports==="undefined"){window.jsfeat=a}else{module.exports=a}})(convnetjs);
	var cnnutil = (function(exports) {

		// a window stores _size_ number of values
		// and returns averages. Useful for keeping running
		// track of validation or training accuracy during SGD
		var Window = function(size, minsize) {
		  this.v = [];
		  this.size = typeof(size) === 'undefined' ? 100 : size;
		  this.minsize = typeof(minsize) === 'undefined' ? 20 : minsize;
		  this.sum = 0;
		}
		Window.prototype = {
		  add: function(x) {
			this.v.push(x);
			this.sum += x;
			if (this.v.length > this.size) {
			  var xold = this.v.shift();
			  this.sum -= xold;
			}
		  },
		  get_average: function() {
			if (this.v.length < this.minsize) return -1;
			else return this.sum / this.v.length;
		  },
		  reset: function(x) {
			this.v = [];
			this.sum = 0;
		  }
		}
	  
		// returns min, max and indeces of an array
		var maxmin = function(w) {
		  if (w.length === 0) {
			return {};
		  } // ... ;s
	  
		  var maxv = w[0];
		  var minv = w[0];
		  var maxi = 0;
		  var mini = 0;
		  for (var i = 1; i < w.length; i++) {
			if (w[i] > maxv) {
			  maxv = w[i];
			  maxi = i;
			}
			if (w[i] < minv) {
			  minv = w[i];
			  mini = i;
			}
		  }
		  return {
			maxi: maxi,
			maxv: maxv,
			mini: mini,
			minv: minv,
			dv: maxv - minv
		  };
		}
	  
		// returns string representation of float
		// but truncated to length of d digits
		var f2t = function(x, d) {
		  if (typeof(d) === 'undefined') {
			var d = 5;
		  }
		  var dd = 1.0 * Math.pow(10, d);
		  return '' + Math.floor(x * dd) / dd;
		}
	  
		exports = exports || {};
		exports.Window = Window;
		exports.maxmin = maxmin;
		exports.f2t = f2t;
		return exports;
	  
	  })(typeof module != 'undefined' && module.exports); // add exports to module.exports if in node.js
	  
	  //deepqlearn source code.
	  
	  var deepqlearn = deepqlearn || {
		REVISION: 'ALPHA'
	  };
	  
	  (function(global) {
		"use strict";
	  
		// An agent is in state0 and does action0
		// environment then assigns reward0 and provides new state, state1
		// Experience nodes store all this information, which is used in the
		// Q-learning update step
		var Experience = function(state0, action0, reward0, state1) {
		  this.state0 = state0;
		  this.action0 = action0;
		  this.reward0 = reward0;
		  this.state1 = state1;
		}
	  
		// A Brain object does all the magic.
		// over time it receives some inputs and some rewards
		// and its job is to set the outputs to maximize the expected reward
		var Brain = function(num_states, num_actions, opt) {
		  var opt = opt || {};
		  // in number of time steps, of temporal memory
		  // the ACTUAL input to the net will be (x,a) temporal_window times, and followed by current x
		  // so to have no information from previous time step going into value function, set to 0.
		  this.temporal_window = typeof opt.temporal_window !== 'undefined' ? opt.temporal_window : 1;
		  // size of experience replay memory
		  this.experience_size = typeof opt.experience_size !== 'undefined' ? opt.experience_size : 30000;
		  // number of examples in experience replay memory before we begin learning
		  this.start_learn_threshold = typeof opt.start_learn_threshold !== 'undefined' ? opt.start_learn_threshold : Math.floor(Math.min(this.experience_size * 0.1, 1000));
		  // gamma is a crucial parameter that controls how much plan-ahead the agent does. In [0,1]
		  this.gamma = typeof opt.gamma !== 'undefined' ? opt.gamma : 0.8;
	  
		  // number of steps we will learn for
		  this.learning_steps_total = typeof opt.learning_steps_total !== 'undefined' ? opt.learning_steps_total : 100000;
		  // how many steps of the above to perform only random actions (in the beginning)?
		  this.learning_steps_burnin = typeof opt.learning_steps_burnin !== 'undefined' ? opt.learning_steps_burnin : 3000;
		  // what epsilon value do we bottom out on? 0.0 => purely deterministic policy at end
		  this.epsilon_min = typeof opt.epsilon_min !== 'undefined' ? opt.epsilon_min : 0.05;
		  // what epsilon to use at test time? (i.e. when learning is disabled)
		  this.epsilon_test_time = typeof opt.epsilon_test_time !== 'undefined' ? opt.epsilon_test_time : 0.01;
	  
		  // advanced feature. Sometimes a random action should be biased towards some values
		  // for example in flappy bird, we may want to choose to not flap more often
		  if (typeof opt.random_action_distribution !== 'undefined') {
			// this better sum to 1 by the way, and be of length this.num_actions
			this.random_action_distribution = opt.random_action_distribution;
			if (this.random_action_distribution.length !== num_actions) {
			  console.log('TROUBLE. random_action_distribution should be same length as num_actions.');
			}
			var a = this.random_action_distribution;
			var s = 0.0;
			for (var k = 0; k < a.length; k++) {
			  s += a[k];
			}
			if (Math.abs(s - 1.0) > 0.0001) {
			  console.log('TROUBLE. random_action_distribution should sum to 1!');
			}
		  } else {
			this.random_action_distribution = [];
		  }
	  
		  // states that go into neural net to predict optimal action look as
		  // x0,a0,x1,a1,x2,a2,...xt
		  // this variable controls the size of that temporal window. Actions are
		  // encoded as 1-of-k hot vectors
		  this.net_inputs = num_states * this.temporal_window + num_actions * this.temporal_window + num_states;
		  this.num_states = num_states;
		  this.num_actions = num_actions;
		  this.window_size = Math.max(this.temporal_window, 2); // must be at least 2, but if we want more context even more
		  this.state_window = new Array(this.window_size);
		  this.action_window = new Array(this.window_size);
		  this.reward_window = new Array(this.window_size);
		  this.net_window = new Array(this.window_size);
	  
		  // create [state -> value of all possible actions] modeling net for the value function
		  var layer_defs = [];
		  if (typeof opt.layer_defs !== 'undefined') {
			// this is an advanced usage feature, because size of the input to the network, and number of
			// actions must check out. This is not very pretty Object Oriented programming but I can't see
			// a way out of it :(
			layer_defs = opt.layer_defs;
			if (layer_defs.length < 2) {
			  console.log('TROUBLE! must have at least 2 layers');
			}
			if (layer_defs[0].type !== 'input') {
			  console.log('TROUBLE! first layer must be input layer!');
			}
			if (layer_defs[layer_defs.length - 1].type !== 'regression') {
			  console.log('TROUBLE! last layer must be input regression!');
			}
			if (layer_defs[0].out_depth * layer_defs[0].out_sx * layer_defs[0].out_sy !== this.net_inputs) {
			  console.log('TROUBLE! Number of inputs must be num_states * temporal_window + num_actions * temporal_window + num_states!');
			}
			if (layer_defs[layer_defs.length - 1].num_neurons !== this.num_actions) {
			  console.log('TROUBLE! Number of regression neurons should be num_actions!');
			}
		  } else {
			// create a very simple neural net by default
			layer_defs.push({
			  type: 'input',
			  out_sx: 1,
			  out_sy: 1,
			  out_depth: this.net_inputs
			});
			if (typeof opt.hidden_layer_sizes !== 'undefined') {
			  // allow user to specify this via the option, for convenience
			  var hl = opt.hidden_layer_sizes;
			  for (var k = 0; k < hl.length; k++) {
				layer_defs.push({
				  type: 'fc',
				  num_neurons: hl[k],
				  activation: 'relu'
				}); // relu by default
			  }
			}
			layer_defs.push({
			  type: 'regression',
			  num_neurons: num_actions
			}); // value function output
		  }
		  this.value_net = new convnetjs.Net();
		  this.value_net.makeLayers(layer_defs);
	  
		  // and finally we need a Temporal Difference Learning trainer!
		  var tdtrainer_options = {
			learning_rate: 0.01,
			momentum: 0.0,
			batch_size: 64,
			l2_decay: 0.01
		  };
		  if (typeof opt.tdtrainer_options !== 'undefined') {
			tdtrainer_options = opt.tdtrainer_options; // allow user to overwrite this
		  }
		  this.tdtrainer = new convnetjs.SGDTrainer(this.value_net, tdtrainer_options);
	  
		  // experience replay
		  this.experience = [];
	  
		  // various housekeeping variables
		  this.age = 0; // incremented every backward()
		  this.forward_passes = 0; // incremented every forward()
		  this.epsilon = 1.0; // controls exploration exploitation tradeoff. Should be annealed over time
		  this.latest_reward = 0;
		  this.last_input_array = [];
		  this.average_reward_window = new cnnutil.Window(1000, 10);
		  this.average_loss_window = new cnnutil.Window(1000, 10);
		  this.learning = true;
		}
		Brain.prototype = {
		  random_action: function() {
			// a bit of a helper function. It returns a random action
			// we are abstracting this away because in future we may want to 
			// do more sophisticated things. For example some actions could be more
			// or less likely at "rest"/default state.
			if (this.random_action_distribution.length === 0) {
			  return convnetjs.randi(0, this.num_actions);
			} else {
			  // okay, lets do some fancier sampling:
			  var p = convnetjs.randf(0, 1.0);
			  var cumprob = 0.0;
			  for (var k = 0; k < this.num_actions; k++) {
				cumprob += this.random_action_distribution[k];
				if (p < cumprob) {
				  return k;
				}
			  }
			}
		  },
		  policy: function(s) {
			// compute the value of doing any action in this state
			// and return the argmax action and its value
			var svol = new convnetjs.Vol(1, 1, this.net_inputs);
			svol.w = s;
			var action_values = this.value_net.forward(svol);
			var maxk = 0;
			var maxval = action_values.w[0];
			for (var k = 1; k < this.num_actions; k++) {
			  if (action_values.w[k] > maxval) {
				maxk = k;
				maxval = action_values.w[k];
			  }
			}
			return {
			  action: maxk,
			  value: maxval
			};
		  },
		  getNetInput: function(xt) {
			// return s = (x,a,x,a,x,a,xt) state vector. 
			// It's a concatenation of last window_size (x,a) pairs and current state x
			var w = [];
			w = w.concat(xt); // start with current state
			// and now go backwards and append states and actions from history temporal_window times
			var n = this.window_size;
			for (var k = 0; k < this.temporal_window; k++) {
			  // state
			  w = w.concat(this.state_window[n - 1 - k]);
			  // action, encoded as 1-of-k indicator vector. We scale it up a bit because
			  // we dont want weight regularization to undervalue this information, as it only exists once
			  var action1ofk = new Array(this.num_actions);
			  for (var q = 0; q < this.num_actions; q++) action1ofk[q] = 0.0;
			  action1ofk[this.action_window[n - 1 - k]] = 1.0 * this.num_states;
			  w = w.concat(action1ofk);
			}
			return w;
		  },
		  forward: function(input_array) {
			// compute forward (behavior) pass given the input neuron signals from body
			this.forward_passes += 1;
			this.last_input_array = input_array; // back this up
	  
			// create network input
			var action;
			if (this.forward_passes > this.temporal_window) {
			  // we have enough to actually do something reasonable
			  var net_input = this.getNetInput(input_array);
			  if (this.learning) {
				// compute epsilon for the epsilon-greedy policy
				this.epsilon = Math.min(1.0, Math.max(this.epsilon_min, 1.0 - (this.age - this.learning_steps_burnin) / (this.learning_steps_total - this.learning_steps_burnin)));
			  } else {
				this.epsilon = this.epsilon_test_time; // use test-time value
			  }
			  var rf = convnetjs.randf(0, 1);
			  if (rf < this.epsilon) {
				// choose a random action with epsilon probability
				action = this.random_action();
			  } else {
				// otherwise use our policy to make decision
				var maxact = this.policy(net_input);
				action = maxact.action;
			  }
			} else {
			  // pathological case that happens first few iterations 
			  // before we accumulate window_size inputs
			  var net_input = [];
			  action = this.random_action();
			}
	  
			// remember the state and action we took for backward pass
			this.net_window.shift();
			this.net_window.push(net_input);
			this.state_window.shift();
			this.state_window.push(input_array);
			this.action_window.shift();
			this.action_window.push(action);
	  
			return action;
		  },
		  backward: function(reward) {
			this.latest_reward = reward;
			this.average_reward_window.add(reward);
			this.reward_window.shift();
			this.reward_window.push(reward);
	  
			if (!this.learning) {
			  return;
			}
	  
			// various book-keeping
			this.age += 1;
	  
			// it is time t+1 and we have to store (s_t, a_t, r_t, s_{t+1}) as new experience
			// (given that an appropriate number of state measurements already exist, of course)
			if (this.forward_passes > this.temporal_window + 1) {
			  var e = new Experience();
			  var n = this.window_size;
			  e.state0 = this.net_window[n - 2];
			  e.action0 = this.action_window[n - 2];
			  e.reward0 = this.reward_window[n - 2];
			  e.state1 = this.net_window[n - 1];
			  if (this.experience.length < this.experience_size) {
				this.experience.push(e);
			  } else {
				// replace. finite memory!
				var ri = convnetjs.randi(0, this.experience_size);
				this.experience[ri] = e;
			  }
			}
	  
			// learn based on experience, once we have some samples to go on
			// this is where the magic happens...
			if (this.experience.length > this.start_learn_threshold) {
			  var avcost = 0.0;
			  for (var k = 0; k < this.tdtrainer.batch_size; k++) {
				var re = convnetjs.randi(0, this.experience.length);
				var e = this.experience[re];
				var x = new convnetjs.Vol(1, 1, this.net_inputs);
				x.w = e.state0;
				var maxact = this.policy(e.state1);
				var r = e.reward0 + this.gamma * maxact.value;
				var ystruct = {
				  dim: e.action0,
				  val: r
				};
				var loss = this.tdtrainer.train(x, ystruct);
				avcost += loss.loss;
			  }
			  avcost = avcost / this.tdtrainer.batch_size;
			  this.average_loss_window.add(avcost);
			}
		  },
		  visSelf: function(elt) {
			elt.innerHTML = ''; // erase elt first
	  
			// elt is a DOM element that this function fills with brain-related information
			var brainvis = document.createElement('div');
	  
			// basic information
			var desc = document.createElement('div');
			var t = '';
			t += 'experience replay size: ' + this.experience.length + '<br>';
			t += 'exploration epsilon: ' + this.epsilon + '<br>';
			t += 'age: ' + this.age + '<br>';
			t += 'average Q-learning loss: ' + this.average_loss_window.get_average() + '<br />';
			t += 'smooth-ish reward: ' + this.average_reward_window.get_average() + '<br />';
			desc.innerHTML = t;
			brainvis.appendChild(desc);
	  
			elt.appendChild(brainvis);
		  }
		}
	  
		global.Brain = Brain;
	  })(deepqlearn);
	  
	  (function(lib) {
		"use strict";
		if (typeof module === "undefined" || typeof module.exports === "undefined") {
		  window.deepqlearn = lib; // in ordinary browser attach library to window
		} else {
		  module.exports = lib; // in nodejs
		}
	  })(deepqlearn);
	  
	  //end of deepqlearn code.
	  
	  
	  var Vec = function(x, y) {
		this.x = x;
		this.y = y;
	  }
	  Vec.prototype = {
		
		// utilities
		dist_from: function(v) { return Math.sqrt(Math.pow(this.x-v.x,2) + Math.pow(this.y-v.y,2)); },
		length: function() { return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2)); },
		
		// new vector returning operations
		add: function(v) { return new Vec(this.x + v.x, this.y + v.y); },
		sub: function(v) { return new Vec(this.x - v.x, this.y - v.y); },
		rotate: function(a) {  // CLOCKWISE
		  return new Vec(this.x * Math.cos(a) + this.y * Math.sin(a),
						 -this.x * Math.sin(a) + this.y * Math.cos(a));
		},
		
		// in place operations
		scale: function(s) { this.x *= s; this.y *= s; },
		normalize: function() { var d = this.length(); this.scale(1.0/d); }
	  }
	  
	  // line intersection helper function: does line segment (p1,p2) intersect segment (p3,p4) ?
	  var line_intersect = function(p1,p2,p3,p4) {
		var denom = (p4.y-p3.y)*(p2.x-p1.x)-(p4.x-p3.x)*(p2.y-p1.y);
		if(denom===0.0) { return false; } // parallel lines
		var ua = ((p4.x-p3.x)*(p1.y-p3.y)-(p4.y-p3.y)*(p1.x-p3.x))/denom;
		var ub = ((p2.x-p1.x)*(p1.y-p3.y)-(p2.y-p1.y)*(p1.x-p3.x))/denom;
		if(ua>0.0&&ua<1.0&&ub>0.0&&ub<1.0) {
		  var up = new Vec(p1.x+ua*(p2.x-p1.x), p1.y+ua*(p2.y-p1.y));
		  return {ua:ua, ub:ub, up:up}; // up is intersection point
		}
		return false;
	  }
	  
	  var line_point_intersect = function(p1,p2,p0,rad) {
		var v = new Vec(p2.y-p1.y,-(p2.x-p1.x)); // perpendicular vector
		var d = Math.abs((p2.x-p1.x)*(p1.y-p0.y)-(p1.x-p0.x)*(p2.y-p1.y));
		d = d / v.length();
		if(d > rad) { return false; }
		
		v.normalize();
		v.scale(d);
		var up = p0.add(v);
		if(Math.abs(p2.x-p1.x)>Math.abs(p2.y-p1.y)) {
		  var ua = (up.x - p1.x) / (p2.x - p1.x);
		} else {
		  var ua = (up.y - p1.y) / (p2.y - p1.y);
		}
		if(ua>0.0&&ua<1.0) {
		  return {ua:ua, up:up};
		}
		return false;
	  }

	  function newNNs() {
		window.num_inputs = 8;
		window.num_actions = 5;
		var temporal_window = 1; // amount of temporal memory. 0 = agent lives in-the-moment :)
		var network_size = window.num_inputs * temporal_window + window.num_actions * temporal_window + window.num_inputs;
	  
		layer_defs = [];
		layer_defs.push({
		  type: 'input',
		  out_sx: 1,
		  out_sy: 1,
		  out_depth: network_size
		});
		layer_defs.push({
		  type: 'fc',
		  num_neurons: 50,
		  activation: 'relu'
		});
		layer_defs.push({
		  type: 'fc',
		  num_neurons: 50,
		  activation: 'relu'
		});
		layer_defs.push({
		  type: 'regression',
		  num_neurons: window.num_actions
		});
	  
		net = new convnetjs.Net();
		net.makeLayers(layer_defs);
	  
		trainer = new convnetjs.SGDTrainer(net, {
		  learning_rate: 0.01,
		  momentum: 0.9,
		  batch_size: 5,
		  l2_decay: 0.0
		});
	  
		window.opt = {};
		window.opt.temporal_window = temporal_window;
		window.opt.experience_size = 30000;
		window.opt.start_learn_threshold = 1000;
		window.opt.gamma = 0.7;
		window.opt.learning_steps_total = 200000;
		window.opt.learning_steps_burnin = 3000;
		window.opt.epsilon_min = 0.05;
		window.opt.epsilon_test_time = 0.05;
		window.opt.layer_defs = layer_defs;
		// window.opt.tdtrainer_options = tdtrainer_options;
		window.brains = [];
		window.brains.push(new deepqlearn.Brain(window.num_inputs, window.num_actions, window.opt));
		window.brains.push(new deepqlearn.Brain(window.num_inputs, window.num_actions, window.opt));
		window.brains[0].learning = true;
		window.brains[1].learning = true;
		// brain.learning = true; //turn on brain learning when switch is flipped.
	  }
newNNs();

//make sure to make brains[0] and brains[1].learning togglable.



	Test.__constructor = function(canvas) {
		var that = this;
		this._canvas = canvas;
		this._paused = true;
		this._fps = 200;
		this._dbgDraw = new b2DebugDraw();
		
		this._handleMouseMove = function(e){
			// adapted from cocos2d-js/Director.js
			var o = that._canvas;
			var x = o.offsetLeft - document.documentElement.scrollLeft,
				 y = o.offsetTop - document.documentElement.scrollTop;
	
			while (o = o.offsetParent) {
				x += o.offsetLeft - o.scrollLeft;
				y += o.offsetTop - o.scrollTop;
			}
	
			var p = new b2Vec2(e.clientX - x, e.clientY - y);
	
			that._mousePoint = that._dbgDraw.ToWorldPoint(p);
		};
		this._handleMouseDown = function(e){
			that._mouseDown = true;
		};
		this._handleMouseUp = function(e) {
			that._mouseDown = false;
		};
		this._handleKeyDown = function(e) {
			// that._keyDown = e.code;
			// console.log(e);
			// console.log(e.code);
			if (e.code == "KeyW") {
				window.up[0] = true;
			} else if (e.code == "KeyA") {
				window.left[0] = true;
			} else if (e.code == "KeyS") {
				window.down[0] = true;
			} else if (e.code == "KeyD") {
				window.right[0] = true;
			} else if (e.code == "Space") {
				window.heavy[0] = true;
			}
		}
		this._handleKeyUp = function(e) {
			// that._keyUp = e.code;
			if (e.code == "KeyW") {
				window.up[0] = false;
			} else if (e.code == "KeyA") {
				window.left[0] = false;
			} else if (e.code == "KeyS") {
				window.down[0] = false;
			} else if (e.code == "KeyD") {
				window.right[0] = false;
			} else if (e.code == "Space") {
				window.heavy[0] = false;
			}
		}
		// see _updateUserInteraction
		canvas.addEventListener("mousemove", this._handleMouseMove, true);
		canvas.addEventListener("mousedown", this._handleMouseDown, true);
		canvas.addEventListener("mouseup", this._handleMouseUp, true);
		document.addEventListener("keydown", this._handleKeyDown, true);
		document.addEventListener("keyup", this._handleKeyUp, true);
		
		this._velocityIterationsPerSecond = 300;
		this._positionIterationsPerSecond = 200;
		
		// sublcasses expect visual area inside 64x36
		this._dbgDraw.m_drawScale = Math.min(canvas.width/64, canvas.height/36);
		this._dbgDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit | b2DebugDraw.e_centerOfMassBit);
		this._world = this.createWorld();
	}
	
	Test.prototype.log = function(arg) {
		if(typeof(window.console) != 'undefined') {
			console.log(arg);
		}
	};
	
	Test.prototype.destroy = function() {
		this.pause();
		
		canvas.removeEventListener("mousemove", this._handleMouseMove, true);
		canvas.removeEventListener("mousedown", this._handleMouseDown, true);
		canvas.removeEventListener("mouseup", this._handleMouseUp, true);
		document.removeEventListener("keydown", this._handleKeyDown, true);
		document.removeEventListener("keyup", this._handleKeyUp, true);
		this._canvas = null;
		this._dbgDraw = null;
		this._world = null;
	}
	
	
	var onPlatform = [false,false];
	Test.prototype.createWorld = function(){
		var m_world = new b2World(new b2Vec2(0.0, -9.81*3.25), true);
		var m_physScale = 1;
		m_world.SetWarmStarting(true);
		
		// Create border of boxes
		var wall = new b2PolygonShape();
		var wallBd = new b2BodyDef();
		
		// // Left
		// wallBd.position.Set( -9.5 / m_physScale, 36 / m_physScale / 2);
		// wall.SetAsBox(10/m_physScale, 40/m_physScale/2);
		// this._wallLeft = m_world.CreateBody(wallBd);
		// this._wallLeft.CreateFixture2(wall);
		// // Right
		// wallBd.position.Set((64 + 9.5) / m_physScale, 36 / m_physScale / 2);
		// this._wallRight = m_world.CreateBody(wallBd);
		// this._wallRight.CreateFixture2(wall);
		// // Top
		// wallBd.position.Set(64 / m_physScale / 2, (36 + 9.5) / m_physScale);
		// wall.SetAsBox(68/m_physScale/2, 10/m_physScale);
		// this._wallTop = m_world.CreateBody(wallBd);
		// this._wallTop.CreateFixture2(wall);	
		// // Bottom
		// wallBd.position.Set(64 / m_physScale / 2, -9.5 / m_physScale);
		// this._wallBottom = m_world.CreateBody(wallBd);
		// this._wallBottom.CreateFixture2(wall);
		var b2Listener = b2ContactListener;
		//Add listeners for contact
		var listener = new b2Listener;
		listener.BeginContact = function(contact) {
			// console.log(contact.GetFixtureA().GetBody().GetUserData());
			if (contact.GetFixtureA().GetBody().GetUserData() == 'Floor' && contact.GetFixtureB().GetBody().GetUserData() == 'Player1') {
				onPlatform[0] = true;
				// console.log(onPlatform);
			}
			if (contact.GetFixtureA().GetBody().GetUserData() == 'Floor' && contact.GetFixtureB().GetBody().GetUserData() == 'Player2') {
				onPlatform[1]= true;
				// console.log(onPlatform2);
			}
		}
		listener.EndContact = function(contact) {
			// console.log(contact.GetFixtureA().GetBody().GetUserData());
			if (contact.GetFixtureA().GetBody().GetUserData() == 'Floor' && contact.GetFixtureB().GetBody().GetUserData() == 'Player1') {
				onPlatform[0] = false;
				// console.log(onPlatform);
			}
			if (contact.GetFixtureA().GetBody().GetUserData() == 'Floor' && contact.GetFixtureB().GetBody().GetUserData() == 'Player2') {
				onPlatform[1] = false;
				// console.log(onPlatform2);
			}
		}
		listener.PostSolve = function(contact, impulse) {
			
		}
		listener.PreSolve = function(contact, oldManifold) {
	
		}
		m_world.SetContactListener(listener);
		return m_world;
	};
	
	Test.prototype.createBall = function(world, x, y, radius) {
		radius = radius || 2;
		
		var fixtureDef = new b2FixtureDef();
		fixtureDef.shape = new b2CircleShape(radius);
		fixtureDef.friction = 0.4;
		fixtureDef.restitution = 0.6;
		fixtureDef.density = 1.0;
		
		var ballBd = new b2BodyDef();
		ballBd.type = b2Body.b2_dynamicBody;
		ballBd.position.Set(x,y);
		var body = world.CreateBody(ballBd);
		body.CreateFixture(fixtureDef);
		return body;
	}
	
	Test.prototype.draw = function() {
		var c = this._canvas.getContext("2d");
		
		this._dbgDraw.SetSprite(c);
		if(this._world) {
			this._world.SetDebugDraw(this._dbgDraw);
			this._world.DrawDebugData();
		}

		c.fillStyle = "black";
		c.fillText("score: "+window.scores[0]+" - "+window.scores[1], 250, 22.5);
		if(this._paused) {
			c.fillText("paused", 5, 15);
			c.fillText("speed:" + supaSpeed,5, 30);
		} else {
			c.fillText("FPS: " + this._fpsAchieved, 5, 15);
			c.fillText("speed:" + supaSpeed,5, 30);
		}
		if (window.heavy[0]) {
			c.strokeStyle = "rgb("+(127*(strengths[0]/maxStrengths[0])+127)+","+(127*(strengths[0]/maxStrengths[0])+127)+","+(127*(strengths[0]/maxStrengths[0])+127)+")";
			// c.strokeStyle = "rgb(255,255,255)";
			c.beginPath();
			c.lineWidth = 3;
			c.arc(window.Player1.GetPosition().x*12.5,-window.Player1.GetPosition().y*12.5+this._canvas.height,20,0,2*Math.PI);
			c.stroke();
			c.strokeStyle = "rgb(0,0,0)";
		}
	}
	
	var maxStrengths = [10,10];		//array of player heavy-mass.
	var strengths = maxStrengths;//copy the maxStrengths array.
	var decay = 0.005; 					//constant
	var regrowth = 0.01; 				//constant
	var slowDown = false;
	var reward = 0; //for use in training the neural networks.
	var state = [];
	Test.prototype.step = function(delta) {
		// console.log(window.Player1);
		if (window.Player1.GetPosition().x < -100 || window.Player1.GetPosition().x > 1000 || window.Player1.GetPosition().y < 0) {
			//Player2 wins
			this.endGame(1);
		} else if (window.Player2.GetPosition().x < -100 || window.Player2.GetPosition().x > 1000 || window.Player2.GetPosition().y < 0) {
			//Player1 wins
			this.endGame(0);
		}
		// console.log(window.up);
		var delta = (typeof delta == "undefined") ? 1/this._fps : delta;
		for (i = 0; i < supaSpeed; i++) { // a for loop that iterates the this._world.Step() function "supaSpeed" amount of times before each render.

			if(!this._world)
				return;
			this._world.ClearForces();
			// console.log(this._world.GetContactList());
			// console.log(window.Player1.GetMass());

			state = [window.Player1.GetPosition().x, window.Player1.GetPosition().y, window.Player1.GetLinearVelocity().x, window.Player1.GetLinearVelocity().y, window.Player2.GetPosition().x, window.Player2.GetPosition().y, window.Player2.GetLinearVelocity().x, window.Player2.GetLinearVelocity().y, window.heavy[0], window.heavy[1]];


			if (window.heavy[0]) {
				// slowDown = true;
				window.PFixture1.SetDensity(strengths[0]);
				// console.log(PFixture1);
				window.Player1.ResetMassData();
				if (strengths[0]>1) {
					strengths[0]-=decay*maxStrengths[0];
				} else {
					strengths[0] = 1;
				}
			} else {
				// slowDown = false;
				window.PFixture1.SetDensity(1);
				window.Player1.ResetMassData();
				if (strengths[0]<maxStrengths[0]) {
					strengths[0]+=regrowth*maxStrengths[0];
				} else {
					strengths[0] = maxStrengths[0];
				}
			}
			if (window.up[0]) {
				if (onPlatform[0] && window.Player1.GetLinearVelocity().y < 4) {
					window.Player1.ApplyForce(new b2Vec2(0, 20000), window.Player1.GetPosition());
				}
				window.Player1.ApplyForce(new b2Vec2(0, speed), window.Player1.GetPosition());
			}
			if (window.down[0]) {
				window.Player1.ApplyForce(new b2Vec2(0, -speed), window.Player1.GetPosition());
			}
			if (window.left[0]) {
				window.Player1.ApplyForce(new b2Vec2(-speed, 0), window.Player1.GetPosition());
			}
			if (window.right[0]) {
				window.Player1.ApplyForce(new b2Vec2(speed, 0), window.Player1.GetPosition());
			}
					
			//this._world.Step(delta, delta * this._velocityIterationsPerSecond, delta * this._positionIterationsPerSecond);
		
			this._world.Step(delta, delta * this._velocityIterationsPerSecond, delta * this._positionIterationsPerSecond);
		}
	}
	
	Test.prototype.supaSpeedUp = function () {
		supaSpeed*=2; //increase iterations
	}
	
	Test.prototype.supaSpeedDown = function () {
		if (supaSpeed>1) { //decrease iterations only if it's over 1, we don't want this._world.Step() to never get called...
			supaSpeed/=2;
		}
	}
	
	window.scores = [0,0];
	Test.prototype.endGame = function (winner) {
		window.scores[winner]++;
		window.up = [false, false];
		window.down = [false, false];
		window.left = [false, false];
		window.right = [false, false];
		window.space = [false, false];
		if(window.runner) {
			window.wasPaused = runner.isPaused();
			window.runner.destroy();
		}
		window.runner = new window.runners[0]($("#canvas")[0]);
		if(window.wasPaused)
			window.runner.draw();
		else	
			window.runner.resume();
	}
	
	Test.prototype._updateMouseInteraction = function() {
		// To Do: re-factor into world helper or similar
		function getBodyAtPoint(world, p) {
			var aabb = new b2AABB();
			aabb.lowerBound.Set(p.x - 0.001, p.y - 0.001);
			aabb.upperBound.Set(p.x + 0.001, p.y + 0.001);
	
			var selectedBody = null;
			world.QueryAABB(function(fixture){
				if(fixture.GetBody().GetType() != b2Body.b2_staticBody) {
					if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), p)) {
						selectedBody = fixture.GetBody();
						return false;
					}
				}
				return true;
				}, aabb);
				return selectedBody;
		}
	
		if(!this._mousePoint)
			return;
	
		if(this._mouseDown && (!this._mouseJoint)) {
			var body = getBodyAtPoint(this._world, this._mousePoint);
			if(body) {
				var md = new b2MouseJointDef();
				md.bodyA = this._world.GetGroundBody();
				md.bodyB = body;
				md.target = this._mousePoint;
				md.collideConnected = true;
				md.maxForce = 300.0 * body.GetMass();
				this._mouseJoint = this._world.CreateJoint(md);
				body.SetAwake(true);
			}
		}
	
		if(this._mouseJoint) {
			if(this._mouseDown) {
				this._mouseJoint.SetTarget(this._mousePoint);
			} else {
				this._world.DestroyJoint(this._mouseJoint);
				this._mouseJoint = undefined;
			}
		}	
	}
	
	var speed = 140;
	window.up = [false,false];
	window.down = [false,false];
	window.left = [false,false];
	window.right = [false,false];
	window.heavy = [false,false];
	Test.prototype._updateKeyboardInteraction = function() {
		// TBD

		if (this._keyDown != undefined) {
			if (this._keyDown == "KeyW") {
				window.up[0] = true;
			} else if (this._keyDown == "KeyA") {
				window.left[0] = true;
			} else if (this._keyDown == "KeyS") {
				window.down[0] = true;
			} else if (this._keyDown == "KeyD") {
				window.right[0] = true;
			} else if (this._keyDown == "Space") {
				window.heavy[0] = true;
			}
		}
		if (this._keyUp != undefined) {
			if (this._keyUp == "KeyW") {
				window.up[0] = false;
			} else if (this._keyUp == "KeyA") {
				window.left[0] = false;
			} else if (this._keyUp == "KeyS") {
				window.down[0] = false;
			} else if (this._keyUp == "KeyD") {
				window.right[0] = false;
			} else if (this._keyUp == "Space") {
				window.heavy[0] = false;
			}
		}
			this._keyDown = undefined;
			this._keyUp = undefined;
	}
	
	Test.prototype._updateUserInteraction = function() {
		this._updateMouseInteraction();
		this._updateKeyboardInteraction();
		
		if(!this._paused) {
			var that = this;
			this._updateUserInteractionTimout = window.setTimeout(function(){that._updateUserInteraction()}, 1000/20);
		}
	}
	
	Test.prototype._update = function() {
		// derive passed time since last update. max. 10 secs
		var time = new Date().getTime();
		delta = (time - this._lastUpdate) / 1000;
		this._lastUpdate = time;
		if(delta > 10)
			delta = 1/this._fps;
			
		// see this._updateFPS
		this._fpsCounter++;
		
		this.step(delta);
		this.draw();
		if(!this._paused) {
			var that = this;
			this._updateTimeout = window.setTimeout(function(){that._update()});
		}
	}
	
	Test.prototype._updateFPS = function() {
		this._fpsAchieved = this._fpsCounter;
		// this.log("fps: " + this._fpsAchieved);
		this._fpsCounter = 0;
		
		if(!this._paused) {
			var that = this;
			this._updateFPSTimeout = window.setTimeout(function(){that._updateFPS()}, 1000);
		}
	}
	
	Test.prototype.resume = function() {
		if(this._paused) {
			this._paused = false;
			this._lastUpdate = 0;
			this._update();
			this._updateFPS();
			this._updateUserInteraction();
		}
	}
	
	Test.prototype.pause = function() {
		this._paused = true;
		window.clearTimeout(this._updateTimeout);
		window.clearTimeout(this._updateFPSTimeout);
		window.clearTimeout(this._updateUserInteractionTimout);
	}
	
	Test.prototype.isPaused = function() {
		return this._paused;
	}
	
	window.gameEngine = Test;
		
	})();