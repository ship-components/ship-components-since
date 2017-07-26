/* eslint-disable react/no-multi-comp */

import React from 'react';
import { mount } from 'enzyme';
import ms from 'ms';
import renderer from 'react-test-renderer';

import Since from '../Since';

const ExpectedValues = {
  '1s' : ms('1s'),
  '30s' : ms('30s'),
  '1m' : ms('1m'),
  '1h' : ms('1h'),
  'in 30m' : ms('30m') * -1
};

Object.keys(ExpectedValues).forEach((fuzzyTime) => {
  test(`it should render ${fuzzyTime} when the difference from now and the timestamp is ${ExpectedValues[fuzzyTime]}ms`, () => {
    const tree = renderer.create(
      <Since
        timestamp={Date.now() - ExpectedValues[fuzzyTime]}
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});


test('it should add "ago" if the showSuffix prop is supplied', () => {
  const wrapper = mount(
    <Since
      showSuffix
      timestamp={Date.now() - 10000}
    />
  );
  expect(wrapper.html().includes('ago')).toBeTruthy();
});

test('it should remove "in" if the showPrefix prop is false', () => {
  const wrapper = mount(
    <Since
      showPrefix={false}
      timestamp={Date.now() - 10000}
    />
  );
  expect(wrapper.html().includes('in')).toBeFalsy();
});

test('it should change the update frequency depending on how close to the timestamp Date.now() is', () => {
  const wrapper = mount(
    <Since
      timestamp={Date.now()}
    />
  );
  // Sub 1s
  expect(wrapper.get(0).getInterval()).toBe(300);

  // Sub 1m
  wrapper.setProps({
    timestamp: Date.now() + 2000
  });
  expect(wrapper.get(0).getInterval()).toBe(1000);

  // Greater than 1m
  wrapper.setProps({
    timestamp: Date.now() + 20000000
  });
  expect(wrapper.get(0).getInterval()).toBe(10000);
});

test('it should support custom tag types', () => {
  const wrapper = mount(
    <Since
      tag='div'
      timestamp={Date.now()}
    />
  );
  expect(wrapper.find('span').length).toBe(0);
  expect(wrapper.find('div').length).toBe(1);
});

test('it should clear the timeout when it unmounts', () => {
  const wrapper = mount(
    <Since
      tag='div'
      timestamp={Date.now()}
    />
  );
  const _clearTimeout = window.clearTimeout;
  window.clearTimeout = jest.fn();

  expect(typeof wrapper.get(0).updateId).toBe('number');
  wrapper.unmount();
  expect(window.clearTimeout.mock.calls.length).toBe(1);

  window.clearTimeout = _clearTimeout;
});

test('it should update when the className or timestamp changes', () => {
  const props = {
    timestamp: Date.now(),
    className: 'test'
  };
  const shouldComponentUpdate = Since.prototype.shouldComponentUpdate.bind({ props });
  expect(shouldComponentUpdate(Object.assign({}, props, {
    className: 'changed'
  }))).toBe(true);
  expect(shouldComponentUpdate(Object.assign({}, props, {
    timestamp: Date.now() + 1000
  }))).toBe(true);
  expect(shouldComponentUpdate(props)).toBe(false);
});
