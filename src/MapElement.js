import React, { Component } from 'react';
import InputComponent from './InputComponent';
import TaxTable from './TaxTable';

import axios from 'axios';

class MapElement extends Component {

	constructor(props){
		super();
		this.state = {
			bounds: {},
			map: {},
			markers: [],	
			mapOptions: {
				center: new google.maps.LatLng(38.87234, -95.96919),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				zoom: 4

			},
			mapDiv: {},
			milesTable: [],
			request: [],
			directionRenderers: [],
			url: [],
			totalMiles: []
		}

		this.renderRoute = this.renderRoute.bind(this);
		this.removeRoute = this.removeRoute.bind(this);
		this.addMarker = this.addMarker.bind(this);
		this.showMarker = this.showMarker.bind(this);
		this.removeMarker = this.removeMarker.bind(this);
		this.hideMarker = this.hideMarker.bind(this);
		this.changeMarker = this.changeMarker.bind(this);
		this.generateRoute = this.generateRoute.bind(this);
		this.generateMileage = this.generateMileage.bind(this);
	}


	componentDidMount(){
		const mapDiv = document.getElementById("mapDiv");
		const bounds = new google.maps.LatLngBounds();
		bounds.extend(this.state.mapOptions.center);
		this.setState( { map: new google.maps.Map(mapDiv, this.state.mapOptions) });
		this.setState( { bounds } );
		this.setState( { mapDiv } );
    }
	
	addMarker({ address, position }, index){
//		console.log('adding marker', index);
		this.state.bounds.extend(position);
		this.state.map.fitBounds(this.state.bounds);
		let marker = new google.maps.Marker( { position: position } );
		if( index === 0 ){
			this.state.markers.unshift(marker);
		}else{
			this.state.markers.push(marker);
		}
		marker.setMap(this.state.map);
	}
 	
	showMarker( marker ){
//		console.log('old marker', marker);
		if(marker)
			marker.setMap(this.state.map);
	}

	removeMarker( index ){
		this.state.markers.forEach( (marker, _index) => {
			if(_index === index )
				marker.setMap(null);
		})
		this.state.markers.splice(index,1);
	}

	hideMarker( index ){
	//	console.log('this.state.markers:',this.state.markers);
	//	console.log('removeMaker(index:)',index);
		this.state.markers.forEach( (marker, _index) => {
			if(_index === index )
				marker.setMap(null);
		})
//		this.state.markers.splice(index,1);
	}

	changeMarker({ address, position }, index, flag ){
		let marker = new google.maps.Marker( { position: position } );
		this.state.markers.forEach( (mrk, _index) => {
			if(_index === index ){
//				console.log('before splice -  marker, and this.state.markers',  mrk, this.state.markers);

				if( (index === 0 || index === 1) && flag ){
//					console.log('before remove', this.state.markers, index);
					this.removeMarker( _index );
//					console.log('after remove, before add', this.state.markers);
					this.addMarker( marker, index )
//					console.log('after add', this.state.markers);
				}else{
					this.state.markers.splice(_index, 1, marker);
//					console.log('after splice', this.state.markers);
				}			
						}				
		})
	}

	renderRoute(request, url){
//		let obj = Object.assign({}, requests)
		this.setState( { request } )
		this.setState( { url } )
		console.log('renderRoute',this.state);
	}

	generateRoute(){
		let request = this.state.request;
		let map = this.state.map;
//		console.log('mapElement - request',request);
		let dirRenderers = [];
		let dirRenderersOrdered = [];

		for(let i = 0; i < request.length; i++){
			let req = request[i];
			let directionsService = new google.maps.DirectionsService();
//			console.log('req, request.lengh', req, request.length);
		
			directionsService.route(req, function(result, status){
				if(status === 'OK'){
					let directionDisplay = new google.maps.DirectionsRenderer({
						suppressMarkers: true
//						draggable: true	
					});
					directionDisplay.addListener('directions_changed', function(){
				//	directionDisplay.setMap(map);
				//	directionDisplay.setDirections(result);
					})
				
					//directionDisplay.setMap(map);
					directionDisplay.setDirections(result);
					dirRenderers.push(directionDisplay);
					//console.log('dirrenderers ', directionRenderers);					
					
					if(dirRenderers.length === request.length){
						let index = 0;
						for(let j = 0; j < dirRenderers.length; j++){
							dirRenderers[j].setMap(map);
//							console.log('checkinnn', dirRenderers[j].directions.request.origin.query, request[index].origin)
							while( dirRenderers[j].directions.request.origin.query != request[index].origin ){
								index++;
							}
							dirRenderersOrdered[index] = dirRenderers[j];
							index = 0;
						}
					}	
					
				}
			})	

		}
		this.state.directionRenderers = dirRenderersOrdered;
//		console.log('this.state.dirRend', this.state.directionRenderers);
	}

