// @see https://docs.aircode.io/guide/functions/
import aircode from 'aircode';
import {all} from './foo.mjs';

export default async function (params, context) {
  console.log('Received params:', params);
  return {
    message: 'Hi, AirCode.2',
    all,
  };
}
