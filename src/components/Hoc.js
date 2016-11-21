import React from 'react';

const hoc = baseComponent =>
  props =>
    (<div>
      <baseComponent {...props} />
    </div>);