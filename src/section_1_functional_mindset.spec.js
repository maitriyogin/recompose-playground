import React from 'react';
import { compose } from 'ramda';
import { compose as recompose, renderComponent, nest } from 'recompose';
import { expect } from 'chai';
import { shallow,render } from 'enzyme';

describe('------------ Function', () => {
  it('can wrap a function', () => {
    // basic function
    const f1 = p => p * 2;

    // hof that basically applies the f param onto the argument n
    // also this uses currying ... 
    // in short currying is where you split the parameters of a function into nested functions
    // the function will return a function that accepts the next param and wont resolve until you go down to the last param
    // so for instance if you have a function (a, b, c) => a * b * c;
    // this would result in 
    // a => b => c => a * b * c
    // this wont resolve the calculation until a, b and c have been provided so
    // f(2)(2)(2) = 18 
    // 
    const f2 = f => n => f(n);

    expect(f2(f1)(4)).to.equal(8);
  });

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

  it('can filter an array imperatively', () => {

    // this kind of outlines a typical imperative filtering of an array.
    // cons : un re-usable
    // pros: .... errr well maybe it's readable
    let filtered = [];
    for (let i = 0; i < favs.length; i++) {
      if (favs[i].show === 'gumball') {
        filtered.push(favs[i]);
      }
    }
    expect(filtered).to.have.length(2);
    expect(filtered[0].character).to.equal('gumball');
  })

  it('can filter an array imperatively but with a function', () => {

    // we'll wrap the filter code into a function so we can add some kind of re-usability 
    // cons : this is better but it's still imperative
    // pros: .... errr still imperative as hell and why are'nt I using a filter function! 
    const filter = (array, withCharacter) => {
      let filtered = [];
      for (let i = 0; i < array.length; i++) {
        if (array[i].show === withCharacter) {
          filtered.push(array[i]);
        }
      }
      return filtered;
    };
    const result = filter(favs, 'bagpuss');
    expect(result).to.have.length(2);
    expect(result[0].character).to.equal('bagpuss');
  })

  it('can filter sort and get total stars on an array imperatively but with a function', () => {

    // addition of sorting ... 
    // cons : all in the same function, function is now doing 3 things!!
    // pros: .... we can sort and get stars with side effects!

    let sideEffectstars = 0;
    const filterAndSort = (array, withCharacter) => {
      let filtered = [];
      for (let i = 0; i < array.length; i++) {
        if (array[i].show === withCharacter) {
          filtered.push(array[i]);
          sideEffectstars += array[i].stars;
        }
      }
      filtered = filtered.sort((a, b) => {
        if (a.character < b.character) return -1;
        if (a.character > b.character) return 1;
        return 0;
      });
      return {
        filtered,
        stars: sideEffectstars
      };
    };
    const {filtered, stars} = filterAndSort(favs, 'gumball');
    expect(filtered).to.have.length(2);
    expect(filtered[0].character).to.equal('darwin');
    expect(stars).to.equal(7);
  })

  it('can filter sort an array declaratively', () => {

    // addition of sorting ... 
    // cons : great but could be more symantic 
    // pros: now using standard method!
    const show = 'gumball';
    const result = favs.filter(val => val.show === show).sort((a, b) => {
      if (a.character < b.character) return -1;
      if (a.character > b.character) return 1;
      return 0;
    });
    const stars = result.reduce((starCount, item) => starCount + item.stars, 0);
    expect(result).to.have.length(2);
    expect(result[0].character).to.equal('darwin');
    expect(stars).to.equal(7);
  })
});
