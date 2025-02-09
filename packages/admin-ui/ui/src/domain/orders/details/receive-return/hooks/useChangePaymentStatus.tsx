import { useMedusa } from 'medusa-react';

export const useChangePaymentStatus = () => {
  const { client } = useMedusa();

  const changePaymentStatus = async (orderId: string, status: string, callbacks?: (() => void)[]) => {
    await client.admin.custom.post(`/admin/change_payment_status/${orderId}`, {
      status,
    });

    callbacks?.forEach(callback => callback());
  };

  return { changePaymentStatus };
};
