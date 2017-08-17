const router = require('express').Router();
const getRoute = require('request');
const decodePoints = require('./db').decodePoints;
const getStateMiles = require('./db').getStateMiles;

router.get('/',(req,res,next)=>{
	//console.log('hit api route',req.query[0]);

	getRoute(req.query[0], (error, response, body) => {
		
		if(!error && response.statusCode == 200){
			decodePoints(body, (err, result) => {
				if(!err){
					console.log('result', result);
					getStateMiles(result, (err, stateMiles) => {
						if(!err){
							res.json(stateMiles);
						}else{
							console.log('in routes.js error ruturned from getStateMiles')
							res.statusCode(403);
						}
					})
				}else{
					console.log('in routes.js error ruturned from decodePoints')
					res.statusCode(403);
				}
			})	
		}else{
			console.log('in routes.js error returned from getRoute');
			response.statusCode(403);
		}
 	})
})


module.exports = router;
