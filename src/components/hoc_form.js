import React from 'react';
import {compose} from 'recompose';
import createFragment from 'react-addons-create-fragment'

const Hoc = C => Wc => props => (<C {...props}><Wc {...props}/></C>)

const D1 = props => (<div>{props.dialog} {props.children} </div>);
const C1 = props => (<div>{props.form1} {props.children} </div>);
const C2 = props => (<div>{props.form2}</div>);


const Dialog = Wc => props => (
  <div>
    <h1>{props.dialog}</h1>
    {Wc && <Wc {...props} />}
  </div>
)

export default compose(
  Hoc(D1),
  Hoc(C1),
  Hoc(C2)
)();


// export default compose(
  // Dialog,
  // Form1,
  // Form2
  // )()
