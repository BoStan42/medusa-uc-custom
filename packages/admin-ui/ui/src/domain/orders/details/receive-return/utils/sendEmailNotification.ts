import { MEDUSA_BACKEND_URL } from '../../../../../constants/medusa-backend-url';

export const sendEmailNotification = async (orderId: string) => {
  try {
    const res = await fetch(`${MEDUSA_BACKEND_URL}/admin/reject_refund_request/${orderId}`, {
      credentials: 'include',
    });

    console.log(res);
  } catch (error) {
    console.log(error);
  }
};
