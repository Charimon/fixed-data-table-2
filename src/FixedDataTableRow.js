/**
 * Copyright Schrodinger, LLC
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableRow
 * @typechecks
 */

'use strict';

import React from 'React';
import PropTypes from 'prop-types';
import FixedDataTableCellGroup from 'FixedDataTableCellGroup';

import cx from 'cx';
import joinClasses from 'joinClasses';
import FixedDataTableTranslateDOMPosition from 'FixedDataTableTranslateDOMPosition';

/**
 * Component that renders the row for <FixedDataTable />.
 * This component should not be used directly by developer. Instead,
 * only <FixedDataTable /> should use the component internally.
 */
class FixedDataTableRowImpl extends React.Component {
  static propTypes = {

    isScrolling: PropTypes.bool,

    /**
     * Array of <FixedDataTableColumn /> for the fixed columns.
     */
    fixedColumns: PropTypes.array.isRequired,

    /**
     * Height of the row.
     */
    height: PropTypes.number.isRequired,

    /**
     * Height of the content to be displayed below the row.
     */
    subRowHeight: PropTypes.number,

    /**
     * the row expanded.
     */
    rowExpanded: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func,
    ]),

    /**
     * The row index.
     */
    index: PropTypes.number.isRequired,

    /**
     * Array of <FixedDataTableColumn /> for the scrollable columns.
     */
    scrollableColumns: PropTypes.array.isRequired,

    /**
     * The distance between the left edge of the table and the leftmost portion
     * of the row currently visible in the table.
     */
    scrollLeft: PropTypes.number.isRequired,

    /**
     * Width of the row.
     */
    width: PropTypes.number.isRequired,

    /**
     * Fire when a row is clicked.
     */
    onClick: PropTypes.func,

    /**
     * Fire when a row is double clicked.
     */
    onDoubleClick: PropTypes.func,

    /**
     * Callback for when resizer knob (in FixedDataTableCell) is clicked
     * to initialize resizing. Please note this is only on the cells
     * in the header.
     * @param number combinedWidth
     * @param number leftOffset
     * @param number cellWidth
     * @param number|string columnKey
     * @param object event
     */
    onColumnResize: PropTypes.func,

    isColumnReordering: PropTypes.bool,
    /**
     * Callback for when reorder handle (in FixedDataTableCell) is clicked
     * to initialize reordering. Please note this is only on the cells
     * in the header.
     * @param number|string columnKey
     * @param number cellWidth
     * @param number leftOffset
     * @param object event
     */
    onColumnReorder: PropTypes.func,

    /**
     * Callback for when a cell is moved while reordering.
     * @param number distance
     */
    onColumnReorderMove: PropTypes.func,

    /**
     * Callback for when the mouse is released to complete reordering.
     * @param number distance
     */
    onColumnReorderEnd: PropTypes.func,
  };

  render() /*object*/ {
    var subRowHeight = this.props.subRowHeight || 0;
    var style = {
      width: this.props.width,
      height: this.props.height + subRowHeight,
    };

    var className = cx({
      'fixedDataTableRowLayout/main': true,
      'public/fixedDataTableRow/main': true,
      'public/fixedDataTableRow/active': (this.props.selectedRows || {})[this.props.index],
      'public/fixedDataTableRow/highlighted': (this.props.index % 2 === 1),
      'public/fixedDataTableRow/odd': (this.props.index % 2 === 1),
      'public/fixedDataTableRow/even': (this.props.index % 2 === 0),
    });

    const isActiveRow = this.props.activeRowIndex == this.props.index
    var fixedColumnsWidth = this._getColumnsWidth(this.props.fixedColumns);
    var fixedColumns =
      <FixedDataTableCellGroup
        key="fixed_cells"
        isScrolling={this.props.isScrolling}
        height={this.props.height}
        left={0}
        width={fixedColumnsWidth}
        zIndex={isActiveRow?3:2}
        columns={this.props.fixedColumns}
        onColumnResize={this.props.onColumnResize}
        onColumnReorder={this.props.onColumnReorder}
        onColumnReorderMove={this.props.onColumnReorderMove}
        onColumnReorderEnd={this.props.onColumnReorderEnd}
        isColumnReordering={this.props.isColumnReordering}
        columnReorderingData={this.props.columnReorderingData}
        rowHeight={this.props.height}
        rowIndex={this.props.index}
        onCellClick={this.props.onCellClick}
        onCellDoubleClick={this.props.onCellDoubleClick}
        activeRowIndex={this.props.activeRowIndex}
        activeColumnKey={this.props.activeColumnKey}
        editingRowIndex={this.props.editingRowIndex}
        editingColumnKey={this.props.editingColumnKey}
        selectedRows={this.props.selectedRows}
      />;
    var columnsLeftShadow = this._renderColumnsLeftShadow(fixedColumnsWidth);
    var scrollableColumns =
      <FixedDataTableCellGroup
        key="scrollable_cells"
        style={this.props.fixedColumns.length>0?{marginLeft: 1}:null}
        isScrolling={this.props.isScrolling}
        height={this.props.height}
        left={this.props.scrollLeft}
        offsetLeft={fixedColumnsWidth}
        width={this.props.width - fixedColumnsWidth}
        zIndex={isActiveRow?1:0}
        columns={this.props.scrollableColumns}
        onColumnResize={this.props.onColumnResize}
        onColumnReorder={this.props.onColumnReorder}
        onColumnReorderMove={this.props.onColumnReorderMove}
        onColumnReorderEnd={this.props.onColumnReorderEnd}
        isColumnReordering={this.props.isColumnReordering}
        columnReorderingData={this.props.columnReorderingData}
        rowHeight={this.props.height}
        rowIndex={this.props.index}
        onCellClick={this.props.onCellClick}
        onCellDoubleClick={this.props.onCellDoubleClick}
        activeRowIndex={this.props.activeRowIndex}
        activeColumnKey={this.props.activeColumnKey}
        editingRowIndex={this.props.editingRowIndex}
        editingColumnKey={this.props.editingColumnKey}
        selectedRows={this.props.selectedRows}
      />;
    var scrollableColumnsWidth = this._getColumnsWidth(this.props.scrollableColumns);
    var columnsRightShadow = this._renderColumnsRightShadow(fixedColumnsWidth + scrollableColumnsWidth);
    var rowExpanded = this._getRowExpanded(subRowHeight);
    var rowExpandedStyle = {
      height: subRowHeight,
      top: this.props.height,
      width: this.props.width,
    };

    return (
      <div
        className={joinClasses(className, this.props.className)}
        onClick={this.props.onClick ? this._onClick : null}
        onDoubleClick={this.props.onDoubleClick ? this._onDoubleClick : null}
        onMouseDown={this.props.onMouseDown ? this._onMouseDown : null}
        onMouseUp={this.props.onMouseUp ? this._onMouseUp : null}
        onMouseEnter={this.props.onMouseEnter ? this._onMouseEnter : null}
        onMouseLeave={this.props.onMouseLeave ? this._onMouseLeave : null}
        style={style}>
        <div className={cx('fixedDataTableRowLayout/body')}>
          {fixedColumns}
          {scrollableColumns}
          {columnsLeftShadow}
        </div>
        {rowExpanded && <div
          className={cx('fixedDataTableRowLayout/rowExpanded')}
          style={rowExpandedStyle}>
          {rowExpanded}
        </div>}
        {columnsRightShadow}
      </div>
    );
  };

  _getColumnsWidth = (/*array*/ columns) => /*number*/ {
    var width = 0;
    for (var i = 0; i < columns.length; ++i) {
      width += columns[i].props.width;
    }
    return width;
  };

  _getRowExpanded = (/*number*/ subRowHeight) => /*?object*/ {
    if (this.props.rowExpanded) {
      var rowExpandedProps = {
        rowIndex: this.props.index,
        height: subRowHeight,
        width: this.props.width,
      };

      var rowExpanded;
      if (React.isValidElement(this.props.rowExpanded)) {
        rowExpanded = React.cloneElement(this.props.rowExpanded, rowExpandedProps);
      } else if (typeof this.props.rowExpanded === 'function') {
        rowExpanded = this.props.rowExpanded(rowExpandedProps);
      }

      return rowExpanded;
    }
  }

  _renderColumnsLeftShadow = (/*number*/ left) => /*?object*/ {
    var className = cx({
      'fixedDataTableRowLayout/fixedColumnsDivider': left > 0,
      'fixedDataTableRowLayout/columnsShadow': this.props.scrollLeft > 0,
      'public/fixedDataTableRow/fixedColumnsDivider': left > 0,
      'public/fixedDataTableRow/columnsShadow': this.props.scrollLeft > 0,
     });
     var style = {
       left: left,
       height: this.props.height,
       zIndex: 2,
     };
     return <div className={className} style={style} />;
   };

  _renderColumnsRightShadow = (/*number*/ totalWidth) => /*?object*/ {
    if (Math.ceil(this.props.scrollLeft + this.props.width) < Math.floor(totalWidth)) {
      var className = cx(
        'fixedDataTableRowLayout/columnsShadow',
        'fixedDataTableRowLayout/columnsRightShadow',
        'public/fixedDataTableRow/columnsShadow',
        'public/fixedDataTableRow/columnsRightShadow'
      );
      var style = {
        height: this.props.height
      };
      return <div className={className} style={style} />;
    }
  };

  _onClick = (/*object*/ event) => {
    this.props.onClick(event, this.props.index);
  };

  _onDoubleClick = (/*object*/ event) => {
    this.props.onDoubleClick(event, this.props.index);
  };

  _onMouseUp = (/*object*/ event) => {
    this.props.onMouseUp(event, this.props.index);
  };

  _onMouseDown = (/*object*/ event) => {
    this.props.onMouseDown(event, this.props.index);
  };

  _onMouseEnter = (/*object*/ event) => {
    this.props.onMouseEnter(event, this.props.index);
  };

  _onMouseLeave = (/*object*/ event) => {
    this.props.onMouseLeave(event, this.props.index);
  };
}

