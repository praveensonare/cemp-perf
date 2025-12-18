import React from 'react';
import { render } from '@testing-library/react';
import { NodesProvider, NodesContext } from '../../NodesContext';

describe('NodesProvider component', () => {
  it('should render the children without throwing an error', () => {
    const { getByText } = render(
      <NodesProvider>
        <div>Test Children</div>
      </NodesProvider>
    );

    expect(getByText('Test Children')).toBeInTheDocument();
  });


  it('should pass', () => {
    expect(true).toBeTruthy();
  });
  
});