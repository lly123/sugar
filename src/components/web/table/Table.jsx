import React from 'react';
import ReactMixin from 'react-mixin';
import Talker from '../../common/room/Talker'

export class Table extends React.Component {
    constructor(props) {
        super(props);
        this._s_id = props.id;
        this._s_type = 'table';

        this.state = {
            header: [],
            rows: []
        };

        this.call(this._init).on('InitData').from("tableService").done();
    }

    _init(message) {
        this.setState(message.data);
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