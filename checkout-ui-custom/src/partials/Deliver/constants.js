/* eslint-disable import/prefer-default-export */
export const furnitureForm = {
  buildingType: [
    {
      value: '',
      label: 'Select',
    },
    {
      value: 'freeStanding',
      label: 'Free standing',
    },
    {
      value: 'houseInComplex',
      label: 'House in complex',
    },
    {
      value: 'townhouse',
      label: 'Townhouse',
    },
    {
      value: 'apartment',
      label: 'Apartment',
    },
  ],

  parkingDistance: [
    {
      value: 15,
      label: 15,
    },
    {
      value: 25,
      label: 25,
    },
    {
      value: 50,
      label: 50,
    },
    {
      value: 100,
      label: 100,
    },
  ],
  deliveryFloor: [
    {
      value: 'ground',
      label: 'Ground',
    },
    {
      value: '1',
      label: '1',
    },
    {
      value: '2',
      label: '2',
    },
    {
      value: '3+',
      label: '3+',
    },
  ],
  liftStairs: [
    {
      value: 'lift',
      label: 'Lift',
    },
    {
      value: 'stairs',
      label: 'Stairs',
    },
  ],
};

export const requiredAddressFields = [
  'receiverName',
  'complement',
  'street',
  'neighborhood',
  'state',
  'city',
  'country',
  'postalCode',
];

export const requiredFurnitureFields = [
  'buildingType',
  'assembleFurniture',
  'deliveryFloor',
  'hasSufficientSpace',
  'liftOrStairs',
  'parkingDistance',
];

export const requiredRicaFields = ['tvID'];

export const validAddressTypes = ['residential', 'inStore', 'commercial', 'giftRegistry', 'pickup', 'search'];
