import _ from 'underscore';

var TableResizer = {

    adjustHeaderWidth() {
        var titles = this.refs.header.querySelectorAll('th');
        var cellsOfFirstRow = this.refs.body.querySelectorAll('tr:first-of-type > td');

        /**
         * Reset title cells' widths
         */
        _.each(cellsOfFirstRow, (v, i) => titles[i].width = v.getBoundingClientRect().width);
    },

    changeCursor(i, e) {
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

            if (newWidths[0] > 20 && newWidths[2] > 20) {
                changeColumnWidth(this.resizeObjects.left, newWidths[0], newWidths[1]);
                changeColumnWidth(this.resizeObjects.right, newWidths[2], newWidths[3]);
            }
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
};

export {TableResizer as default};