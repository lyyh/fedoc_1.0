import React,{Component} from 'react';
import NavBtn from './NavBtn.jsx';

class NavHeader extends Component{
	render(){
		return (
			<div className='nav-header'>
				<h1>
				<span className='title'>树莓fe</span>
				<NavBtn dataClassName='nav-btn'/>	
				</h1>
			</div>
		)
	}
}

export default NavHeader;