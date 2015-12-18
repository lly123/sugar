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

    _changeCursor(e) {
        function setResizeObjects(left, leftDiv, right, rightDiv) {
            this.resizeObjects = {
                left: left, leftDiv: leftDiv,
                right: right, rightDiv: rightDiv
            };
        }

        const target = e.target;
        const x = e.clientX - target.getBoundingClientRect().left;

        if (this.isMouseDown) {
            target.style.cursor = 'col-resize';
            const offset = e.clientX - this.resizeObjects.clickX;
            const newWidths = [
                this.resizeObjects.widths[0] + offset,
                this.resizeObjects.widths[1] + offset,
                this.resizeObjects.widths[2] - offset,
                this.resizeObjects.widths[3] - offset
            ];

            this.resizeObjects.left.width = newWidths[0];
            this.resizeObjects.leftDiv.style.width = newWidths[1] + 'px';
            this.resizeObjects.right.width = newWidths[2];
            this.resizeObjects.rightDiv.style.width = newWidths[3] + 'px';
        } else {
            const leftBound = target.clientLeft;
            const rightBound = target.clientLeft + target.clientWidth;

            if (x < leftBound) {
                setResizeObjects.bind(this)(
                    e.target.previousSibling, e.target.previousSibling.querySelector('div'),
                    e.target, e.target.querySelector('div')
                );
            } else if (x > rightBound) {
                setResizeObjects.bind(this)(
                    e.target, e.target.querySelector('div'),
                    e.target.nextSibling, e.target.nextSibling.querySelector('div')
                );
            } else {
                this.resizeObjects = null;
            }
            target.style.cursor = this.resizeObjects ? 'col-resize' : 'auto';
        }
    }

    componentDidUpdate() {
        this._adjustHeaderWidth();
    }

    onMouseMoveHeaderCell(e) {
        this._changeCursor(e);
    }

    onMouseMoveBodyCell(e) {
    }

    onMouseDown(e) {
        if (this.resizeObjects) {
            this.isMouseDown = true;
            _.extend(this.resizeObjects, {
                clickX: e.clientX,
                widths: [
                    parseInt(this.resizeObjects.left.width),
                    parseInt(this.resizeObjects.leftDiv.offsetWidth),
                    parseInt(this.resizeObjects.right.width),
                    parseInt(this.resizeObjects.rightDiv.offsetWidth)
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
                        onMouseMove={this.onMouseMoveHeaderCell.bind(this)}
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