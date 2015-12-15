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
        this.splitters = [];
    }

    componentDidMount() {
        this.listen();
    }

    _adjustHeaderWidth() {
        var titles = this.refs.header.querySelectorAll('th');
        var cellsOfFirstRow = this.refs.body.querySelectorAll('tr:first-of-type > td');

        /**
         * Reset title cells' widths
         */
        _.each(cellsOfFirstRow, (v, i) => titles[i].width = v.getBoundingClientRect().width);

        /**
         * Calculate splitters' left and right positions
         */
        for (var i = 1; i < titles.length; i++) {
            this.splitters[i - 1] = {
                left: titles[i - 1].offsetLeft + titles[i - 1].clientLeft + titles[i - 1].clientWidth,
                right: titles[i].offsetLeft + titles[i].clientLeft
            }
        }
    }


    componentDidUpdate() {
        this._adjustHeaderWidth();
    }

    onMouseMoveHeaderCell(e) {
        const bounds = e.target.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const leftBound = e.target.clientLeft;
        const rightBound = e.target.clientLeft + e.target.clientWidth;
        e.target.style.cursor = x < leftBound || x > rightBound ? 'col-resize' : 'auto';
    }

    onMouseMoveBodyCell(e) {
    }

    render() {
        const tableHeader = this.state.header.map((v, i) => {
            return (<th key={"th" + i} onMouseMove={this.onMouseMoveHeaderCell}>{v}</th>)
        });

        const tableBody = this.state.rows.map((v, i) => {
            return (
                <tr key={"tr" + i} className="row">
                    {v.map((o, i) => {
                        return (<td key={"td" + i} onMouseMove={this.onMouseMoveBodyCell}>{o}</td>)
                        })}
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