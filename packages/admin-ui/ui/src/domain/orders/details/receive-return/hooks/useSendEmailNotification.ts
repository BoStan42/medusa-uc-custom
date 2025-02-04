// import { BACKEND_URL } from '../../../../../constants/medusa-backend-url';

import { useMedusa } from 'medusa-react';

export const useSendEmailNotification = () => {
  const { client } = useMedusa();
  const sendEmailNotification = async (orderId: string) => {
    try {
      await client.admin.custom.get(`admin/reject_refund_request/${orderId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return { sendEmailNotification };
};
