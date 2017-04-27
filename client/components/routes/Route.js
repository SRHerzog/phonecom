import React from 'react';

import Button from 'react-md/lib/Buttons';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardText from 'react-md/lib/Cards/CardText';
import { ExpansionPanel } from 'react-md/lib/ExpansionPanels';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';

const Route = props => (
    <Card defaultExpanded={false}>
        <CardTitle title={props.route.name} key={props.route.id} expander style={{ padding: '0 16px' }} />
        <CardText expandable>
            <p>
                <Button icon onClick={props.edit}>mode_edit</Button>
                <Button icon onClick={props.requestDelete}>delete</Button>
            </p>
            {props.route.extension &&
                <h4>Extension: {props.route.extension.name}</h4>
            }
            <DataTable plain>
                <TableBody>
                    {props.route.rules[0].actions.map((action, actionIndex) => {
                        const actionHeader = <TableColumn scope="row">Action: {action.action}</TableColumn>;
                        let actionBody = <TableColumn />;
                        switch (action.action) {
                            case 'fax':
                                actionBody = <TableColumn>Extension: {action.extension}</TableColumn>;
                                break;
                            case 'forward':
                                actionBody = (
                                    <TableColumn>
                                        {action.items.map((item, index) => (
                                            <div key="index" style={{ borderBottom: '1px solid #ccc', marginBottom: '5px' }}>
                                                <p>Type: {item.type}</p>
                                                <p>Number/extension: {item.extension || item.number}</p>
                                                <p>Screening: {!!item.screening}</p>
                                                <p>Distinctive ringtone: {item.distinctive_ring}</p>
                                            </div>
                                        ))}
                                        <p>Timeout: {action.timeout}</p>
                                        <p>Hold music: {action.hold_music ? action.hold_music.name : 'none'}</p>
                                    </TableColumn>
                                );
                                break;
                            case 'greeting':
                                actionBody = <TableColumn>Greeting: {action.greeting.name}</TableColumn>;
                                break;
                            case 'hold':
                                actionBody = (
                                    <TableColumn>
                                        <p>Duration: {action.duration} seconds</p>
                                        <p>Hold music: {action.hold_music.name}</p>
                                    </TableColumn>
                                );
                                break;
                            case 'menu':
                                actionBody = <TableColumn>Menu: {action.menu.name}</TableColumn>;
                                break;
                            case 'queue':
                                actionBody = <TableColumn>Queue: {action.queue.name}</TableColumn>;
                                break;
                            case 'voicemail':
                                actionBody = <TableColumn>Extension: {action.extension.name}</TableColumn>;
                                break;
                            case 'directory':
                            case 'disconnect':
                            default:
                                break;
                        }
                        return (
                            <TableRow key={actionIndex}>
                                {actionHeader}
                                {actionBody}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </DataTable>
        </CardText>
    </Card>
);

export default Route;