class FixedDataTableRow extends React.Component {
  static propTypes = {

    isScrolling: PropTypes.bool,

    /**
     * Height of the row.
     */
    height: PropTypes.number.isRequired,

    /**
     * Z-index on which the row will be displayed. Used e.g. for keeping
     * header and footer in front of other rows.
     */
    zIndex: PropTypes.number,

    /**
     * The vertical position where the row should render itself
     */
    offsetTop: PropTypes.number.isRequired,

    /**
     * Width of the row.
     */
    width: PropTypes.number.isRequired,
  };

  componentWillMount() {
    this._initialRender = true;
  }

  componentDidMount() {
    this._initialRender = false;
  }

  render() /*object*/ {
    const isActiveRow = this.props.activeRowIndex == this.props.index
    const zIndex = isActiveRow?1:0
    
    var style = {
      width: this.props.width,
      height: this.props.height,
      zIndex: (this.props.zIndex ? this.props.zIndex : zIndex),
    };
    FixedDataTableTranslateDOMPosition(style, 0, this.props.offsetTop, this._initialRender);

    return (
      <div
        style={style}
        className={cx('fixedDataTableRowLayout/rowWrapper')}>
        <FixedDataTableRowImpl
          {...this.props}
          offsetTop={undefined}
          zIndex={undefined}
          onCellClick={this.props.onCellClick}
          onCellDoubleClick={this.props.onCellDoubleClick}
          activeRowIndex={this.props.activeRowIndex}
          activeColumnKey={this.props.activeColumnKey}
          editingRowIndex={this.props.editingRowIndex}
          editingColumnKey={this.props.editingColumnKey}
          selectedRows={this.props.selectedRows}
        />
      </div>
    );
  }
}


module.exports = FixedDataTableRow;
