import FormField from './Elements/FormField';
// import furnitureForm from './constants';

const furnitureForm = {
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
      name: 'Is there sufficent corner/passage door space?',
      label: '',
      type: 'checkbox',
      checked: false,
    },
    {
      name: 'Would you like us to assemble your furniture items?',
      label: '',
      type: 'checkbox',
      checked: false,
    },
  ];

  const formFields = fields.map((field) => FormField(field)).join('');

  return `
  <form id="bash--address-form" method="post">
    ${formFields}
  </form>
  `;
};

export default FurnitureForm;
