import React, {PropTypes} from 'react';

const NumberUsage = props => (
	<div>
		<table>
			<thead>
				<tr>
					<th>Number</th>
					<th># of calls</th>
					<th>Minutes used</th>
				</tr>
			</thead>
			<tbody>
				{props.numbers.map((entry) => (
					<tr>
						<td>{entry.number}</td>
						<td>{entry.count}></td>
						<td>{entry.minutes}</td>
					</tr>
				))}
			</tbody>
		</table>
	</div>
);

NumberUsage.propTypes = {
	numbers: PropTypes.array,
};

export default NumberUsage;
