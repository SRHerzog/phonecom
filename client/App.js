import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import _ from 'lodash';

import NavigationDrawer from 'react-md/lib/NavigationDrawers';
import Toolbar from 'react-md/lib/Toolbars';
import ListItem from 'react-md/lib/Lists/ListItem';
import Snackbar from 'react-md/lib/Snackbars';

import { fetchMedia, fetchRoutes, fetchQueues, fetchMenus, fetchNumbers, fetchExtensions, removeToast } from './actions';
import functionList from './functionList';

import './styles/index.scss';

class App extends Component {
    constructor() {
        super();

        this.state = {
            fullNav: false,
            loaded: false,
        };

        this.toggleFullNav = this.toggleFullNav.bind(this);
    }
    componentWillReceiveProps(newProps) {
        const fetch = {
            menus: this.props.fetchMenus,
            queues: this.props.fetchQueues,
            routes: this.props.fetchRoutes,
            media: this.props.fetchMedia,
            numbers: this.props.fetchNumbers,
            extensions: this.props.fetchExtensions,
        };

        if (!this.state.loaded && newProps.id) {
            _.forEach(['media', 'routes', 'queues', 'menus', 'numbers', 'extensions'], (item) => {
                if (newProps[item] === null) {
                    fetch[item]();
                }
            });
            this.setState({
                loaded: true,
            });
        }

        if (!newProps.id) {
            this.setState({
                loaded: false,
            });
        }
    }

    toggleFullNav() {
        this.setState({
            fullNav: !this.state.fullNav,
        });
    }

    render() {
        const loggedIn = (this.props.location.pathname !== '/' && this.props.location.pathname !== '/login');
        return (
            <div className="react">
                {!!this.props.id &&
                    <NavigationDrawer
                        onVisibilityToggle={!this.props.id ? () => {} : undefined}
                        navItems={functionList.map(item =>
                            <ListItem
                                key={item.name}
                                onClick={() => browserHistory.push(item.link)}
                                primaryText={item.name}
                                active={item.link === this.props.location.pathname}
                            />
                        )}
                        drawerClassName="md-toolbar-relative"
                        desktopDrawerType={NavigationDrawer.DrawerTypes.CLIPPED}
                        tabletDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY}
                        toolbarTitle="OTT Telephone Services"
                        includeDrawerHeader={false}
                        children={this.props.children}
                    />
                }
                {!this.props.id ?
                    <Toolbar
                        colored
                        title="OTT Telephone Services"
                    /> : null
                }
                {!this.props.id ? this.props.children : null}
                <Snackbar style={{ zIndex: 30 }} {...this.props.snackbar} onDismiss={this.props.removeToast} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    id: state.account.id,
    media: state.media.items,
    routes: state.routes.items,
    queues: state.queues.items,
    menus: state.menus.items,
    numbers: state.numbers.items,
    extensions: state.extensions.items,
    snackbar: state.snackbar,
    history: state.calls.history,
    sms: state.sms.history,
});

const mapDispatchToProps = {
    fetchRoutes: fetchRoutes.request,
    fetchMedia: fetchMedia.request,
    fetchMenus: fetchMenus.request,
    fetchQueues: fetchQueues.request,
    fetchNumbers: fetchNumbers.request,
    fetchExtensions: fetchExtensions.request,
    removeToast,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
