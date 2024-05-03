import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Landing from './Landing';

it('displays error', () => {
    const landing = render(<Landing></Landing>)
    const loginButton = landing("loginTest")
    fireEvent.press(loginButton)

    expect(landing('error'))
})