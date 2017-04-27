import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import Toolbar from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons';

import {userLogout} from '../../actions';

import '../../styles/index.scss';

const Header = (props) => (
    <div />
);

const mapDispatchToProps = {
    userLogout,
};

export default connect(null, mapDispatchToProps)(Header);
