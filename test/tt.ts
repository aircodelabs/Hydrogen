// @see https://docs.aircode.io/guide/functions/
import aircode from 'aircode';

export default async function (params: any, context: any) {
  console.log('Received params:', params);
  return {
    message: 'Hi, AirCode.',
  };
};
