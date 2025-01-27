import axios from 'axios';

export const sendEmailNotification = async (orderId: string) => {
  const baseUrl = process.env.BE_URL ?? 'http://localhost:9000';

  try {
    axios.get(`${baseUrl}/admin/reject_refund_request/${orderId}`);
  } catch (error) {
    console.log(error);
  }
};
