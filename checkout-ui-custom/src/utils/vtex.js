import sendEvent from './sendEvent';

const setReceiverPhoneNumber = (phoneNumber) => {
  if (!window.vtexjs || !phoneNumber || window.vtexjs.checkout.orderForm?.shippingData?.address?.complement) return;

  try {
    window.vtexjs.checkout.getOrderForm().then((orderForm) => {
      const { shippingData } = orderForm;
      if (shippingData?.address && !shippingData.address.complement) shippingData.address.complement = phoneNumber;
      return window.vtexjs.checkout.sendAttachment('shippingData', shippingData);
    });
  } catch (e) {
    console.error('VTEX_ORDERFORM_ERROR: Could not load at setReceiverPhoneNumber', e);
    sendEvent({
      eventCategory: 'Checkout_SystemError',
      action: 'OrderFormFailed',
      label: 'Could not getOrderForm() from vtex',
      description: 'Could not load orderForm at setReceiverPhoneNumber'
    });
  }
};

export default setReceiverPhoneNumber;
