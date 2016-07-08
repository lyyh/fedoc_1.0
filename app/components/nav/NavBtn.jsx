import React from 'react';

class NavBtn extends React.Component{
	render(){
		return (
			<a className={this.props.dataClassName}>
                    <span className="btn-bar"></span>
                    <span className="btn-bar"></span>
                    <span className="btn-bar"></span>
                </a>
		)
	}
}

export default NavBtn;