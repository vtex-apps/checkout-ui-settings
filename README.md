# Custom shipping step by items

## Installation

```cmd
vtex install custom-shipping-step-by-items@x.x.x
```

## How to use?

TODO: explicar uso de app

```js
function setAppConfiguration(config) {
  config.furnitureId = "1";
  config.tvId = "1";
  config.simCardId = "1";
  config.buildingType = [
    "Free standing",
    "House in complex",
    "Townhouse",
    "Apartment",
  ];
  config.parkingDistance = [15, 25, 50, 100, 500];
  config.deliveryFloor = ["1", "2", "3+"];
  config.liftStairs = ["lift", "stairs"];
  config.RICAMsg =
    "You can't collect this order in store because your cart contains items which require either RICA or TV License validation.";
  config.MixedProductsMsg =
    "We'll ship your furniture and other items in your cart to the selected address. Only the furniture delivery fee will apply.";
}
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
