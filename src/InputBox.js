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
//		this.submit = this.submit.bind(this);
		this.autoCompleteInput = this.autoCompleteInput.bind(this);
//		this.updateInputBoxes = this.updateInputBoxes.bind(this);
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
//	getStateListener(newState){
//		console.log( 'before unmount', newState);
//	 	console.log(document.getElementsByClassName('form-control destin').length);
//	}

	autoCompleteInput(newState){
//		console.log('autoCompleteInput:thisState ', newState);
		let offset = 0;
		
		if(newState){						
			let len = Object.keys(newState).length;
			console.log('newstate, len ', newState, len);
			offset = 1
			let requests = [];
			let startDestination = '';
			let nextDestination = '';

			for(var i = 0; i < len - 1; i++) {
			//	let url = "https://maps.googleapis.com/maps/api/directions/json?origin=" + this.state.startDestination  + "&destination=" + this.state.nextDestination + "&key=AIzaSyBQ9sJrwFDMV8eMfMsO9gXS75XTNqhq43g"
				if(!newState[i].formatted_address) startDestination = newState[i];		
				else startDestination = newState[i].formatted_address;
		
				if(!newState[i + 1].formatted_address) nextDestination = newState[i + 1];		
				else nextDestination = newState[i + 1].formatted_address;

				var url = "https://maps.googleapis.com/maps/api/directions/json?origin=" + startDestination  + "&destination=" + nextDestination + "&key=AIzaSyBQ9sJrwFDMV8eMfMsO9gXS75XTNqhq43g"
					
				let request = {
					origin: startDestination,
					destination: nextDestination,
					travelMode: 'DRIVING'
				}
				requests.push(request);
				console.log('request in Top section', request);
			}
			console.log('requests in Top section', requests);
			this.props.renderRoute(requests, url);
		}
		
		let autocomplete =[];
		let inputs = document.getElementsByClassName('form-control destin');
		let inputCount = document.getElementsByClassName('form-control destin').length - offset;
		
//		console.log('autoCompleteInput called, offset', offset);
		const autocompleteOptions = {
			types: ['(cities)'],
 		    componentRestrictions: { country: "us" }
		}

		for(let i = 0; i < inputCount; i++){
			let googleAutoComplete = new google.maps.places.Autocomplete(inputs[i], autocompleteOptions);
			autocomplete.push(googleAutoComplete);
			for( let j = 0; j < inputCount; j++){
//				console.log(`input ${ i } input[i].value, thisState`, inputs[i].value, this.state);
				let obj = this.state;	
				obj[`${ i }`] = inputs[i].value
//				this.setState(obj);		
//				console.log('outside of listener', this.state);
			}		
		
			function wrapper(i, newState){
				let inputNum = i;
				let updatedState = null;
				if(newState){
					updatedState = newState;
				}
//				let destinsArray = [];
//				console.log('wrapper called, i',i, newState)				
				googleAutoComplete.addListener('place_changed', ( ) => {
//				console.log('marker', this.props.numDestination);	
//				console.log('addListener called, updatedState ', updatedState)
//					if(this.props.markers.length !== this.props.numDestination && this.props.markers.length !== 0){
//					 this.props.removeMarker(this.props.numDestination);
//					}									
					//var stateKeys = Object.keys(this.state)
					//var lastDestin = stateKeys[stateKeys.length - 1];
					//console.log('num destins',this.props.numDestination, 'state:', lastDestin, 'state obj', this.state);
					
					const place = googleAutoComplete.getPlace();
//					const address = place.formatted_address;
					let stateObj = this.state
					let keysArray = Object.keys(this.state).length;

					if(updatedState){
				   		keysArray = Object.keys(updatedState).length;
						stateObj = updatedState;
					}				   	
					stateObj[`${ inputNum }`] = place;
					this.setState(stateObj);	

					
					console.log('inside of listener', this.state);
/*
					if (this.props.markers.length === 0){
						this.setState({ startDestination: address })
					
					}else{
						this.setState({ nextDestination: address })
					
					}


					if(this.state.startDestination.length && this.state.nextDestination.length){
*/
				//					let stateObj = this.getStateListener();
//					let numDestins = Object.keys(stateObj);
//					console.log('stateObj', stateObj);
//					console.log('keysArray',keysArray)
					let requests = [];
					let urls = [];
					let startDestination = '';
					let nextDestination = '';

// 					console.log(keysArray.length)
//					if( keysArray.length === 1 || keysArray.length === 0 ){
						//console.log('MIN TWO DESTINATIONS');
//					}else{
					for(var i = 0; i < keysArray - 1; i++) {
					//	let url = "https://maps.googleapis.com/maps/api/directions/json?origin=" + this.state.startDestination  + "&destination=" + this.state.nextDestination + "&key=AIzaSyBQ9sJrwFDMV8eMfMsO9gXS75XTNqhq43g"
						if(!stateObj[i].formatted_address) startDestination = stateObj[i];		
						else startDestination = stateObj[i].formatted_address;
				
						if(!stateObj[i + 1].formatted_address) nextDestination = stateObj[i + 1];		
						else nextDestination = stateObj[i + 1].formatted_address;

						var url = "https://maps.googleapis.com/maps/api/directions/json?origin=" + startDestination  + "&destination=" + nextDestination + "&key=AIzaSyBQ9sJrwFDMV8eMfMsO9gXS75XTNqhq43g"
					
						let request = {
							origin: startDestination,
							destination: nextDestination,
							travelMode: 'DRIVING'
						}
						requests.push(request);
						urls.push(url);						
						//this.props.renderRoute(request, url);
					}
					console.log('requests, urls', requests, urls);
					this.props.renderRoute(requests, urls);

//					}
//					}

//					const position = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
//					this.props.addMarker({ address, position });
					let position;
					let address;
//					console.log('markers', this.props.markers.length);
					
//					console.log('markers', this.props.markers);
					if(this.props.markers.length === 0 || this.props.markers.length === 1){
						let index = 0;
						if(stateObj[1]) index = 1;
						console.log('stateObj, markers.length, index',stateObj, this.props.markers.length,index)
						position = new google.maps.LatLng(stateObj[index].geometry.location.lat(), stateObj[index].geometry.location.lng());				 
						address = stateObj[index].formatted_address
							
						if(this.props.markers.length === 0 || this.props.markers.length === 1 && index === 1){
							this.props.addMarker({ address, position });
						}else if(this.props.markers.length === 1 && index == 0){	
							flag = true;								
							this.props.changeMarker({ address, position }, 0, flag );
						}
					}else{
//						var len = Object.keys(this.state).length - 1;
//						console.log('this.state[inputNum]',this.state, this.state[inputNum],'inputnum:', inputNum, 'i', i)
					
						if(inputNum < keysArray - 1 || (inputNum === 0 || inputNum === 1)){
							console.log('inputNum, keysArray and stateObj[inputNum], stateObj',inputNum, keysArray, stateObj[inputNum], stateObj);
							var flag = false;
							position = new google.maps.LatLng(stateObj[inputNum].geometry.location.lat(), stateObj[inputNum].geometry.location.lng());
							address = stateObj[inputNum].formatted_address;
					
										
							if( inputNum === 0 || keysArray <= 2 ){
								flag = true;								
								this.props.changeMarker({ address, position }, inputNum, flag );
								this.props.removeRoute();
							}else{
								this.props.changeMarker({ address, position }, inputNum, flag );
							}			
						
						}else{
//		   					console.log('markers length, inputNum, stateObj:  ',this.props.markers.length, inputCount,stateObj);
							this.props.hideMarker(this.props.markers.length - 1);
							position = new google.maps.LatLng(stateObj[keysArray - 1].geometry.location.lat(), stateObj[keysArray - 1].geometry.location.lng());
							address = stateObj[keysArray - 1].formatted_address
							this.props.addMarker({ address, position });
						}
					}
			
				})
		   	}
			wrapper.call(this, i, newState)
		}

	}

	componentDidMount(){
	//	console.log('componentdidmount', this.state);
		this.autoCompleteInput(null);
	}

