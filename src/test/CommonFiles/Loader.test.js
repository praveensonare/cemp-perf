import React from 'react';
import { render } from '@testing-library/react';
import Loader from '../../Loader';

describe('Loader component', () => {
  it('should render the loader', () => {
    const { container } = render(<Loader />);
    const loaderElement = container.querySelector('.loader');
    expect(loaderElement).toBeInTheDocument();
  });
});