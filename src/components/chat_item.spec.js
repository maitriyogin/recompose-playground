import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import {ChatItem} from './chat_item';

const props = {state: {isEditing: false, message: 'hiya'}, chat: {id: 1, message: 'gumball and darwin'}}
const wrapper = shallow(<ChatItem {...props}/>);

describe('(Component) ChatItem', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.length(1);
  });
});

