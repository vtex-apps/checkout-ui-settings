import isInSouthAfrica from '../isInSouthAfrica';

test('coordinates at the northwestern edge', () => {
  expect(isInSouthAfrica([16.3440, -22.1277])).toBe(true);
});

test('coordinates at the northeastern edge', () => {
  expect(isInSouthAfrica([32.8301, -22.1277])).toBe(true);
});

test('coordinates at the southwestern edge', () => {
  expect(isInSouthAfrica([16.3440, -34.8191])).toBe(true);
});

test('coordinates at the southeastern edge', () => {
  expect(isInSouthAfrica([32.8301, -34.8191])).toBe(true);
});

test('coordinates outside South Africa (north)', () => {
  expect(isInSouthAfrica([25.0000, -20.0000])).toBe(false);
});

test('coordinates outside South Africa (south)', () => {
  expect(isInSouthAfrica([25.0000, -36.0000])).toBe(false);
});
