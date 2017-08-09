import React,{ Component } from 'react';
import axios from 'axios';

class InputBox extends Component{

	constructor(){
		super();

		//this.state = {
		//	startDestination: [],
		//	nextDestination: []
		//}
		this.state = {};

		this.autoCompleteInput = this.autoCompleteInput.bind(this);
//		this.updateStateOnUnmount = this.updateStateOnUnmount.bind(this);
	}
/*
	updateStateOnUnmount(){
		let inputs = document.getElementsByClassName('form-control destin');
		let inputCount = document.getElementsByClassName('form-control destin').length;
		for(let i = 0; i < inputCount - 1; i++){
			this.state = {};
			let obj = this.state;	
			obj[`${ i }`] = inputs[i].value
			this.setState(obj);	
			console.log('unmounting', this.state);
		}
	}
*/
	autoCompleteInput(){
		let autocomplete =[];
		let inputs = document.getElementsByClassName('form-control destin');
		let inputCount = document.getElementsByClassName('form-control destin').length;

		const autocompleteOptions = {
			types: ['(cities)'],
 		    componentRestrictions: { country: "us" }
		}

		for(let i = 0; i < inputCount; i++){
			let googleAutoComplete = new google.maps.places.Autocomplete(inputs[i], autocompleteOptions);
			autocomplete.push(googleAutoComplete);
			for( let j = 0; j < inputCount; j++){
//				console.log(`input ${ i } `, inputs[i].value);
				let obj = this.state;	
				obj[`${ i }`] = inputs[i].value
				this.setState(obj);		
				console.log('outside of listener', this.state);
			}		
		
			function wrapper(i){
				let inputNum = i;
				let destinsArray = [];
				
				googleAutoComplete.addListener('place_changed', () => {
//				console.log('marker', this.props.numDestination);	
			
//					if(this.props.markers.length !== this.props.numDestination && this.props.markers.length !== 0){
//					 this.props.removeMarker(this.props.numDestination);
//					}									
					//var stateKeys = Object.keys(this.state)
					//var lastDestin = stateKeys[stateKeys.length - 1];
					//console.log('num destins',this.props.numDestination, 'state:', lastDestin, 'state obj', this.state);
					
					const place = googleAutoComplete.getPlace();
//					const address = place.formatted_address;
				  	let obj = this.state;
				   	obj[`${ inputNum }`] = place;
					this.setState(obj);	
					
					console.log('inside of listener', this.state);
/*
					if (this.props.markers.length === 0){
						this.setState({ startDestination: address })
					
					}else{
						this.setState({ nextDestination: address })
					
					}


					if(this.state.startDestination.length && this.state.nextDestination.length){
*/
					let keysArray = Object.keys(this.state);
					let requests = [];
					let startDestination = '';
					let nextDestination = '';

// 					console.log(keysArray.length)
//					if( keysArray.length === 1 || keysArray.length === 0 ){
						//console.log('MIN TWO DESTINATIONS');
//					}else{
					for(var i = 0; i < keysArray.length - 1; i++) {
					//	let url = "https://maps.googleapis.com/maps/api/directions/json?origin=" + this.state.startDestination  + "&destination=" + this.state.nextDestination + "&key=AIzaSyBQ9sJrwFDMV8eMfMsO9gXS75XTNqhq43g"
						if(!this.state[i].formatted_address) startDestination = this.state[i];		
						else startDestination = this.state[i].formatted_address;
				
						if(!this.state[i + 1].formatted_address) nextDestination = this.state[i + 1];		
						else nextDestination = this.state[i + 1].formatted_address;

						var url = "https://maps.googleapis.com/maps/api/directions/json?origin=" + startDestination  + "&destination=" + nextDestination + "&key=AIzaSyBQ9sJrwFDMV8eMfMsO9gXS75XTNqhq43g"
					
						let request = {
							origin: startDestination,
							destination: nextDestination,
							travelMode: 'DRIVING'
						}
						requests.push(request);
//						this.props.renderRoute(request, url);
					}
					console.log('requests', requests);
					this.props.renderRoute(requests, url);

//					}
//					}

//					const position = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
//					this.props.addMarker({ address, position });
					let position;
					let address;
//					console.log('markers', this.props.markers.length);
//console.log('markers', this.props.markers);
					if(this.props.markers.length === 0 || this.props.markers.length === 1){
						position = new google.maps.LatLng(this.state[this.props.markers.length].geometry.location.lat(), this.state[this.props.markers.length].geometry.location.lng());				 
						address = this.state[this.props.markers.length].formatted_address
						this.props.addMarker({ address, position });
					}else{
						var len = Object.keys(this.state).length - 1;
//						console.log('this.state[inputNum]',this.state, this.state[inputNum],'inputnum:', inputNum, 'i', i)
						let inputCount = document.getElementsByClassName('form-control destin').length - 1;

						if(inputNum < inputCount || (inputNum === 0 || inputNum === 1)){
							console.log('inputNum,i and state',inputNum, inputCount, this.state[inputNum]);
							var flag = false;
							position = new google.maps.LatLng(this.state[inputNum].geometry.location.lat(), this.state[inputNum].geometry.location.lng());
							address = this.state[inputNum].formatted_address
					
										
							if( inputCount <= 2 ){
								flag = true;
								
								this.props.changeMarker({ address, position }, inputNum, flag );
							}else{
								this.props.changeMarker({ address, position }, inputNum, flag );
							}			
						
						}else{
							console.log('markers, inputCount, this.state.length ',this.props.markers.length, inputCount, len);
							this.props.hideMarker(this.props.markers.length - 1);
							position = new google.maps.LatLng(this.state[len].geometry.location.lat(), this.state[len].geometry.location.lng());
							address = this.state[len].formatted_address
							this.props.addMarker({ address, position });
						}
					}
			
				})
		   	}
			wrapper.call(this,i)
		}

	}

	componentDidMount(){
		this.autoCompleteInput();
	}

	componentWillUnmount(){
		this.props.removeMarker(this.props.markers.length - 1);
		this.props.showMarker(this.props.markers[this.props.markers.length - 1]);		
		var newState = Object.assign({}, this.state);
		var last = Object.keys(newState)[Object.keys(newState).length - 1];
		
		delete newState[last];
		this.setState({ newState });
	}

	render(){

		return (
			<div>
				<b>Destination { this.props.numDestination > 1 ? this.props.index : null }</b>
				<input className="form-control destin" id={ this.props.numDestination } >
				</input>
				<br />
			</div>
		)
	}
}

export default InputBox;
