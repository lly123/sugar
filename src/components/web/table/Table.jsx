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
        this.resizeObjects = null;
        this.isMouseDown = false;
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
    }

    _changeCursor(i, e) {
        function getColumn(i) {
            return {
                header: this.refs.header.querySelector(`tr > th:nth-child(${i})`),
                headerDiv: this.refs.header.querySelector(`tr > th:nth-child(${i}) > div`),
                cells: this.refs.body.querySelectorAll(`tr > td:nth-child(${i})`),
                cellDivs: this.refs.body.querySelectorAll(`tr > td:nth-child(${i}) > div`)
            };
        }

        function changeColumnWidth(o, w1, w2) {
            o.header.width = w1;
            o.headerDiv.style.width = w2 + 'px';
            _.each(o.cells, v => v.width = w1);
            _.each(o.cellDivs, v => v.style.width = w2 + 'px');
        }

        const target = e.target;
        const x = e.clientX - target.getBoundingClientRect().left;

        if (this.isMouseDown) {
            const offset = e.clientX - this.resizeObjects.clickX;
            const newWidths = [
                this.resizeObjects.widths[0] + offset,
                this.resizeObjects.widths[1] + offset,
                this.resizeObjects.widths[2] - offset,
                this.resizeObjects.widths[3] - offset
            ];

            changeColumnWidth(this.resizeObjects.left, newWidths[0], newWidths[1]);
            changeColumnWidth(this.resizeObjects.right, newWidths[2], newWidths[3]);
            target.style.cursor = 'col-resize';
        } else {
            const leftBound = target.clientLeft;
            const rightBound = target.clientLeft + target.clientWidth;

            if (x < leftBound) {
                this.resizeObjects = {
                    left: getColumn.call(this, i - 1),
                    right: getColumn.call(this, i)
                }
            } else if (x > rightBound) {
                this.resizeObjects = {
                    left: getColumn.call(this, i),
                    right: getColumn.call(this, i + 1)
                }
            } else {
                this.resizeObjects = null;
            }
            target.style.cursor = this.resizeObjects ? 'col-resize' : 'default';
        }
    }

    componentDidUpdate() {
        this._adjustHeaderWidth();
    }

    onMouseMoveHeaderCell(i, e) {
        this._changeCursor(i, e);
    }

    onMouseMoveBodyCell(e) {
    }

    onMouseDown(e) {
        if (this.resizeObjects) {
            console.log('>>> ', this.resizeObjects);

            this.isMouseDown = true;
            _.extend(this.resizeObjects, {
                clickX: e.clientX,
                widths: [
                    parseInt(this.resizeObjects.left.header.width),
                    parseInt(this.resizeObjects.left.headerDiv.offsetWidth),
                    parseInt(this.resizeObjects.right.header.width),
                    parseInt(this.resizeObjects.right.headerDiv.offsetWidth)
                ]
            });
        }
    }

    onMouseUp(e) {
        this.isMouseDown = false;
    }

    render() {
        const tableHeader = this.state.header.map((v, i) => {
            return (<th key={"th" + i}
                        onMouseMove={this.onMouseMoveHeaderCell.bind(this, i + 1)}
                        onMouseUp={this.onMouseUp.bind(this)}
                        onMouseDown={this.onMouseDown.bind(this)}>
                <div key={"th-div" + i}>{v}</div>
            </th>)
        });

        const tableBody = this.state.rows.map((v, i) => {
            return (
                <tr key={"tr" + i} className="row">
                    {v.map((o, i) => {
                        return (<td key={"td" + i}
                                    onMouseMove={this.onMouseMoveBodyCell.bind(this)}
                                    onMouseUp={this.onMouseUp.bind(this)}
                                    onMouseDown={this.onMouseDown.bind(this)}>
                            <div key={"td-div" + i}>{o}</div>
                        </td>)
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