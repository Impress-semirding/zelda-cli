/*
* @Author: zhouningyi
* @Date:   2017-01-01 15:51:11
* @Last Modified by:   zhouningyi
* @Last Modified time: 2017-05-31 11:05:27
*/

'use strict';
import './app.css';
import _ from 'lodash';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import darkBaseTheme        from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider     from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme          from 'material-ui/styles/getMuiTheme';
injectTapEventPlugin();

import ZUtils   from 'zcontrol/lib/utils';
import Controls from 'zcontrol';

import Map       from './../components/Map';
import TileLayer       from './../components/TileLayer';
const comName = 'ScatterMarkers';
import Com from './../components/ScatterMarkers';

import factory from './../lib/factory';
import Bound   from './../components/selectors/Bound';
import zfilter from 'zfilter';

// const Layer      = factory(Bound);
const options    = Com.defaultProps.options;
let validation = ZUtils.toValidation(options);
// const options = Com.defaultProps.options;
// const validate = ZUtils.toValidation(options);

const lat = d => d.lat;
const lng = d => d.lng;
const id  = d => d._id;
const mapO = {
	center: {
		lng: 121.350,
		lat: 31.165
	},
	zoom: 5
};
let dataFilter = (ds) => ds;

const onChange = (options) => {
	validation = ZUtils.mergeObject2Validation(validation, options);
	draw(mockData, options);
};

const onSelectChange = (filter) => {
	dataFilter = zfilter.generate(filter);
	mockData = mockData.map((d) => {
		d.lat = parseFloat(d.lat, 10);
		d.lng = parseFloat(d.lng, 10);
		return d;
	})
	draw(mockData, options, dataFilter);
};

//<Bound options={options || {}} onChange={onSelectChange}/>
const draw = (data, options, filter) => {
	filter = filter || dataFilter;
	// data = filter(data || []);
	ReactDOM.render(
		<MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
		  <div className="container all">
			  <div className="control">
			     <Controls data={validation} onChange={onChange}/>
			   </div>
	       <div className="app">
			    <Map options={mapO}>
			      <TileLayer key="baseTileLayer"/>
			      <Com data={data} options={options} key="baseVisualLayer"/>
			    </Map>
	       </div>
	     </div>
    </MuiThemeProvider>,
    document.querySelector('.main')
  );
};

let mockData;
const redraw = () => {
	fetch(`./components/${comName}/data.json`)
	.then(d => d.json())
	.then(ds => {
		mockData = ds;
		draw(ds);
	});
};

draw();
redraw();

// setTimeout(() => {
// 	ReactDOM.render(
//     <Map options={mapO}>
//     </Map>,
//   document.querySelector('.app')
// );
// }, 3000)
