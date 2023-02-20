const setReceiverPhoneNumber = (phoneNumber) => {
  if (!window.vtexjs || !phoneNumber || window.vtexjs.checkout.orderForm?.shippingData?.address?.complement) return;
  window.vtexjs.checkout.getOrderForm().then((orderForm) => {
    const { shippingData } = orderForm;
    if (shippingData?.address && !shippingData.address.complement) shippingData.address.complement = phoneNumber;
    return window.vtexjs.checkout.sendAttachment('shippingData', shippingData);
  });
};

export default setReceiverPhoneNumber;
