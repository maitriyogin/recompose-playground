import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { expect } from 'chai';
import HocForm from './hoc_form_2';


xdescribe('(Component) HocForm 2 with fields', () => {
  it('renders without exploding', () => {
    const props = {
      dialog: 'dawrwin',
      form1: 'is a',
      form2: 'fish'
    }
    const wrapper = render(<HocForm {...props}/>);
    expect(wrapper).to.have.length(1);
    console.log(wrapper.html());
  });
});
