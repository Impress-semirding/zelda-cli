var L = require('./../leaflet');
var $ = require('jquery');
var dmap = L.dmap = L.dmap || {};
var Utils = require('./../core/utils');
// var requestAnimationFrame = Utils.requestAnimationFrame.bind(Utils);

var Bar3D = L.Class.extend({
  isRotateZ: false,
  options: {
    column: {
      color: ['red', 'blue'],
      width: 10,
      height: 30,
      deg: 50,
      opacity: 1,
    },
    popuper: {
      color: 'blue',
      width: 75,
      height: 15,
      borderRadius: 1,
      opacity: 1,
      top: 20,
      left: -30,
    }
  },

  initialize: function(options) {
    this.options = Utils.deepMerge(this.options, options);
    this.columnOpts = this.options.column;
    this.popuperOpts = this.options.popuper;
  },

  addTo: function(map) {
    if (!map) return;
    this._map = map;
  },

  data: function(data) { //灌入数据
    this._data = data;
  },

  init: function() {
    var columns = this.columns;
    var data = this._data;
    var column = this.columns = $('\
        <div class="line3d">\
          <div class="linedrawer">\
            <div class="lineLeft"></div>\
            <div class="lineRight"></div>\
          </div>\
          <div class="popuper"></div>\
          <div class="circlebottom"></div>\
          <div class="circletop"></div>\
        </div>');
    $('.leaflet-marker-pane').append(column);
    this.line3dNode = column.find('.line3d');
    this.linedrawerNode = column.find('.linedrawer');

    this.lineLeft = column.find('.lineLeft');
    this.lineRight = column.find('.lineRight');

    this.popuperNode = column.find('.popuper');

    this.initEventsMap();
  },

  render: function() {
    var columnOpts = this.columnOpts;
    var width = columnOpts.width;
    var color = columnOpts.color;
    var height = 2;
    $('.line3d').css({
      width: width * 2 + 'px'
    });
    $('.linedrawer').css({
      // 'display': 'inline-block',
      'width': width * 2 + 'px',
      'height': height + 'px',
      'opacity': this.columnOpts.opacity
    });
    $('.lineLeft').css({
      'background-color': color[0],
      'width': width + 'px'
    });
    $('.lineRight').css({
      'background-color': color[1],
      'margin-left': width + 'px',
      'width': width + 'px'
    });

    this.updatePos();
    this.rotate();
  },

  updatePos: function(e) {
    var d = this._data;
    var map = this._map;
    var latlng = L.latLng(d.lng, d.lat);

    // this.heightTrans = d.value || 40;
    this.heightTransLeft = d.value[0] || 40;
    this.heightTransRight = d.value[1] || 40;
    var divLocat;
    if (e) {
      divLocat = map._latLngToNewLayerPoint(latlng, e.zoom, e.center).round();
    } else {
      divLocat = map.latLngToLayerPoint(latlng);
    }
    var divLocatX = divLocat.x;
    var divLocatY = divLocat.y;
    var transform = 'translate3d(' + divLocatX + 'px' + ',' + divLocatY + 'px' + ',' + '0' + ')';
    var origin = divLocatX + 'px ' + divLocatY + 'px';

    this.linedrawerNode.css({
      'height': this.heightTransLeft > this.heightTransRight ? this.heightTransLeft : this.heightTransRight
    }); //different height

    this.lineLeft.css({
      'height': this.heightTransLeft
    });
    
    this.lineRight.css({
      'height': this.heightTransRight,
      'margin-top': '-' + this.heightTransLeft + 'px' 
    })


    var line = this.columns;
    line.css({
      'transform': 'rotateX(' + 90 + 'deg)' + transform,
      '-webkitTransform': 'rotateX(' + 90 + 'deg)' + transform,
      '-webkitTransformOrigin': origin,
      'transformOrigin': origin
    });
  },

  initEventsMap: function() {
    var update = this.updatePos.bind(this);
    this._map
      .on('zoomanim', update);
    requestAnimationFrame(function() {
      update();
    });
  },

  popUpper: function() {
    var data = this._data;
    var map = this._map;
    var popuper = this.popuperNode;
    var value1 = data.value[0];
    var value2 = data.value[1];
    textRotator = $('<div class="text-rotator"><span class="span-text">' + 'value1 is ' + value1 + ' value2 is ' + value2 + '</span></div>')
    popuper.append(textRotator);
    var popuperOpts = this.popuperOpts;
    textRotator.css({
      'transform': 'translate3d(' + popuperOpts.left + 'px' + ',' + popuperOpts.top + 'px' + ',' + 0 + 'px' + ')' + ' ' + 'rotateX(' + 180 + 'deg)',
      'background-color': popuperOpts.color,
      'width': popuperOpts.width + 'px',
      'height': popuperOpts.height + 'px',
      'border-radius': popuperOpts.borderRadius + 'px',
      'opacity': popuperOpts.opacity,
    });
  },


  initEventsColumn: function() {
    $('.line3d').on('mouseover', function(e) {
      $(e.currentTarget).find('.popuper').css('visibility', 'visible');
    });
    $('.line3d').on('mouseout', function(e) {
      $(e.currentTarget).find('.popuper').css('visibility', 'hidden');
    });
  },

  rotate: function() {
    this.angle = 0;
    this.xdrag = 0;
    var self = this;
    var isDown = false;
    var xpos = 0;
    var node = $(this._map._container);
    this._map.on('rotate', function(e, d) {
      var rotation = -e.rotation;
      // console.log(self.linedrawerNode, self.popuperNode);
      self.linedrawerNode.css({
        'transform': 'rotateY(' + rotation + 'deg)'
      });

      // console.log(rotation);
      self.popuperNode.css({
        'transform': 'rotateY(' + rotation + 'deg)'
      });
    })



    // node.on('mousedown', function(e){
    //   if(!self.isRotateZ) return;
    //       xpos=e.pageX;
    //       isDown = true;
    //   })
    //     .on('mousemove', function (e) {
    //       if(!self.isRotateZ || !isDown) return;
    //       self.xdrag =(xpos-e.pageX)/4;
    //       var rotation = 'rotateY('+(self.angle+self.xdrag)*-1%360+'deg)'; 
    //       $('.linedrawer').css({'transform': rotation });
    //       $('.popuper').css({'transform': rotation });
    //     })
    //     .on('mouseup', function () {
    //       if(!self.isRotateZ) return;
    //       isDown=false;
    //       console.log(self.angle, self.xdrag)
    //       self.angle = self.angle+self.xdrag;
    //     });
  },

  // disableRotate: function () {
  //   this.isRotateZ = false;
  //   $('.linedrawer').css({'transform': 'rotateY('+0+'deg)' });
  //   $('.popuper').css({'transform': 'rotateY('+0+'deg)' });
  // },

  // enableRotate: function () { 
  //   this.isRotateZ = true;
  // },

  // bar.animateIn();

});

dmap.Bar3D = Bar3D;
dmap.bar3d = function(options) {
  return new dmap.Bar3D(options);
};
module.exports = Bar3D;