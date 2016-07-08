import React,{Component} from 'react';
import StyleSheet from './bar.less';
import PubSub from 'pubsub-js';


let ProgressBar = React.createClass({
	getInitialState() {
    	return {
      		remain: '100%'
    	};
  	},
	componentDidMount() {
    	this.pubsub_token = PubSub.subscribe('load', function (topic, product) {
    		
    		this.setState({
					remain: '100%'
			})

    		$('.progress-bar').show()

      		this.timer = setInterval(function(){

			if(parseInt(this.state.remain) < 10){
				clearInterval(this.timer)
			}

			var length = parseInt(this.state.remain)/Math.floor(Math.random()*2+1)
			this.setState({
					remain: length+'%'
				})


	 		}.bind(this),100)
   	 	
      }.bind(this))

   	 	this.pubsub_token = PubSub.subscribe('complete',function(topic,product){
   	 		this.setState({
   	 			remain: 0
   	 		})

   	 		setTimeout(function(){
   	 			clearInterval(this.timer)
   	 			this.setState({
   	 				remain: -1
   	 			})

   	 			$('.progress-bar').hide()
   	 			
   	 		}.bind(this),100)
   	 		
   	 	}.bind(this))
  	},

  	componentWillUnmount() {
    	PubSub.unsubscribe(this.pubsub_token);
  	},


	render(){
		let reLength = this.state.remain

		if(reLength==-1){
			reLength = '100%'
		}
		let objStyle = {
			width: reLength
		}

		return (
			<div className='progress-bar'>
				<div className='progress-remain' style={objStyle}></div>
			</div>
		)
	}
})

export default ProgressBar