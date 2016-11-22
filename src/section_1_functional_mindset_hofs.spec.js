import React from 'react';
import { compose } from 'ramda';
import { compose as recompose, renderComponent, nest } from 'recompose';
import { expect } from 'chai';
import { shallow, render } from 'enzyme';

describe('------------ Function Higer Order Function', () => {
  const favs = [{
    character: 'gumball',
    show: 'gumball',
    stars: 5
  }, {
    character: 'darwin',
    show: 'gumball',
    stars: 2
  },
    {
      character: 'bagpuss',
      show: 'bagpuss',
      stars: 6
    }, {
      character: 'gabrielle',
      show: 'bagpuss',
      stars: 3
    }];

  // --- composable abstract functions
    // Abstractions hide details and give us the ability to talk about problems at a higher (or more abstract) level.
    // aids in composibility

  const filter = (prop, toFilter) => array => 
    array.filter(val => 
      val[prop].indexOf(toFilter) >= 0);

  const sort = prop => array => array.sort((a, b) => {
    if (a[prop] < b[prop]) return 1;
    if (a[prop] > b[prop]) return -1;
    return 0;
  });

  const add = (a, b) => a + b;
  const multiply = (a, b) => a * b;

  const accumulate = (prop, operation) => array => 
    array.reduce((count, item) => operation(count, item[prop]),
    0);

  const countStars = accumulate('stars', add);
  const mulitplyStars = accumulate('stars', multiply);

  it('can filter sort an array declaratively by higer order function chaining', () => {

    // and now for the declarative approach 
    // cons : bit chatty, maybe not as a performant, filter then reduce
    // pros: hugely flexible, declarative

    const result = sort('stars')(filter('show', 'bagpuss')(favs));
    const stars = countStars(result);

    expect(result).to.have.length(2);
    expect(result[0].character).to.equal('bagpuss');
    expect(stars).to.equal(9);
  })

  it('can filter sort an array declaratively by higher order function composition', () => {

    // finally with compose 
    // cons : bit chatty, maybe not as a performant, filter then reduce
    // pros: hugely flexible, declarative

    let result = compose(filter('show', 'gumball'), sort('stars'))(favs);
    expect(result).to.have.length(2);
    expect(result[0].character).to.equal('gumball');

    result = compose(filter('character', 'puss'), sort('stars'))(favs);
    expect(result[0].character).to.equal('bagpuss');
  })
});
