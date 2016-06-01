import React from 'react';
import _ from 'lodash';
import Item from './Item';

const propTypes = {
  data: React.PropTypes.object,
};

class ItemList extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.toggleSelected = this.toggleSelected.bind(this);

    this.state = {
      selectedId: '',
    };
  }

  getItemId(d) {
    let id = d.resolved_id;
    if (id === '0') {
      id = d.item_id;
    }
    return id;
  }

  toggleSelected(itemId) {
    this.setState({ selectedId: itemId });
  }

  render() {
    const list = _.toArray(this.props.data.list);
    let nodes = [];

    _.each(list, (d) => {
      nodes.push(
        <Item
          key={this.getItemId(d)}
          uniqId={this.getItemId(d)}
          data={d}
          selectedId={this.state.selectedId}
          toggleSelected={this.toggleSelected}
        />
      );
    });

    return (
      <div className="itemList">
        {nodes}
      </div>
    );
  }
}

ItemList.propTypes = propTypes;

export default ItemList;