	removeRoute(){
		var len = this.state.directionRenderers.length - 1;
//		console.log('len', len);
		if(len > -1){
			this.state.directionRenderers[len].setMap(null);
			this.state.directionRenderers.splice(len, 1);
		}
//		console.log('after removing dirRend ', this.state.directionRenderers);
	}
/*	
	generateRoute(){
		let request = this.state.request;
		let map = this.state.map;
		let directionsService = new google.maps.DirectionsService();
		console.log('mapElement - request',request);
		directionsService.route(request, function(result, status){
			if(status === 'OK'){
				let directionDisplay = new google.maps.DirectionsRenderer({
					draggable: true	
				});
				directionDisplay.addListener('directions_changed', function(){
				//	directionDisplay.setMap(map);
				//	directionDisplay.setDirections(result);
				})
				directionDisplay.setMap(map);
				directionDisplay.setDirections(result);
			}
		})
	}

*/
	generateMileage(){
		let urls = this.state.url;
		let tmpTotal = 0;
		let tmpMiles = [];
		let resultState = '';
		let resultMiles = 0;
		let found = false;

//		console.log('urls', urls);
		for( let i = 0; i < urls.length; i++ ){
			console.log('urls, i: ', urls[i],i)
			axios.get('/api', { params: urls[i] })
			.then( result => {
//					console.log('result.data from /api', result.data)
					let stateMiles = [];
					let totalMiles = result.data.reduce( (memo, obj) => {
						let endPosition = obj.miles.indexOf('mi');
						let miles = Number(obj.miles.substring(0, endPosition));
						stateMiles.push({ state: obj.state, miles: miles });
						return memo += miles;
						
					},0);
					totalMiles = Math.round( totalMiles * 100 ) / 100;	
					tmpTotal += totalMiles;
		
					console.log(stateMiles, 'stateMiles');
					for(let j = 0; j < stateMiles.length; j++){	
						//let keys = Object.keys(stateMiles[j]);
						if( Array.isArray( stateMiles[j].state)){
							resultState = stateMiles[j].state[0]
						}else{
							resultState = stateMiles[j].state;
						}
						resultMiles = Math.round( stateMiles[j].miles * 100 ) / 100;
						console.log(resultMiles, resultState, j);
					

						for( let k = 0; k < tmpMiles.length; k++){
							if( tmpMiles[k].state === resultState ){
								tmpMiles[k].miles += resultMiles;
								tmpMiles[k].miles = Math.round( tmpMiles[k].miles * 100 ) / 100;
								console.log('tmpmiles in loop:', tmpMiles);
								found = true;
								break;
							}
						}

						if(!found || tmpMiles.length == 0){
							tmpMiles.push( { state: resultState, miles: resultMiles } );
							
							console.log('tmpmiles in not found', tmpMiles);
						}else{
							found = false;
						}
					}	
//					console.log('totalMiles, stateMiles', totalMiles, stateMiles)
//					console.log('this.state',this.state);
					if( i == urls.length - 1 ){
					   	this.setState( { totalMiles: tmpTotal } );
						this.setState( { milesTable: tmpMiles } );
					}
			})
		}
		
		//console.log('this.state.miles.states', this.state)
	}

	render(){
//		console.log('mapel', this.state);
		return (
		  <div className="row">
			<div id="mapDiv" className="col-xs-12" style={{ height: "350px", marginBottom: '20px' }}>
			</div>
			<InputComponent updateMainState = { this.updateMainState } renderRoute = { this.renderRoute } removeRoute = { this.removeRoute } markers = { this.state.markers } addMarker = { this.addMarker } showMarker = { this.showMarker } removeMarker = { this.removeMarker }  hideMarker={ this.hideMarker } changeMarker = { this.changeMarker }  milesTable = { this.state.milesTable } generateMileage = { this.generateMileage} generateRoute = { this.generateRoute } totalMiles = { this.state.totalMiles }/>
			<TaxTable milesTable = { this.state.milesTable } />	
   	      </div>

		)
	}

}

export default MapElement;
