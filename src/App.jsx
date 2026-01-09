import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const preparedProducts = productsFromServer.map(product => {
  const category = categoriesFromServer.find(c => c.id === product.categoryId);
  const user = usersFromServer.find(u => u.id === category?.ownerId);

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [query, setQuery] = useState('');

  const visibleProducts = preparedProducts.filter(product => {
    const matchesUser =
      selectedUserId === 0 || product.user?.id === selectedUserId;
    const matchesQuery = product.name
      .toLowerCase()
      .includes(query.toLowerCase().trim());

    return matchesUser && matchesQuery;
  });

  const resetFilters = () => {
    setSelectedUserId(0);
    setQuery('');
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <button
                type="button"
                data-cy="FilterAllUsers"
                className={`button is-ghost py-0 ${selectedUserId === 0 ? 'is-active' : ''}`}
                onClick={() => setSelectedUserId(0)}
              >
                All
              </button>

              {usersFromServer.map(user => (
                <button
                  key={user.id}
                  type="button"
                  data-cy="FilterUser"
                  className={`button is-ghost py-0 ${selectedUserId === user.id ? 'is-active' : ''}`}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  {user.name}
                </button>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block">
              <button
                type="button"
                data-cy="ResetAllButton"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetFilters}
              >
                Reset all filters
              </button>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0 ? (
            <p
              data-cy="NoMatchingMessage"
              className="has-text-centered is-size-4"
            >
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>User</th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(product => (
                  <tr key={product.id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>

                    <td data-cy="ProductCategory">
                      {product.category?.icon} - {product.category?.title}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={
                        product.user?.sex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {product.user?.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
