import { CSSProp } from 'styled-components';

declare module 'react' {
  interface Attributes {
    css?: CSSProp;
  }
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
