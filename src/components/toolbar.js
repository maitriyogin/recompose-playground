import React, {PropTypes} from 'react';
export default ({id, handleEdit}) => (<button onClick={id => handleEdit(id)}>Edit</button>)