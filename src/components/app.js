import { h, Component } from 'preact';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.storageKey = 'predger.items';
    if (typeof(Storage) === 'undefined') {
      window.alert('Your browser is unsupported!');
    }
    var items = [];
    var storedItems = localStorage.getItem(this.storageKey);
    if (storedItems !== null) {
      items = JSON.parse(storedItems);
    }

    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleRemoveItem = this.handleRemoveItem.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.state = {items: items, newItemValue: ''};
  }

  handleAddItem(e) {
    e.preventDefault();
    var newItemValue = parseFloat(this.state.newItemValue);
    if (isNaN(newItemValue)) return;
    var newItem = {id: (new Date).getTime(), value: parseFloat(this.state.newItemValue)};
    this.state.items.push(newItem);
    this.setState({items: this.state.items, newItemValue: ''}, this.updateLocalStorage);
  }

  handleInputChange(e) {
    this.setState({newItemValue: e.target.value});
  }

  handleRemoveItem(e) {
    var i = this.state.items.findIndex(function(item) {
      return parseFloat(e.target.value) == item.id;
    });
    this.state.items.splice(i, 1);
    this.setState({items: this.state.items}, this.updateLocalStorage);
  };

  handleReset(e) {
    this.setState({items: [], newItemValue: ''}, this.updateLocalStorage);
  }

  formatCurrency(num) {
    return '$' + num.toFixed(2);
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
      <div className="col1">
        <label>{this.formatCurrency(item.value)}</label>
      </div>
      <div className="col2">
        <button onClick={this.handleRemoveItem} value={item.id} className="btn-danger">−</button>
      </div>
    </div>;
  }

  render() {
    return (
      <div>
        <div className="title">{this.formatCurrency(this.Total())}</div>
        <form onSubmit={this.handleAddItem}>
          <div className="col1">
            <input type="number" step="0.01" value={this.state.newItemValue} onChange={this.handleInputChange} placeholder={this.formatCurrency(0)}  />
          </div>
          <div className="col2">
            <button className="btn-success">+</button>
          </div>
        </form>
        {this.Items()}
        <div>
          <button onClick={this.handleReset}>Reset</button>
        </div>
      </div>
    );
  }
}
