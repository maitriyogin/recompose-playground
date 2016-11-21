import React from 'react';
import { compose, renderComponent, nest } from 'recompose';
import { expect } from 'chai';
import { shallow, render } from 'enzyme';

describe('----------- Recompose', () => {
  const hoc = WrappedComponent => props => <div><h1>{props.hocMessage}</h1><WrappedComponent {...props} /></div>;
    const CompA = ({messageA, children}) => <div>{messageA}{children}</div>;
    const CompB = ({messageB, children}) => <div>{messageB}{children}</div>;
    const CompC = ({messageC, children}) => <div>{messageC}{children}</div>;
  const wrapped = BaseC => WrappedC => props => <BaseC {...props}><WrappedC {...props} /></BaseC>;

  
  it('can recompose message components', () => {
    const props = {
      messageA: 'wake up',
      messageB: 'be golden and light',
      messageC: 'bagpuss oh here what I sing!'
    };
    const Composed = compose(
      wrapped(CompA),
      wrapped(CompB)
    )(CompC)
    const result = render(<Composed {...props} />);
    expect(result).to.have.length(1);
    console.log(result.html());
  });

  it('can recompose message components with nest', () => {
    const props = {
      messageA: 'wake up',
      messageB: 'be golden and light',
      messageC: 'bagpuss oh here what I sing!'
    };
    const Composed = nest(
      CompA,
      CompB,
      CompC
    )
    const result = render(<Composed {...props} />);
    expect(result).to.have.length(1);
    console.log(result.html());
  });


});
