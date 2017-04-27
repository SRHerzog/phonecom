import React, {PropTypes} from 'react';
import {Link} from 'react-router';

const MyService = props => (
	<div>
		<h1>My Service</h1>
		<table>
			<tbody>
				<tr>
					<td>Unlimited users:</td>
					<td>{props.users || 2}</td>
					<td><Link to="/manage-users">Edit</Link></td>
				</tr>
				<tr>
					<td>Call Recording</td>
					<td>{props.recordingOn || 'On'}</td>
					<td><Link to="/settings#recording">Edit</Link></td>
				</tr>
				<tr>
					<td>Hold Music</td>
					<td>{props.holdMusic || 'Off'}</td>
					<td><Link to="/settings#holdmusic">+ Add</Link></td>
				</tr>
			</tbody>
		</table>
	</div>
);

MyService.propTypes = {
	users: PropTypes.number,
	recordingOn: PropTypes.bool,
	holdMusic: PropTypes.bool,
};

export default MyService;
