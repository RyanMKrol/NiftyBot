/**
 * Convert JS Map to JSON
 *
 * @param {Map<any>} map The map to convert
 * @returns {JSON} A plain json object
 */
function convertMapToMap(map) {
  const jsonObject = {};

  map.forEach((value, key) => {
    jsonObject[key] = value;
  });

  return jsonObject;
}

export default convertMapToMap;
