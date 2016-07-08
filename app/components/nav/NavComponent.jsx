import React from 'react';
import NavHeader from './NavHeader.jsx';
import NavContent from './NavContent.jsx';
import NavFooter from './NavFooter.jsx';
import StyleSheet from './nav.less';

class Nav extends React.Component {
	render(){
		return(
			<div className='nav'>
				<NavHeader/>
            	<NavContent/>
            	<NavFooter/>
			</div>			
			)
	}	
}

export default  Nav;