(window.webpackJsonp=window.webpackJsonp||[]).push([[36],{"2Ep6":function(t,e,a){"use strict";var n=a("venr"),r={maybeTreatMouseOpAsClick:function(t,e,a){a.dragEndX=n.t(t,a),a.dragEndY=n.u(t,a);var o=Math.abs(a.dragEndX-a.dragStartX),i=Math.abs(a.dragEndY-a.dragStartY);o<2&&i<2&&void 0!==e.lastx_&&-1!=e.lastx_&&r.treatMouseOpAsClick(e,t,a),a.regionWidth=o,a.regionHeight=i},startPan:function(t,e,a){var r,o;a.isPanning=!0;var i=e.xAxisRange();if(e.getOptionForAxis("logscale","x")?(a.initialLeftmostDate=n.H(i[0]),a.dateRange=n.H(i[1])-n.H(i[0])):(a.initialLeftmostDate=i[0],a.dateRange=i[1]-i[0]),a.xUnitsPerPixel=a.dateRange/(e.plotter_.area.w-1),e.getNumericOption("panEdgeFraction")){var l=e.width_*e.getNumericOption("panEdgeFraction"),s=e.xAxisExtremes(),c=e.toDomXCoord(s[0])-l,u=e.toDomXCoord(s[1])+l,g=e.toDataXCoord(c),h=e.toDataXCoord(u);a.boundedDates=[g,h];var d=[],p=e.height_*e.getNumericOption("panEdgeFraction");for(r=0;r<e.axes_.length;r++){var v=(o=e.axes_[r]).extremeRange,f=e.toDomYCoord(v[0],r)+p,x=e.toDomYCoord(v[1],r)-p,m=e.toDataYCoord(f,r),y=e.toDataYCoord(x,r);d[r]=[m,y]}a.boundedValues=d}for(a.is2DPan=!1,a.axes=[],r=0;r<e.axes_.length;r++){o=e.axes_[r];var _={},P=e.yAxisRange(r);e.attributes_.getForAxis("logscale",r)?(_.initialTopValue=n.H(P[1]),_.dragValueRange=n.H(P[1])-n.H(P[0])):(_.initialTopValue=P[1],_.dragValueRange=P[1]-P[0]),_.unitsPerPixel=_.dragValueRange/(e.plotter_.area.h-1),a.axes.push(_),o.valueRange&&(a.is2DPan=!0)}},movePan:function(t,e,a){a.dragEndX=n.t(t,a),a.dragEndY=n.u(t,a);var r=a.initialLeftmostDate-(a.dragEndX-a.dragStartX)*a.xUnitsPerPixel;a.boundedDates&&(r=Math.max(r,a.boundedDates[0]));var o=r+a.dateRange;if(a.boundedDates&&o>a.boundedDates[1]&&(o=(r-=o-a.boundedDates[1])+a.dateRange),e.getOptionForAxis("logscale","x")?e.dateWindow_=[Math.pow(n.g,r),Math.pow(n.g,o)]:e.dateWindow_=[r,o],a.is2DPan)for(var i=a.dragEndY-a.dragStartY,l=0;l<e.axes_.length;l++){var s=e.axes_[l],c=a.axes[l],u=i*c.unitsPerPixel,g=a.boundedValues?a.boundedValues[l]:null,h=c.initialTopValue+u;g&&(h=Math.min(h,g[1]));var d=h-c.dragValueRange;g&&d<g[0]&&(d=(h-=d-g[0])-c.dragValueRange),e.attributes_.getForAxis("logscale",l)?s.valueRange=[Math.pow(n.g,d),Math.pow(n.g,h)]:s.valueRange=[d,h]}e.drawGraph_(!1)}};
/**
 * @license
 * Copyright 2011 Robert Konigsberg (konigsberg@google.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */r.endPan=r.maybeTreatMouseOpAsClick,r.startZoom=function(t,e,a){a.isZooming=!0,a.zoomMoved=!1},r.moveZoom=function(t,e,a){a.zoomMoved=!0,a.dragEndX=n.t(t,a),a.dragEndY=n.u(t,a);var r=Math.abs(a.dragStartX-a.dragEndX),o=Math.abs(a.dragStartY-a.dragEndY);a.dragDirection=r<o/2?n.h:n.f,e.drawZoomRect_(a.dragDirection,a.dragStartX,a.dragEndX,a.dragStartY,a.dragEndY,a.prevDragDirection,a.prevEndX,a.prevEndY),a.prevEndX=a.dragEndX,a.prevEndY=a.dragEndY,a.prevDragDirection=a.dragDirection},r.treatMouseOpAsClick=function(t,e,a){for(var n=t.getFunctionOption("clickCallback"),r=t.getFunctionOption("pointClickCallback"),o=null,i=-1,l=Number.MAX_VALUE,s=0;s<t.selPoints_.length;s++){var c=t.selPoints_[s],u=Math.pow(c.canvasx-a.dragEndX,2)+Math.pow(c.canvasy-a.dragEndY,2);!isNaN(u)&&(-1==i||u<l)&&(l=u,i=s)}var g=t.getNumericOption("highlightCircleSize")+2;if(l<=g*g&&(o=t.selPoints_[i]),o){var h={cancelable:!0,point:o,canvasx:a.dragEndX,canvasy:a.dragEndY};if(t.cascadeEvents_("pointClick",h))return;r&&r.call(t,e,o)}h={cancelable:!0,xval:t.lastx_,pts:t.selPoints_,canvasx:a.dragEndX,canvasy:a.dragEndY};t.cascadeEvents_("click",h)||n&&n.call(t,e,t.lastx_,t.selPoints_)},r.endZoom=function(t,e,a){e.clearZoomRect_(),a.isZooming=!1,r.maybeTreatMouseOpAsClick(t,e,a);var o=e.getArea();if(a.regionWidth>=10&&a.dragDirection==n.f){var i=Math.min(a.dragStartX,a.dragEndX),l=Math.max(a.dragStartX,a.dragEndX);(i=Math.max(i,o.x))<(l=Math.min(l,o.x+o.w))&&e.doZoomX_(i,l),a.cancelNextDblclick=!0}else if(a.regionHeight>=10&&a.dragDirection==n.h){var s=Math.min(a.dragStartY,a.dragEndY),c=Math.max(a.dragStartY,a.dragEndY);(s=Math.max(s,o.y))<(c=Math.min(c,o.y+o.h))&&e.doZoomY_(s,c),a.cancelNextDblclick=!0}a.dragStartX=null,a.dragStartY=null},r.startTouch=function(t,e,a){t.preventDefault(),t.touches.length>1&&(a.startTimeForDoubleTapMs=null);for(var n=[],r=0;r<t.touches.length;r++){var o=t.touches[r];n.push({pageX:o.pageX,pageY:o.pageY,dataX:e.toDataXCoord(o.pageX),dataY:e.toDataYCoord(o.pageY)})}if(a.initialTouches=n,1==n.length)a.initialPinchCenter=n[0],a.touchDirections={x:!0,y:!0};else if(n.length>=2){a.initialPinchCenter={pageX:.5*(n[0].pageX+n[1].pageX),pageY:.5*(n[0].pageY+n[1].pageY),dataX:.5*(n[0].dataX+n[1].dataX),dataY:.5*(n[0].dataY+n[1].dataY)};var i=180/Math.PI*Math.atan2(a.initialPinchCenter.pageY-n[0].pageY,n[0].pageX-a.initialPinchCenter.pageX);(i=Math.abs(i))>90&&(i=90-i),a.touchDirections={x:i<67.5,y:i>22.5}}a.initialRange={x:e.xAxisRange(),y:e.yAxisRange()}},r.moveTouch=function(t,e,a){a.startTimeForDoubleTapMs=null;var n,r=[];for(n=0;n<t.touches.length;n++){var o=t.touches[n];r.push({pageX:o.pageX,pageY:o.pageY})}var i,l,s,c=a.initialTouches,u=a.initialPinchCenter,g={pageX:(i=1==r.length?r[0]:{pageX:.5*(r[0].pageX+r[1].pageX),pageY:.5*(r[0].pageY+r[1].pageY)}).pageX-u.pageX,pageY:i.pageY-u.pageY},h=a.initialRange.x[1]-a.initialRange.x[0],d=a.initialRange.y[0]-a.initialRange.y[1];if(g.dataX=g.pageX/e.plotter_.area.w*h,g.dataY=g.pageY/e.plotter_.area.h*d,1==r.length)l=1,s=1;else if(r.length>=2){var p=c[1].pageX-u.pageX;l=(r[1].pageX-i.pageX)/p;var v=c[1].pageY-u.pageY;s=(r[1].pageY-i.pageY)/v}l=Math.min(8,Math.max(.125,l)),s=Math.min(8,Math.max(.125,s));var f=!1;if(a.touchDirections.x&&(e.dateWindow_=[u.dataX-g.dataX+(a.initialRange.x[0]-u.dataX)/l,u.dataX-g.dataX+(a.initialRange.x[1]-u.dataX)/l],f=!0),a.touchDirections.y)for(n=0;n<1;n++){var x=e.axes_[n];e.attributes_.getForAxis("logscale",n)||(x.valueRange=[u.dataY-g.dataY+(a.initialRange.y[0]-u.dataY)/s,u.dataY-g.dataY+(a.initialRange.y[1]-u.dataY)/s],f=!0)}if(e.drawGraph_(!1),f&&r.length>1&&e.getFunctionOption("zoomCallback")){var m=e.xAxisRange();e.getFunctionOption("zoomCallback").call(e,m[0],m[1],e.yAxisRanges())}},r.endTouch=function(t,e,a){if(0!==t.touches.length)r.startTouch(t,e,a);else if(1==t.changedTouches.length){var n=(new Date).getTime(),o=t.changedTouches[0];a.startTimeForDoubleTapMs&&n-a.startTimeForDoubleTapMs<500&&a.doubleTapX&&Math.abs(a.doubleTapX-o.screenX)<50&&a.doubleTapY&&Math.abs(a.doubleTapY-o.screenY)<50?e.resetZoom():(a.startTimeForDoubleTapMs=n,a.doubleTapX=o.screenX,a.doubleTapY=o.screenY)}};var o=function(t,e,a){return t<e?e-t:t>a?t-a:0};r.defaultModel={mousedown:function(t,e,a){if(!t.button||2!=t.button){a.initializeMouseDown(t,e,a),t.altKey||t.shiftKey?r.startPan(t,e,a):r.startZoom(t,e,a);var i=function(t){a.isZooming?function(t,e){var a=n.v(e.canvas_),r={left:a.x,right:a.x+e.canvas_.offsetWidth,top:a.y,bottom:a.y+e.canvas_.offsetHeight},i={x:n.L(t),y:n.M(t)},l=o(i.x,r.left,r.right),s=o(i.y,r.top,r.bottom);return Math.max(l,s)}(t,e)<100?r.moveZoom(t,e,a):null!==a.dragEndX&&(a.dragEndX=null,a.dragEndY=null,e.clearZoomRect_()):a.isPanning&&r.movePan(t,e,a)},l=function(t){a.isZooming?null!==a.dragEndX?r.endZoom(t,e,a):r.maybeTreatMouseOpAsClick(t,e,a):a.isPanning&&r.endPan(t,e,a),n.O(document,"mousemove",i),n.O(document,"mouseup",l),a.destroy()};e.addAndTrackEvent(document,"mousemove",i),e.addAndTrackEvent(document,"mouseup",l)}},willDestroyContextMyself:!0,touchstart:function(t,e,a){r.startTouch(t,e,a)},touchmove:function(t,e,a){r.moveTouch(t,e,a)},touchend:function(t,e,a){r.endTouch(t,e,a)},dblclick:function(t,e,a){if(a.cancelNextDblclick)a.cancelNextDblclick=!1;else{var n={canvasx:a.dragEndX,canvasy:a.dragEndY,cancelable:!0};e.cascadeEvents_("dblclick",n)||t.altKey||t.shiftKey||e.resetZoom()}}},r.nonInteractiveModel_={mousedown:function(t,e,a){a.initializeMouseDown(t,e,a)},mouseup:r.maybeTreatMouseOpAsClick},r.dragIsPanInteractionModel={mousedown:function(t,e,a){a.initializeMouseDown(t,e,a),r.startPan(t,e,a)},mousemove:function(t,e,a){a.isPanning&&r.movePan(t,e,a)},mouseup:function(t,e,a){a.isPanning&&r.endPan(t,e,a)}},e.a=r},EflE:function(t,e,a){"use strict";a.r(e);var n=a("Cnnb");a.d(e,"default",(function(){return n.a}))},HeW1:function(t,e,a){"use strict";t.exports=function(t,e){return e||(e={}),"string"!=typeof(t=t&&t.__esModule?t.default:t)?t:(/^['"].*['"]$/.test(t)&&(t=t.slice(1,-1)),e.hash&&(t+=e.hash),/["'() \t\n]/.test(t)||e.needQuotes?'"'.concat(t.replace(/"/g,'\\"').replace(/\n/g,"\\n"),'"'):t)}},JPst:function(t,e,a){"use strict";t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var a=function(t,e){var a=t[1]||"",n=t[3];if(!n)return a;if(e&&"function"==typeof btoa){var r=(i=n,l=btoa(unescape(encodeURIComponent(JSON.stringify(i)))),s="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(l),"/*# ".concat(s," */")),o=n.sources.map((function(t){return"/*# sourceURL=".concat(n.sourceRoot||"").concat(t," */")}));return[a].concat(o).concat([r]).join("\n")}var i,l,s;return[a].join("\n")}(e,t);return e[2]?"@media ".concat(e[2]," {").concat(a,"}"):a})).join("")},e.i=function(t,a,n){"string"==typeof t&&(t=[[null,t,""]]);var r={};if(n)for(var o=0;o<this.length;o++){var i=this[o][0];null!=i&&(r[i]=!0)}for(var l=0;l<t.length;l++){var s=[].concat(t[l]);n&&r[s[0]]||(a&&(s[2]?s[2]="".concat(a," and ").concat(s[2]):s[2]=a),e.push(s))}},e}},L0NK:function(t,e,a){"use strict";var n=a("SAj3"),r=a("2c4Y"),o=function(){n.a.call(this)};(o.prototype=new n.a).extractSeries=function(t,e,a){},o.prototype.rollingAverage=function(t,e,a){},o.prototype.onPointsCreated_=function(t,e){for(var a=0;a<t.length;++a){var r=t[a],o=e[a];o.y_top=NaN,o.y_bottom=NaN,o.yval_minus=n.a.parseFloat(r[2][0]),o.yval_plus=n.a.parseFloat(r[2][1])}},o.prototype.getExtremeYValues=function(t,e,a){for(var n,r=null,o=null,i=t.length-1,l=0;l<=i;l++)if(null!==(n=t[l][1])&&!isNaN(n)){var s=t[l][2][0],c=t[l][2][1];s>n&&(s=n),c<n&&(c=n),(null===o||c>o)&&(o=c),(null===r||s<r)&&(r=s)}return[r,o]},o.prototype.onLineEvaluated=function(t,e,a){for(var n,o=0;o<t.length;o++)(n=t[o]).y_top=r.a.calcYNormal_(e,n.yval_minus,a),n.y_bottom=r.a.calcYNormal_(e,n.yval_plus,a)},e.a=o},MiBf:function(t,e,a){"use strict";var n=a("L0NK"),r=function(){};
/**
 * @license
 * Copyright 2013 David Eberlein (david.eberlein@ch.sauter-bc.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */(r.prototype=new n.a).extractSeries=function(t,e,a){for(var n,r,o,i,l=[],s=a.get("sigma"),c=a.get("logscale"),u=0;u<t.length;u++)n=t[u][0],i=t[u][e],c&&null!==i&&(i[0]<=0||i[0]-s*i[1]<=0)&&(i=null),null!==i?null===(r=i[0])||isNaN(r)?l.push([n,r,[r,r,r]]):(o=s*i[1],l.push([n,r,[r-o,r+o,i[1]]])):l.push([n,null,[null,null,null]]);return l},r.prototype.rollingAverage=function(t,e,a){e=Math.min(e,t.length);var n,r,o,i,l,s,c,u,g,h=[],d=a.get("sigma");for(n=0;n<t.length;n++){for(l=0,u=0,s=0,r=Math.max(0,n-e+1);r<n+1;r++)null===(o=t[r][1])||isNaN(o)||(s++,l+=o,u+=Math.pow(t[r][2][2],2));s?(c=Math.sqrt(u)/s,g=l/s,h[n]=[t[n][0],g,[g-d*c,g+d*c]]):(i=1==e?t[n][1]:null,h[n]=[t[n][0],i,[i,i]])}return h},e.a=r},"NM/G":function(t,e,a){"use strict";var n=a("UzcX"),r=a("2Ep6"),o=a("UmFC"),i=a("venr"),l={highlightCircleSize:3,highlightSeriesOpts:null,highlightSeriesBackgroundAlpha:.5,highlightSeriesBackgroundColor:"rgb(255, 255, 255)",labelsSeparateLines:!1,labelsShowZeroValues:!0,labelsKMB:!1,labelsKMG2:!1,showLabelsOnHighlight:!0,digitsAfterDecimal:2,maxNumberWidth:6,sigFigs:null,strokeWidth:1,strokeBorderWidth:0,strokeBorderColor:"white",axisTickSize:3,axisLabelFontSize:14,rightGap:5,showRoller:!1,xValueParser:void 0,delimiter:",",sigma:2,errorBars:!1,fractions:!1,wilsonInterval:!0,customBars:!1,fillGraph:!1,fillAlpha:.15,connectSeparatedPoints:!1,stackedGraph:!1,stackedGraphNaNFill:"all",hideOverlayOnMouseOut:!0,legend:"onmouseover",stepPlot:!1,xRangePad:0,yRangePad:null,drawAxesAtZero:!1,titleHeight:28,xLabelHeight:18,yLabelWidth:18,axisLineColor:"black",axisLineWidth:.3,gridLineWidth:.3,axisLabelWidth:50,gridLineColor:"rgb(128,128,128)",interactionModel:r.a.defaultModel,animatedZooms:!1,showRangeSelector:!1,rangeSelectorHeight:40,rangeSelectorPlotStrokeColor:"#808FAB",rangeSelectorPlotFillGradientColor:"white",rangeSelectorPlotFillColor:"#A7B1C4",rangeSelectorBackgroundStrokeColor:"gray",rangeSelectorBackgroundLineWidth:1,rangeSelectorPlotLineWidth:1.5,rangeSelectorForegroundStrokeColor:"black",rangeSelectorForegroundLineWidth:1,rangeSelectorAlpha:.6,showInRangeSelector:null,plotter:[o.a._fillPlotter,o.a._errorPlotter,o.a._linePlotter],plugins:[],axes:{x:{pixelsPerLabel:70,axisLabelWidth:60,axisLabelFormatter:i.o,valueFormatter:i.r,drawGrid:!0,drawAxis:!0,independentTicks:!0,ticker:n.b},y:{axisLabelWidth:50,pixelsPerLabel:30,valueFormatter:i.K,axisLabelFormatter:i.J,drawGrid:!0,drawAxis:!0,independentTicks:!0,ticker:n.e},y2:{axisLabelWidth:50,pixelsPerLabel:30,valueFormatter:i.K,axisLabelFormatter:i.J,drawAxis:!0,drawGrid:!1,independentTicks:!1,ticker:n.e}}};e.a=l},NQFv:function(t,e,a){"use strict";var n=a("Cnnb"),r=function(t){this.container=t};
/**
 * @license
 * Copyright 2011 Dan Vanderkam (danvdk@gmail.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */r.prototype.draw=function(t,e){this.container.innerHTML="",void 0!==this.date_graph&&this.date_graph.destroy(),this.date_graph=new n.a(this.container,t,e)},r.prototype.setSelection=function(t){var e=!1;t.length&&(e=t[0].row),this.date_graph.setSelection(e)},r.prototype.getSelection=function(){var t=[],e=this.date_graph.getSelection();if(e<0)return t;for(var a=this.date_graph.layout_.points,n=0;n<a.length;++n)t.push({row:e,column:n+1});return t},e.a=r},RZAc:function(t,e,a){"use strict";var n=a("SAj3"),r=function(){};
/**
 * @license
 * Copyright 2013 David Eberlein (david.eberlein@ch.sauter-bc.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */(r.prototype=new n.a).extractSeries=function(t,e,a){for(var n=[],r=a.get("logscale"),o=0;o<t.length;o++){var i=t[o][0],l=t[o][e];r&&l<=0&&(l=null),n.push([i,l])}return n},r.prototype.rollingAverage=function(t,e,a){var n,r,o,i,l,s=[];if(1==(e=Math.min(e,t.length)))return t;for(n=0;n<t.length;n++){for(i=0,l=0,r=Math.max(0,n-e+1);r<n+1;r++)null===(o=t[r][1])||isNaN(o)||(l++,i+=t[r][1]);s[n]=l?[t[n][0],i/l]:[t[n][0],null]}return s},r.prototype.getExtremeYValues=function(t,e,a){for(var n,r=null,o=null,i=t.length-1,l=0;l<=i;l++)null===(n=t[l][1])||isNaN(n)||((null===o||n>o)&&(o=n),(null===r||n<r)&&(r=n));return[r,o]},e.a=r},SAj3:function(t,e,a){"use strict";
/**
 * @license
 * Copyright 2013 David Eberlein (david.eberlein@ch.sauter-bc.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */var n=function(){},r=n;r.X=0,r.Y=1,r.EXTRAS=2,r.prototype.extractSeries=function(t,e,a){},r.prototype.seriesToPoints=function(t,e,a){for(var n=[],o=0;o<t.length;++o){var i=t[o],l=i[1],s=null===l?null:r.parseFloat(l),c={x:NaN,y:NaN,xval:r.parseFloat(i[0]),yval:s,name:e,idx:o+a};n.push(c)}return this.onPointsCreated_(t,n),n},r.prototype.onPointsCreated_=function(t,e){},r.prototype.rollingAverage=function(t,e,a){},r.prototype.getExtremeYValues=function(t,e,a){},r.prototype.onLineEvaluated=function(t,e,a){},r.parseFloat=function(t){return null===t?NaN:t},e.a=n},TXHi:function(t,e,a){"use strict";var n=a("L0NK"),r=function(){};
/**
 * @license
 * Copyright 2013 David Eberlein (david.eberlein@ch.sauter-bc.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */(r.prototype=new n.a).extractSeries=function(t,e,a){for(var n,r,o,i,l,s,c,u=[],g=a.get("sigma"),h=a.get("logscale"),d=0;d<t.length;d++)n=t[d][0],o=t[d][e],h&&null!==o&&(o[0]<=0||o[1]<=0)&&(o=null),null!==o?(i=o[0],l=o[1],null===i||isNaN(i)?u.push([n,i,[i,i,i,l]]):(s=l?i/l:0,c=100*(l?g*Math.sqrt(s*(1-s)/l):1),r=100*s,u.push([n,r,[r-c,r+c,i,l]]))):u.push([n,null,[null,null,null,null]]);return u},r.prototype.rollingAverage=function(t,e,a){e=Math.min(e,t.length);var n,r,o,i,l=[],s=a.get("sigma"),c=a.get("wilsonInterval"),u=0,g=0;for(o=0;o<t.length;o++){u+=t[o][2][2],g+=t[o][2][3],o-e>=0&&(u-=t[o-e][2][2],g-=t[o-e][2][3]);var h=t[o][0],d=g?u/g:0;if(c)if(g){var p=d<0?0:d,v=g,f=s*Math.sqrt(p*(1-p)/v+s*s/(4*v*v)),x=1+s*s/g;n=(p+s*s/(2*g)-f)/x,r=(p+s*s/(2*g)+f)/x,l[o]=[h,100*p,[100*n,100*r]]}else l[o]=[h,0,[0,0]];else i=g?s*Math.sqrt(d*(1-d)/g):1,l[o]=[h,100*d,[100*(d-i),100*(d+i)]]}return l},e.a=r},UXZ1:function(t,e,a){"use strict";var n=a("L0NK"),r=function(){};
/**
 * @license
 * Copyright 2013 David Eberlein (david.eberlein@ch.sauter-bc.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */(r.prototype=new n.a).extractSeries=function(t,e,a){for(var n,r,o,i=[],l=a.get("logscale"),s=0;s<t.length;s++)n=t[s][0],o=t[s][e],l&&null!==o&&(o[0]<=0||o[1]<=0||o[2]<=0)&&(o=null),null!==o?null===(r=o[1])||isNaN(r)?i.push([n,r,[r,r]]):i.push([n,r,[o[0],o[2]]]):i.push([n,null,[null,null]]);return i},r.prototype.rollingAverage=function(t,e,a){e=Math.min(e,t.length);var n,r,o,i,l,s,c,u=[];for(r=0,i=0,o=0,l=0,s=0;s<t.length;s++){if(n=t[s][1],c=t[s][2],u[s]=t[s],null===n||isNaN(n)||(r+=c[0],i+=n,o+=c[1],l+=1),s-e>=0){var g=t[s-e];null===g[1]||isNaN(g[1])||(r-=g[2][0],i-=g[1],o-=g[2][1],l-=1)}u[s]=l?[t[s][0],1*i/l,[1*r/l,1*o/l]]:[t[s][0],null,[null,null]]}return u},e.a=r},UmFC:function(t,e,a){"use strict";var n=a("venr"),r=a("Cnnb"),o=function(t,e,a,r){if(this.dygraph_=t,this.layout=r,this.element=e,this.elementContext=a,this.height=t.height_,this.width=t.width_,!n.B(this.element))throw"Canvas is not supported.";this.area=r.getPlotArea();var o=this.dygraph_.canvas_ctx_;o.beginPath(),o.rect(this.area.x,this.area.y,this.area.w,this.area.h),o.clip(),(o=this.dygraph_.hidden_ctx_).beginPath(),o.rect(this.area.x,this.area.y,this.area.w,this.area.h),o.clip()};o.prototype.clear=function(){this.elementContext.clearRect(0,0,this.width,this.height)},o.prototype.render=function(){this._updatePoints(),this._renderLineChart()},o._getIteratorPredicate=function(t){return t?o._predicateThatSkipsEmptyPoints:null},o._predicateThatSkipsEmptyPoints=function(t,e){return null!==t[e].yval},o._drawStyledLine=function(t,e,a,r,i,l,s){var c=t.dygraph,u=c.getBooleanOption("stepPlot",t.setName);n.A(r)||(r=null);var g=c.getBooleanOption("drawGapEdgePoints",t.setName),h=t.points,d=t.setName,p=n.n(h,0,h.length,o._getIteratorPredicate(c.getBooleanOption("connectSeparatedPoints",d))),v=r&&r.length>=2,f=t.drawingContext;f.save(),v&&f.setLineDash&&f.setLineDash(r);var x=o._drawSeries(t,p,a,s,i,g,u,e);o._drawPointsOnLine(t,x,l,e,s),v&&f.setLineDash&&f.setLineDash([]),f.restore()},o._drawSeries=function(t,e,a,n,r,o,i,l){var s,c,u=null,g=null,h=null,d=[],p=!0,v=t.drawingContext;v.beginPath(),v.strokeStyle=l,v.lineWidth=a;for(var f=e.array_,x=e.end_,m=e.predicate_,y=e.start_;y<x;y++){if(c=f[y],m){for(;y<x&&!m(f,y);)y++;if(y==x)break;c=f[y]}if(null===c.canvasy||c.canvasy!=c.canvasy)i&&null!==u&&(v.moveTo(u,g),v.lineTo(c.canvasx,g)),u=g=null;else{if(s=!1,o||null===u){e.nextIdx_=y,e.next();var _=null===(h=e.hasNext?e.peek.canvasy:null)||h!=h;s=null===u&&_,o&&(!p&&null===u||e.hasNext&&_)&&(s=!0)}null!==u?a&&(i&&(v.moveTo(u,g),v.lineTo(c.canvasx,g)),v.lineTo(c.canvasx,c.canvasy)):v.moveTo(c.canvasx,c.canvasy),(r||s)&&d.push([c.canvasx,c.canvasy,c.idx]),u=c.canvasx,g=c.canvasy}p=!1}return v.stroke(),d},o._drawPointsOnLine=function(t,e,a,n,r){for(var o=t.drawingContext,i=0;i<e.length;i++){var l=e[i];o.save(),a.call(t.dygraph,t.dygraph,t.setName,o,l[0],l[1],n,r,l[2]),o.restore()}},o.prototype._updatePoints=function(){for(var t=this.layout.points,e=t.length;e--;)for(var a=t[e],n=a.length;n--;){var r=a[n];r.canvasx=this.area.w*r.x+this.area.x,r.canvasy=this.area.h*r.y+this.area.y}},o.prototype._renderLineChart=function(t,e){var a,r,o=e||this.elementContext,i=this.layout.points,l=this.layout.setNames;this.colors=this.dygraph_.colorsMap_;var s=this.dygraph_.getOption("plotter"),c=s;n.A(c)||(c=[c]);var u={};for(a=0;a<l.length;a++){r=l[a];var g=this.dygraph_.getOption("plotter",r);g!=s&&(u[r]=g)}for(a=0;a<c.length;a++)for(var h=c[a],d=a==c.length-1,p=0;p<i.length;p++)if(r=l[p],!t||r==t){var v=i[p],f=h;if(r in u){if(!d)continue;f=u[r]}var x=this.colors[r],m=this.dygraph_.getOption("strokeWidth",r);o.save(),o.strokeStyle=x,o.lineWidth=m,f({points:v,setName:r,drawingContext:o,color:x,strokeWidth:m,dygraph:this.dygraph_,axis:this.dygraph_.axisPropertiesForSeries(r),plotArea:this.area,seriesIndex:p,seriesCount:i.length,singleSeriesName:t,allSeriesPoints:i}),o.restore()}},o._Plotters={linePlotter:function(t){o._linePlotter(t)},fillPlotter:function(t){o._fillPlotter(t)},errorPlotter:function(t){o._errorPlotter(t)}},o._linePlotter=function(t){var e=t.dygraph,a=t.setName,r=t.strokeWidth,i=e.getNumericOption("strokeBorderWidth",a),l=e.getOption("drawPointCallback",a)||n.a.DEFAULT,s=e.getOption("strokePattern",a),c=e.getBooleanOption("drawPoints",a),u=e.getNumericOption("pointSize",a);i&&r&&o._drawStyledLine(t,e.getOption("strokeBorderColor",a),r+2*i,s,c,l,u),o._drawStyledLine(t,t.color,r,s,c,l,u)},o._errorPlotter=function(t){var e=t.dygraph,a=t.setName;if(e.getBooleanOption("errorBars")||e.getBooleanOption("customBars")){e.getBooleanOption("fillGraph",a)&&console.warn("Can't use fillGraph option with error bars");var r,i=t.drawingContext,l=t.color,s=e.getNumericOption("fillAlpha",a),c=e.getBooleanOption("stepPlot",a),u=t.points,g=n.n(u,0,u.length,o._getIteratorPredicate(e.getBooleanOption("connectSeparatedPoints",a))),h=NaN,d=NaN,p=[-1,-1],v=n.Q(l),f="rgba("+v.r+","+v.g+","+v.b+","+s+")";i.fillStyle=f,i.beginPath();for(var x=function(t){return null==t||isNaN(t)};g.hasNext;){var m=g.next();!c&&x(m.y)||c&&!isNaN(d)&&x(d)?h=NaN:(r=[m.y_bottom,m.y_top],c&&(d=m.y),isNaN(r[0])&&(r[0]=m.y),isNaN(r[1])&&(r[1]=m.y),r[0]=t.plotArea.h*r[0]+t.plotArea.y,r[1]=t.plotArea.h*r[1]+t.plotArea.y,isNaN(h)||(c?(i.moveTo(h,p[0]),i.lineTo(m.canvasx,p[0]),i.lineTo(m.canvasx,p[1])):(i.moveTo(h,p[0]),i.lineTo(m.canvasx,r[0]),i.lineTo(m.canvasx,r[1])),i.lineTo(h,p[1]),i.closePath()),p=r,h=m.canvasx)}i.fill()}},o._fastCanvasProxy=function(t){var e=[],a=null,n=null,r=0,o=function(a){!function(t){if(!(e.length<=1)){for(var a=e.length-1;a>0;a--){if(2==(l=e[a])[0]){var n=e[a-1];n[1]==l[1]&&n[2]==l[2]&&e.splice(a,1)}}for(a=0;a<e.length-1;){2==(l=e[a])[0]&&2==e[a+1][0]?e.splice(a,1):a++}if(e.length>2&&!t){var r=0;2==e[0][0]&&r++;var o=null,i=null;for(a=r;a<e.length;a++){var l;if(1==(l=e[a])[0])if(null===o&&null===i)o=a,i=a;else{var s=l[2];s<e[o][2]?o=a:s>e[i][2]&&(i=a)}}var c=e[o],u=e[i];e.splice(r,e.length-r),o<i?(e.push(c),e.push(u)):o>i?(e.push(u),e.push(c)):e.push(c)}}}(a);for(var o=0,i=e.length;o<i;o++){var l=e[o];1==l[0]?t.lineTo(l[1],l[2]):2==l[0]&&t.moveTo(l[1],l[2])}e.length&&(n=e[e.length-1][1]),r+=e.length,e=[]},i=function(t,r,i){var l=Math.round(r);null!==a&&l==a||(o(a-n>1||l-a>1),a=l);e.push([t,r,i])};return{moveTo:function(t,e){i(2,t,e)},lineTo:function(t,e){i(1,t,e)},stroke:function(){o(!0),t.stroke()},fill:function(){o(!0),t.fill()},beginPath:function(){o(!0),t.beginPath()},closePath:function(){o(!0),t.closePath()},_count:function(){return r}}},o._fillPlotter=function(t){if(!t.singleSeriesName&&0===t.seriesIndex){for(var e=t.dygraph,a=e.getLabels().slice(1),i=a.length;i>=0;i--)e.visibility()[i]||a.splice(i,1);if(function(){for(var t=0;t<a.length;t++)if(e.getBooleanOption("fillGraph",a[t]))return!0;return!1}())for(var l,s,c=t.plotArea,u=t.allSeriesPoints,g=u.length,h=e.getBooleanOption("stackedGraph"),d=e.getColors(),p={},v=function(t,e,a,n){if(t.lineTo(e,a),h)for(var r=n.length-1;r>=0;r--){var o=n[r];t.lineTo(o[0],o[1])}},f=g-1;f>=0;f--){var x=t.drawingContext,m=a[f];if(e.getBooleanOption("fillGraph",m)){var y=e.getNumericOption("fillAlpha",m),_=e.getBooleanOption("stepPlot",m),P=d[f],b=e.axisPropertiesForSeries(m),N=1+b.minyval*b.yscale;N<0?N=0:N>1&&(N=1),N=c.h*N+c.y;var w,S=u[f],M=n.n(S,0,S.length,o._getIteratorPredicate(e.getBooleanOption("connectSeparatedPoints",m))),X=NaN,Y=[-1,-1],T=n.Q(P),C="rgba("+T.r+","+T.g+","+T.b+","+y+")";x.fillStyle=C,x.beginPath();var k,A=!0;(S.length>2*e.width_||r.a.FORCE_FAST_PROXY)&&(x=o._fastCanvasProxy(x));for(var E,D=[];M.hasNext;)if(E=M.next(),n.E(E.y)||_){if(h){if(!A&&k==E.xval)continue;var O;A=!1,k=E.xval,O=void 0===(l=p[E.canvasx])?N:s?l[0]:l,w=[E.canvasy,O],_?-1===Y[0]?p[E.canvasx]=[E.canvasy,N]:p[E.canvasx]=[E.canvasy,Y[0]]:p[E.canvasx]=E.canvasy}else w=isNaN(E.canvasy)&&_?[c.y+c.h,N]:[E.canvasy,N];isNaN(X)?(x.moveTo(E.canvasx,w[1]),x.lineTo(E.canvasx,w[0])):(_?(x.lineTo(E.canvasx,Y[0]),x.lineTo(E.canvasx,w[0])):x.lineTo(E.canvasx,w[0]),h&&(D.push([X,Y[1]]),s&&l?D.push([E.canvasx,l[1]]):D.push([E.canvasx,w[1]]))),Y=w,X=E.canvasx}else v(x,X,Y[1],D),D=[],X=NaN,null===E.y_stacked||isNaN(E.y_stacked)||(p[E.canvasx]=c.h*E.y_stacked+c.y);s=_,w&&E&&(v(x,E.canvasx,w[1],D),D=[]),x.fill()}}}},e.a=o},UrnS:function(t,e,a){"use strict";a("SAj3");var n=a("RZAc"),r=function(){};(r.prototype=new n.a).extractSeries=function(t,e,a){for(var n,r,o,i,l,s=[],c=a.get("logscale"),u=0;u<t.length;u++)n=t[u][0],o=t[u][e],c&&null!==o&&(o[0]<=0||o[1]<=0)&&(o=null),null!==o?(i=o[0],l=o[1],null===i||isNaN(i)?s.push([n,i,[i,l]]):(r=100*(l?i/l:0),s.push([n,r,[i,l]]))):s.push([n,null,[null,null]]);return s},r.prototype.rollingAverage=function(t,e,a){e=Math.min(e,t.length);var n,r=[],o=0,i=0;for(n=0;n<t.length;n++){o+=t[n][2][0],i+=t[n][2][1],n-e>=0&&(o-=t[n-e][2][0],i-=t[n-e][2][1]);var l=t[n][0],s=i?o/i:0;r[n]=[l,100*s]}return r},e.a=r}}]);
//# sourceMappingURL=vendors~d939e436.77b5797f9288e353d40f.bundle.map