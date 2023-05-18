/* eslint-disable import/prefer-default-export */
export const requiredAddressFields = [
  'receiverName',
  'street',
  'neighborhood',
  'state',
  'city',
  'country',
  'postalCode',
];

export const requiredRicaFields = [
  'idOrPassport',
  'sameAddress',
  'fullName',
  'streetAddress',
  'suburb',
  'city',
  'postalCode',
  'province',
];

export const requiredTVFields = ['tvID'];

export const validAddressTypes = ['residential', 'inStore', 'commercial', 'giftRegistry', 'pickup', 'search'];
