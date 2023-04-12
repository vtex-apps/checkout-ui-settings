const setReceiverPhoneNumber = (phoneNumber) => {
  if (!window.vtexjs || !phoneNumber || window.vtexjs.checkout.orderForm?.shippingData?.address?.complement) return;

  const { shippingData } = window?.vtexjs?.checkout?.orderForm;
  if (shippingData?.address && !shippingData.address.complement) shippingData.address.complement = phoneNumber;

  window.vtexjs.checkout.sendAttachment('shippingData', shippingData);
};

export default setReceiverPhoneNumber;
