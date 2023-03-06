/**
 * sendEvent
 * Function to send user errors that we don't log,
 * which the user may encounter.
 *
 */
const sendEvent = ({
  eventCategory = 'Checkout_UserErrors',
  /* action - action the user performed, eg Credit Card Payment */
  action = '',
  /* label - Name / refrence for the error */
  label = '',
  /* description -  More info - what error was shown to user */
  description = '',
  /* value - Option to add a value (eg. transaction amount?) */
  value = undefined,
}) => {
  const doPush = () => {
    window.dataLayer.push({
      event: 'gaEvent',
      eventCategory,
      eventLabel: label,
      eventAction: action,
      eventValue: value,
      eventDescription: description,
    });
  };

  // Wait for GTM if necessary.
  if (!window.dataLayer) {
    $(window).off('gtm.load');
    $(window).on('gtm.load', doPush);
    return;
  }

  doPush();
};

export default sendEvent;
