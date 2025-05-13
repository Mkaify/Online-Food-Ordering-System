import { ReactNode } from 'react';

declare global {
  type ReactChildren = {
    children: ReactNode;
  };
}

export {}; 