import { h, render } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import { v4 as uuidv4 } from 'uuid';

// Custom hook for localStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (typeof Storage === 'undefined') {
      window.alert('Your browser is unsupported!');
      return initialValue;
    }
    const stored = localStorage.getItem(key);
    return stored !== null ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Main App Component
function App() {
  const categories = ['Clothing', 'Food', 'Fuel', 'Grooming', 'Health', 'Hobby'];

  const [items, setItems] = useLocalStorage('predger.items', []);
  const [newItemValue, setNewItemValue] = useState('');
  const [newItemCategory, setNewItemCategory] = useState(categories[0]);

  const formatCurrency = useCallback(num => {
    if (num < 0) {
      return '-$' + (num * -1).toFixed(2);
    } else {
      return '$' + num.toFixed(2);
    }
  }, []);

  const getTotal = useCallback(() => {
    return items.reduce((pv, cv) => pv + cv.value, 0);
  }, [items]);

  const handleAddItem = useCallback(
    e => {
      e.preventDefault();
      const value = parseFloat(newItemValue);
      if (isNaN(value)) return;

      const newItem = {
        id: uuidv4(),
        value: value,
        createdAt: new Date().getTime(),
        category: newItemCategory
      };

      setItems([newItem, ...items]);
      setNewItemValue('');
      setNewItemCategory(categories[0]);
    },
    [newItemValue, newItemCategory, items, categories]
  );

  const handleInputChange = useCallback(e => {
    setNewItemValue(e.target.value);
  }, []);

  const handleRemoveItem = useCallback(
    e => {
      const idToRemove = e.target.value;
      setItems(items.filter(item => item.id !== idToRemove));
    },
    [items]
  );

  const handleReset = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all items? This cannot be undone.')) {
      setItems([]);
      setNewItemValue('');
    }
  }, []);

  const handleCategoryChange = useCallback(e => {
    setNewItemCategory(e.target.value);
  }, []);

  // Render a single item
  const renderItem = item => {
    return h(
      'div',
      { key: item.id, className: 'row' },
      h('div', { className: 'span3' }, h('label', null, formatCurrency(item.value))),
      h('div', { className: 'span4' }, h('label', null, item.category)),
      h(
        'div',
        { className: 'span1' },
        h(
          'button',
          {
            onClick: handleRemoveItem,
            value: item.id,
            className: 'btn-danger'
          },
          '−'
        )
      )
    );
  };

  // Render category select
  const renderCategorySelect = () => {
    const options = categories.map(cat => h('option', { value: cat, key: cat }, cat));

    return h(
      'select',
      {
        value: newItemCategory,
        onChange: handleCategoryChange
      },
      options
    );
  };

  // Main render
  return h(
    'div',
    null,
    h('div', { className: 'title' }, formatCurrency(getTotal())),
    h(
      'form',
      { onSubmit: handleAddItem, className: 'row' },
      h(
        'div',
        { className: 'span3' },
        h('input', {
          type: 'number',
          step: '0.01',
          value: newItemValue,
          onChange: handleInputChange,
          placeholder: formatCurrency(0)
        })
      ),
      h('div', { className: 'span4' }, renderCategorySelect()),
      h('div', { className: 'span1' }, h('button', { className: 'btn-success' }, '+'))
    ),
    h('div', null, items.map(renderItem)),
    h('div', null, h('button', { onClick: handleReset }, 'Reset'))
  );
}

// Render app to DOM
render(h(App), document.body);

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registered:', registration);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed:', error);
      });
  });
}
