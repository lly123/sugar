import _ from 'underscore';
import React from 'react';
import ReactMixin from 'react-mixin';
import TableTalker from '../../common/room/table/TableTalker'

export class Table extends React.Component {
    constructor(props) {
        super(props);
        this._s_id = props.id;
        this._s_type = 'table';
        this.state = {
            header: [],
            rows: []
        };
    }

    componentDidMount() {
        this.listen();
    }

    _adjustHeaderWidth() {
        var titles = this.refs.header.querySelectorAll('th');
        var cellsOfFirstRow = this.refs.body.querySelectorAll('tr:first-of-type > td');
        _.each(cellsOfFirstRow, function (v, i) {
            titles[i].width = v.getBoundingClientRect().width;
        });
    }

    componentDidUpdate() {
        this._adjustHeaderWidth();
    }

    render() {
        const tableHeader = this.state.header.map(function (v, i) {
            return (<th key={"th" + i}>{v}</th>)
        });
        const tableBody = this.state.rows.map(function (v, i) {
            return (
                <tr key={"tr" + i} className="row">
                    {v.map(function(o, i) {return (<td key={"td" + i}>{o}</td>)})}
                </tr>
            )
        });
        return (
            <table id={this.props.id} className={this.props.theme + "-theme"}>
                <thead ref="header">
                <tr>
                    {tableHeader}
                </tr>
                </thead>
                <tbody ref="body">
                {tableBody}
                </tbody>
            </table>
        );
    }
}

ReactMixin(Table.prototype, TableTalker);
export {Table as default}