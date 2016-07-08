import React,{Component} from 'react';
import {
	getNavList,
	handlerDir,
	handlerActive,
	initPage,
	updateByPage,
	handlerMdClick,
	linkMd,
	popHistory,
	selfAdaption
} from '../../actions/index_action';

let Nav = React.createClass({
	getInitialState() {
	    return {
	        navlist: []
	    };
	},
	componentWillMount() {
	     //多级菜单
		getNavList(this)
	},
	componentDidMount() {
		//多级菜单
		getNavList(this)
		///初始化markdow页面
		initPage()
		//绑定文件夹点击事件
		handlerDir()
		//处理md文件点击事件
		handlerMdClick()
		//markdown内容中的超链接（跳转到其他文档）
		linkMd()
		//自适应
		selfAdaption()
	},
	render(){

		let mainlist = this.state.navlist;

		const mapChildren = function(elements){
			 if (elements.children && elements.children.length) {
			 	    return elements.children.map(function (eleeach,index) {

			 	    return eleeach.value?
			 	    <div key={index}><li data-path={eleeach.value} className='md'>{eleeach.name}</li>
			 	    <ul>{mapChildren(eleeach)}</ul></div>
			 	  		:
			 	  	 <div key={index}><li data-path='directory' className='right'>{eleeach.name}</li>
			 	  	 <ul>{mapChildren(eleeach)}</ul></div>
                	})
		}
	}

		const listContent = mainlist.map(function(element,index){
			return (<div className='navlist' key={index}><p className='right'>{element.name}</p><ul>
					{
						mapChildren(element)
                	}
                	</ul></div>)

		})

		return (
			<div className="nav-content">{listContent}</div>
		)
	}	  
})

class NavContent extends Component{
	render(){
		return (
			<Nav/>
		)
	}
}

export default NavContent;