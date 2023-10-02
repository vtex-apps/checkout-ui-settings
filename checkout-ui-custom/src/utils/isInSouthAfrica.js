/**
 * isInSouthAfrica
 * Validate coordinates to ensure that they are in South Africa.
 * @param {[lnt, lat]} coordinates
 * @returns
 */
const isInSouthAfrica = (coordinates) => {
  const [lng, lat] = coordinates;
  return lng >= 16.3440 && lng <= 32.8301 && lat >= -34.8191 && lat <= -22.1277;
};

export default isInSouthAfrica;
