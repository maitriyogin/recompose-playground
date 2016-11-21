import React from 'react';
import { compose, renderComponent, mapProps, withProps, withPropsOnChange, withState, withHandlers, withReducer } from 'recompose';
import { v4 } from 'node-uuid';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import R from 'ramda'

const CompA = ({messageA, character, children}) => <div>
      <span className='messageA' >{messageA}</span>
      <span className='character' >{character}</span>
      {children}
    </div>;
const CompB = ({messageB, children}) => <div>{messageB}{children}</div>;
const CompC = ({messageC, children, character}) => <div>{character && <h1 id='character'>character</h1>}{messageC}{children}</div>;

const ToggleTimeOfDay = ({toggleTimeOfDay, timeOfDay}) => <span
  className='toggle'
  onClick={toggleTimeOfDay(timeOfDay)}>
        {timeOfDay}
      </span>;


describe.only('----------- Recompose HOCS', () => {

  let props = {
    messageA: 'wake up',
    messageB: 'be golden and light',
    messageC: 'bagpuss oh here what I sing!',
    character: 'gumball'
  };
  it('mapProps', () => {
    const Composed = compose(
      mapProps(
        ownerProps => {
          // again using ramda here instead of the usual imperative if statement.
          // this raises a question of readability but when moving over to a 
          // functional mindset then it's good practice to cast out the old and start
          // a fresh ...
          const props = R.when(
            ownerProps => ownerProps.messageB.indexOf('golden') >= 0,
            ownerProps => ({
              ...ownerProps,
              character: 'bagpuss'
            })
          )(ownerProps);
          return props;
        }
      )
    )(CompA)
    const result = shallow(<Composed {...props} />);
    expect(result).to.have.length(1);
    expect(result.find('.character').text()).to.equal('bagpuss');
    console.log(result.html());
  });


  it('withProps', () => {
    // provided props take precedence over those of the owner
    const Composed = compose(
      withProps(
        ownerProps => ({
          messageA: 'go to bed',
          character: 'bagpuss'
        })
      )
    )(CompA)
    const result = shallow(<Composed {...props} />);
    expect(result).to.have.length(1);
    expect(result.find('.character').text()).to.equal('bagpuss');
    expect(result.find('.messageA').text()).to.equal('go to bed');
    console.log(result.html());
  });


  it('withPropsOnChange', () => {
    // the purpose here is to simulate new props based upon a prop change
    // wake up, go to bed
    props = {
      ...props,
      character: 'bagpuss',
      timeOfDay: 'evening'
    }
    const Composed = compose(
      withPropsOnChange(
        (props, nextProps) => props.timeOfDay !== nextProps.timeOfDay,
        ownerProps => R.ifElse(
          ownerProps => ownerProps.timeOfDay === 'morning',
          ownerProps => ({
            ...ownerProps,
            messageA: 'wake up!'
          }),
          ownerProps => ({
            ...ownerProps,
            messageA: 'go to bed!'
          })
        )(ownerProps)
      )
    )(CompA)

    const result = shallow(<Composed {...props} />);
    expect(result).to.have.length(1);
    expect(result.find('.character').text()).to.equal('bagpuss');
    expect(result.find('.messageA').text()).to.equal('go to bed!');

    result.setProps({
      ...props,
      timeOfDay: 'morning'
    })
    expect(result.find('.messageA').text()).to.equal('wake up!');

    // change to nightime
    result.setProps({
      ...props,
      timeOfDay: 'night'
    })
    expect(result.find('.messageA').text()).to.equal('go to bed!');

    // try and set a propery that we're not checking
    result.setProps({
      ...props,
      messageA: 'I wont change!!'
    })
    expect(result.find('.messageA').text()).to.equal('go to bed!');

    result.setProps({
      ...props,
      timeOfDay: 'morning'
    })
    expect(result.find('.messageA').text()).to.equal('wake up!');
    console.log(result.html());
  });



  it('withState and withHandlers', () => {
    // Handlers are passed to the base component as immutable props, whose identities are preserved across renders. This avoids a common pitfall where functional components create handlers inside the body of the function, which results in a new handler on every render and breaks downstream shouldComponentUpdate() optimizations that rely on prop equality.

    const Composed = compose(
      withState('timeOfDay', 'setTimeOfDay', 'night'),
      withHandlers({
        toggleTimeOfDay: ({setTimeOfDay}) => timeOfDay => () => setTimeOfDay(timeOfDay === 'morning' ? 'night' : 'morning')
      })
    )(ToggleTimeOfDay);

    // have to go over to mount here as handlers infers another component
    const result = mount(<Composed {...props} />);
    expect(result).to.have.length(1);
    console.log('toggle time of day', result.html());
    expect(result.find('.toggle').text()).to.equal('night');

    // simulate click on timeOfDay
    result.find('.toggle').simulate('click');
    expect(result.find('.toggle').text()).to.equal('morning');
  });

});
