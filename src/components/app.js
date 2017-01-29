import { h, Component } from 'preact';
import uuid from 'uuid';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.storageKey = 'predger.items';
    if (typeof(Storage) === 'undefined') {
      window.alert('Your browser is unsupported!');
    }
    var categories = ['Clothing', 'Flying', 'Food', 'Fuel', 'Grooming', 'Health'];
    var items = [];
    var storedItems = localStorage.getItem(this.storageKey);
    if (storedItems !== null) {
      items = JSON.parse(storedItems);
    }

    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleRemoveItem = this.handleRemoveItem.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.state = {
      items: items,
      newItemValue: '',
      newItemCategory: categories[0],
      categories: categories
    };
  }

  handleAddItem(e) {
    e.preventDefault();
    var newItemValue = parseFloat(this.state.newItemValue);
    if (isNaN(newItemValue)) return;
    var newItem = {
      id: uuid.v1(),
      value: parseFloat(this.state.newItemValue),
      createdAt: (new Date()).getTime(),
      category: this.state.newItemCategory
    };
    this.state.items.unshift(newItem);
    this.setState({items: this.state.items, newItemValue: '', newItemCategory: this.state.categories[0]}, this.updateLocalStorage);
  }

  handleInputChange(e) {
    this.setState({newItemValue: e.target.value});
  }

  handleRemoveItem(e) {
    var i = this.state.items.findIndex(function(item) {
      return e.target.value === item.id;
    });
    if (i == -1) { return; }
    this.state.items.splice(i, 1);
    this.setState({items: this.state.items}, this.updateLocalStorage);
  };

  handleReset(e) {
    this.setState({items: [], newItemValue: ''}, this.updateLocalStorage);
  }

  formatCurrency(num) {
    if (num < 0) {
      return '-$' + (num * -1).toFixed(2);
    } else {
      return '$' + num.toFixed(2);
    }
  }

  updateLocalStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.state.items));
  }

  Total() {
    return this.state.items.reduce(function(pv, cv) {
      return pv + cv.value;
    }, 0);
  }

  Items() {
    return this.state.items.map((item) => this.Item(item));
  }

  Item(item) {
    return <div key={item.id}>
      <div className="span3">
        <label>{this.formatCurrency(item.value)}</label>
      </div>
      <div className="span4">
        <label>{item.category}</label>
      </div>
      <div className="span1">
        <button onClick={this.handleRemoveItem} value={item.id} className="btn-danger">−</button>
      </div>
    </div>;
  }

  CategorySelect() {
    var options = [];
    for (var i = 0; i < this.state.categories.length; i++) {
      options.push(<option value={this.state.categories[i]}>{this.state.categories[i]}</option>);
    }

    return <select value={this.state.newItemCategory} onChange={(e) => { this.setState({newItemCategory: e.target.value}) }}>
      {options}
    </select>;
  }

  render() {
    return (
      <div>
        <div className="title">{this.formatCurrency(this.Total())}</div>
        <form onSubmit={this.handleAddItem}>
          <div className="span3">
            <input type="number" step="0.01" value={this.state.newItemValue} onChange={this.handleInputChange} placeholder={this.formatCurrency(0)}  />
          </div>
          <div className="span4">
            { this.CategorySelect() }
          </div>
          <div className="span1">
            <button className="btn-success">+</button>
          </div>
        </form>
        <div>
          {this.Items()}
        </div>
        <div>
          <button onClick={this.handleReset}>Reset</button>
        </div>
      </div>
    );
  }
}
