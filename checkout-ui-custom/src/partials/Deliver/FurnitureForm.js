import FormField from './Elements/FormField';
// import furnitureForm from './constants';

const furnitureForm = {
  buildingType: [
    {
      value: '',
      label: 'Please select',
      disabled: true,
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
      value: '',
      label: 'Please select',
      disabled: true,
    },
    {
      value: 15,
      label: '15 meters',
    },
    {
      value: 25,
      label: '25 meters',
    },
    {
      value: 50,
      label: '50 meters',
    },
    {
      value: 100,
      label: '100+ meters',
    },
  ],
  deliveryFloor: [
    {
      value: '',
      label: 'Please select',
      disabled: true,
    },
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
      value: '',
      label: 'Please select',
      disabled: true,
    },
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

const FurnitureForm = () => {
  const { buildingType, parkingDistance, deliveryFloor, liftStairs } = furnitureForm;

  const fields = [
    {
      name: 'buildingType',
      label: 'Building Type',
      required: true,
      type: 'dropdown',
      options: buildingType,
    },
    {
      name: 'parkingDistance',
      label: 'Parking Distance',
      required: true,
      type: 'dropdown',
      options: parkingDistance,
    },
    {
      name: 'deliveryFloor',
      label: 'Delivery Floor',
      required: true,
      type: 'dropdown',
      options: deliveryFloor,
    },
    {
      name: 'liftStairs',
      label: 'Lift or Stairs',
      required: true,
      type: 'dropdown',
      options: liftStairs,
    },
    {
      name: 'hasSufficientSpace',
      label: 'Is there sufficent corner/passage door space?',
      value: false,
      type: 'checkbox',
      checked: false,
    },
    {
      name: 'assembleFurniture',
      label: 'Would you like us to assemble your furniture items?',
      type: 'checkbox',
      value: false,
      checked: false,
    },
  ];

  const formFields = fields.map((field) => FormField(field)).join('');

  return `
    ${formFields}
  `;
};

export default FurnitureForm;
