import axios from 'axios';

export const sendEmailNotification = async (orderId: string) => {
  const baseUrl = process.env.BE_URL ?? 'http://localhost:9000';

  try {
    const res = await fetch(`${baseUrl}/admin/reject_refund_request/${orderId}`, {
      credentials: 'include',
    });

    console.log(res);
  } catch (error) {
    console.log(error);
  }
};
