import React from 'react';
import ReactDOM from 'react-dom';
import 'reflect-metadata';
import 'regenerator-runtime';

import Main from './Main';

function main() {
  ReactDOM.render(<Main />, document.querySelector('#app'));
}

main();
