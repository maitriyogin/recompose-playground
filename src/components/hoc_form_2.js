import React from 'react';
import {compose} from 'recompose';
import createFragment from 'react-addons-create-fragment'
import isFunction from 'lodash/isFunction';

// const Hoc = C => Wc => props => (<C {...props}><Wc {...props}/></C>)
// the big question here is whether we should compose or just loop through the forms
// in any case we need to spread the initial model and the forms 

const empty = {initialModel: {}, fields: []};

// this is way of build up hocs on simple components, aids in extrapolating fields and the 
// individual models
const Hoc = Fc => FWc => props => {
  const pfwc = FWc ? FWc(props) : empty;
  const pfc = Fc ? Fc(props) : empty;
  const initialModel = { ...pfc.initialModel, ...pfwc.initialModel};
  const fields = [ ...pfc.fields, ...pfwc.fields];
  return {
    fields,
    initialModel
  }
}

const D1 = props => (<div>{props.dialog} {props.children} </div>);
const C1 = props => (<div>{props.form1} {props.children} </div>);
const C2 = props => (<div>{props.form2}</div>);

// Basic Form Element, outlines a composable form element
// the initialModel represents the data of the form and should be keyed to match the names of the form elements
// fields can contain objects, which will be mapped to form elements or even whole components
const D1F = props => ({
  initialModel: {},
  fields: props => [],
});


const C1F = props => ({
  id: 'c1f',
  initialModel: {c1: 'gumball'}, // props.c1InitialModel
  fields: [C1, {id: 'c1', type: 'text'}]
});

const Help = props => <h1>help {props.form2}</h1>;
const C2F = props => ({
  id: 'c2f',
  initialModel: {c2: 'darwin', c21: 'lazy larry'},
  fields: [{id: 'c2', type: 'text'}, C2, {id: 'c21', type: 'text'}]
});

const Dialog = FWc => props => {
  console.log('------ dialog FWc', FWc);
  const fwc = FWc(props);
  return (
  <div>
    <h1>{props.dialog}</h1>
    <form>
      {fwc.fields.map(f=>
        isFunction(f) ? 
         React.createElement(f, props)
          :
        <input type={f.type} name={f.name} value={fwc.initialModel[f.id]} />
     )}
    </form>
  </div>
)};

// export default Dialog(
  // Hoc(C1F)(
    // Hoc(C2F)()
  // )
// )

export default compose(
  Dialog,
  Hoc(C1F), // c1 goes into Dialog
  Hoc(C2F)  // c2 goes into c1
)();


// export default compose(
  // Dialog,
  // Form1,
  // Form2
  // )()