/*
	updateInputBoxes(newState){
		console.log('updateInputBoxes', newState)
		this.autoCompleteInput(newState);	
		console.log('ssssssssssss', this.state);
		var newState = Object.assign({}, this.state);
		var last = Object.keys(newState)[Object.keys(newState).length - 1];		
		let inputCount = document.getElementsByClassName('form-control destin').length;
//		console.log('inputCount, markersLength: ', inputCount, this.props.markers.length);

		if(inputCount === this.props.markers.length){
			this.props.removeMarker(this.props.markers.length - 1);
			this.props.showMarker(this.props.markers[this.props.markers.length - 1]);
		}	
		delete newState[last];
		this.autoCompleteInput(newState);
		this.props.removeRoute();

	}

	componentWillUpdate(){
		let inputCount = document.getElementsByClassName('form-control destin').length;
		let len = Object.keys(this.state).length;
		console.log('willUpdate inputCount, state length: ',inputCount, len);
		if(inputCount !== len){
			
		console.log('componentdidmount', this.state);this.autoCompleteInput();
			this.props.removeRoute();
		}	
	
	}
*/
	componentWillUnmount(){
//		console.log('willunmount', this.props);

//		console.log('marker length before unmount', this.props.markers.length - 1);	
		var newState = Object.assign({}, this.state);
		var last = Object.keys(newState)[Object.keys(newState).length - 1];		
		let inputCount = document.getElementsByClassName('form-control destin').length;

		if(inputCount === this.props.markers.length){
			this.props.removeMarker(this.props.markers.length - 1);
			this.props.showMarker(this.props.markers[this.props.markers.length - 1]);
		}
	
		delete newState[last];
		this.setState( { newState } )
		this.autoCompleteInput( newState );
		this.props.removeRoute();
		
	}

	render(){	    
//		console.log('render state', this.state);
		return (
			<div>
				<b>Destination { this.props.numDestination > 1 ? this.props.index : null }</b>
				<input className="form-control destin" id = { this.props.numDestination } >
				</input>
				<br />
			</div>
		)
	}
}

export default InputBox;
