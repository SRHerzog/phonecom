import React, {Component, PropTypes} from 'react';

import CallDetails from './CallDetails';

const callDetailsHeaders = ['caller', 'callee', 'date', 'actions', 'mins', 'cost'];

class Results extends Component {
	constructor() {
		super();

		this.state = {
			sort: {
				field: 'date',
				ascending: true,
			},
		};

		this.sortResults = this.sortResults.bind(this);
	}

	sortResults(field) {
		if (this.state.sort.field === field) {
			this.setState({
				sort: {
					ascending: !this.state.sort.ascending,
				},
			});
		} else {
			this.setState({
				sort: {
					field: field,
					ascending: true,
				},
			});
		}
	}

	render() {
		const component = this;
		const sortedCalls = this.props.calls.sort(function(a, b) {
			if (this.state.sort.field === 'date') {
				if (this.state.sort.ascending) {
					return new Date(a).getTime() - new Date(b).getTime();
				} else {
					return new Date(b).getTime() - new Date(a).getTime();
				}
			} else {
				if (this.state.sort.ascending) {
					return a - b;
				} else {
					return b - a;
				}
			}
		});
		return (
			<div>
				<div>
					{callDetailsHeaders.map((item) => (
						<span className="table-headers" onClick={() => component.sortResults(item)}>{item}</span>
					))}
				</div>
				{sortedCalls.map((call) => (
					<CallDetails
						call={call}
						blockNumber={this.props.blockNumber}
						getRecording={this.props.getRecording}
					/>
				))}
				<div>
					<span>Total calls: {this.props.calls.length}</span>
					<span>Total minutes: {this.props.calls.reduce(((total, call) => total + call.minutes), 0)}</span>
					<span>${this.props.calls.reduce(((total, call) => total + call.cost), 0)}</span>
				</div>
			</div>
		);
	}
}

Results.propTypes = {
	calls: PropTypes.array,
	blockNumber: PropTypes.func,
	getRecording: PropTypes.func,
};

export default Results;
