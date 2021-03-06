import _ from "underscore";
import React from "react";
import {TableTalker} from "./TableTalker";
import {TableResizer} from "./TableResizer";
import {TableScroller} from "./TableScroller";

export class Table extends React.Component {
    constructor(props) {
        super(props);
        this.__sgId = props.id;
        this.state = {
            header: [],
            rows: []
        };
        this.resizeObjects = null;
        this.isMouseDown = false;
    }

    componentDidMount() {
        this.listen();
        this.registerScrollEvent();
    }

    componentWillUnmount() {
        this.unregisterScrollEvent();
    }

    componentDidUpdate() {
        this.adjustHeaderWidth();
    }

    onMouseMoveHeaderCell(i, e) {
        this.changeCursor(i, e);
    }

    onMouseMoveBodyCell(e) {
    }

    onMouseDown(e) {
        if (this.resizeObjects) {
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

    onMouseUp() {
        this.isMouseDown = false;
    }

    onMouseLeave() {
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
            <table id={this.props.id}
                   className={this.props.theme + "-theme"}
                   onMouseLeave={this.onMouseLeave.bind(this)}>
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

_.extend(Table.prototype, TableTalker);
_.extend(Table.prototype, TableResizer);
_.extend(Table.prototype, TableScroller);

export {
    Table
}
