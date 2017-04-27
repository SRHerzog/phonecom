import React, {PropTypes} from 'react';
import {Link} from 'react-router';

const MyUsage = props => (
	<div>
		<h1>My Usage</h1>
		<table>
			<tbody>
				<tr>
					<td>Minutes Used*:</td>
					<td>{props.used || 21}</td>
				</tr>
				<tr>
					<td>Remaining Minutes</td>
					<td>{props.remaining || 79} of {props.maximum || 100}</td>
				</tr>
				<tr>
					<td>Additional Usage</td>
					<td>{props.additional || '$0.00'}</td>
				</tr>
				<tr>
					<td><Link to="/call-logs">View Call Logs</Link></td>
					<td>*since {props.startDate || '10/7/2016'}</td>
				</tr>
			</tbody>
		</table>
	</div>
);

MyUsage.propTypes = {
	used: PropTypes.number,
	remaining: PropTypes.number,
	maximum: PropTypes.number,
	additional: PropTypes.number,
	startDate: PropTypes.string,
};

export default MyUsage;
