import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, IndexRoute, Route, browserHistory } from 'react-router';

import App from './App';
import NotFound from './NotFound';
import LoginContainer from './components/account/LoginContainer';
//  import Register from './components/account/Register';

import store from './store';
import functionList from './functionList';

function requireAuth(nextState, replace) {
	if ((!nextState.routes[1] || nextState.routes[1].noAuth) && !!localStorage.getItem('token')) {
		replace('/numbers');
	}
	if (nextState.routes[1] && !nextState.routes[1].noAuth && !localStorage.getItem('token')) {
		replace('/');
	}
}

render((
	<Provider store={store}>
		<Router history={browserHistory}>
			<Route path="/" component={App} onEnter={requireAuth}>
				<IndexRoute component={LoginContainer} noAuth />
				<Route path="login" component={LoginContainer} noAuth />
				{functionList.map((item, index) => (
					<Route
						path={item.link}
						key={index}
						onEnter={requireAuth}
						component={item.component}
					/>
				))}
			</Route>
			<Route path="*" component={NotFound} />
		</Router>
	</Provider>
), document.getElementById('application'));
