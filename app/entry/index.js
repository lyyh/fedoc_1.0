import React from 'react';
import ReactDOM from 'react-dom';
import Nav from '../containers/Nav.jsx';
import Markdown from '../containers/Markdown.jsx';
import ProgressBar from '../containers/ProgressBar.jsx';
import StyleSheet from './all.less';
import StyleSheet1 from './reset.css'

ReactDOM.render(
    <div className='docbox'>
	<ProgressBar/>
    <Nav/>
    <Markdown/>
    </div>,
    document.getElementById('container')
)
