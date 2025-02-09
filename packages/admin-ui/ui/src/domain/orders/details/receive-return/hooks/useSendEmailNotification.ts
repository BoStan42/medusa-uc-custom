import { useMedusa } from 'medusa-react';

export const useSendEmailNotification = () => {
  const { client } = useMedusa();

  const sendRejectRefundRequestEmail = async (orderId: string) => {
    try {
      await client.admin.custom.get(`admin/reject_refund_request/${orderId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const sendApproveRefundRequestEmail = async (orderId: string) => {
    try {
      await client.admin.custom.get(`admin/approve_refund_request/${orderId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return { sendRejectRefundRequestEmail, sendApproveRefundRequestEmail };
};
