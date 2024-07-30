async function getConstantValues() {
  const url = '/constants.json';
  let constants;
  try {
    const response = await fetch(url).then((resp) => resp.json());
    if (!response.ok) {
      constants = response;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error with constants file', error);
  }
  return constants;
}

const formatValues = (values) => {
  const obj = {};
  if (values) {
    /* eslint-disable-next-line */
    values.forEach(({ name, value }) => obj[name] = value);
  } else {
    // eslint-disable-next-line no-console
    console.error('Error with constants file', values);
  }
  return obj;
};

const {
  fgrep,
} = await getConstantValues();

const FGREP_VALUES = formatValues(fgrep?.data);
export default FGREP_VALUES;
