import React, {PropTypes} from 'react';
import {Link} from 'react-router';

const MyBill = props => (
	<div>
		<h1>My Bill</h1>
		<table>
			<tbody>
				<tr>
					<td>Last Payment:</td>
					<td>{props.paymentAmount || '$7,675.00'}{props.paymentDate || '10/14/2016'}</td>
				</tr>
				<tr>
					<td>Account Balance</td>
					<td>{props.balance || '$0.00'}</td>
				</tr>
			</tbody>
		</table>
		<Link to="/billing">View My Bill</Link><Link to="/pay">Pay My Bill</Link>
	</div>
);

MyBill.propTypes = {
	paymentAmount: PropTypes.number,
	paymentDate: PropTypes.string,
	balance: PropTypes.number,
};

export default MyBill;
