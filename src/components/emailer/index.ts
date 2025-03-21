import { lazy } from 'react';

const Emailer = lazy(
  () => import('./emailer' /* webpackChunkName: "emailer" */)
);

export default Emailer;
