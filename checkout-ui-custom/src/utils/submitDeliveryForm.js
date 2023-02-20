import { requiredRicaFields, requiredTVFields } from '../partials/Deliver/constants';
import { setDeliveryLoading } from '../partials/Deliver/utils';
import { RICA_APP, STEPS, TV_APP } from './const';
import { clearLoaders, getSpecialCategories } from './functions';
import { addOrUpdateAddress, getAddressByName, sendOrderFormCustomData } from './services';
import setAddress from './setAddress';

const submitDeliveryForm = async (event) => {
  event.preventDefault();
  const { items } = window.vtexjs.checkout.orderForm;
  const { address } = window.vtexjs.checkout.orderForm.shippingData;
  const { hasTVs, hasSimCards } = getSpecialCategories(items);

  // Prevent false positive validation errors for invalid selects.
  $('select').change();

  let fullAddress = {};

  const selectedAddressRadio = "[name='selected-address']:checked";

  // Prevent sending without having selected an address.
  if ($(selectedAddressRadio).length < 1) {
    $('html, body').animate({ scrollTop: $('#bash--delivery-form').offset().top }, 400);
    return;
  }

  setDeliveryLoading();

  const dbAddress = await getAddressByName($(selectedAddressRadio).val());

  fullAddress = { ...address, ...dbAddress };

  // Final check to validate that the selected address has no validation errors.
  const { success: didSetAddress } = await setAddress(fullAddress, { validateExtraFields: false });
  if (!didSetAddress) {
    console.error('Delivery Form - Address Validation error');
    clearLoaders();
    return;
  }

  const ricaData = {};
  const tvData = {};

  // Not saved to address profile.
  if (hasSimCards) {
    const fields = requiredRicaFields;
    for (let i = 0; i < fields.length; i++) {
      if (fields[i] === 'sameAddress') {
        const isFieldChecked = $(`#bash--input-${fields[i]}`).is(':checked');
        ricaData[fields[i]] = isFieldChecked;
      }
      ricaData[fields[i]] = $(`#bash--input-rica_${fields[i]}`).val() || '';
    }

    const ricaDataSent = await sendOrderFormCustomData(RICA_APP, ricaData, true);
    console.info({ ricaDataSent });
  }

  if (hasTVs) {
    const fields = requiredTVFields;
    for (let i = 0; i < fields.length; i++) {
      if (!address[fields[i]]) fullAddress[fields[i]] = $(`#bash--input-tv_${fields[i]}`).val();
      tvData[fields[i]] = $(`#bash--input-tv_${fields[i]}`).val() || '';
    }

    const tvDataSent = await sendOrderFormCustomData(TV_APP, tvData);
    console.info({ tvDataSent });
  }

  await addOrUpdateAddress(fullAddress);

  // after submitting hide the delivery container
  $('.bash--delivery-container').css('display', 'none');
  window.location.hash = STEPS.PAYMENT;

  clearLoaders();
};

export default submitDeliveryForm;
