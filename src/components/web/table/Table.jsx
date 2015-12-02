import React from 'react';
import ReactMixin from 'react-mixin';
import Talker from '../../common/room/Talker'

export class Table extends React.Component {
    constructor(props) {
        super(props);
        this.id = props.id;
        this.type = 'table';

        this.state = {
            header: ['Title1', 'Title2', 'Title3'],
            rows: [
                ['Row 1-1', 'Row 1-2', 'Row 1-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3']
            ]
        };
    }

    render() {
        const tableHeader = this.state.header.map(function (v, i) {
            return (<th key={"th" + i}>{v}</th>)
        });
        const tableBody = this.state.rows.map(function (v, i) {
            return (<tr key={"tr" + i}>{v.map(function(o, i) {return (<td key={"td" + i}>{o}</td>)})}</tr>)
        });
        return (
            <table id={this.props.id} className={this.props.theme + "-theme"}>
                <thead>
                <tr>
                    {tableHeader}
                </tr>
                </thead>
                <tbody>
                {tableBody}
                </tbody>
            </table>
        );
    }
}

ReactMixin(Table.prototype, Talker);
export {Table as default}