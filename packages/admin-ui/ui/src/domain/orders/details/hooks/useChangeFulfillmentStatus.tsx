import { useTranslation } from 'react-i18next';
import useNotification from '../../../../hooks/use-notification';
import { getErrorMessage } from '../../../../utils/error-messages';
import { useMedusa } from 'medusa-react';

const useChangeFulfillmentStatus = (orderId: string) => {
  const { client } = useMedusa();
  const notification = useNotification();
  const { t } = useTranslation();

  const changeFulfillmentStatus = async (status: string) => {
    try {
      const res = await client.admin.custom.post(`admin/change-fulfillment-status/${orderId}`, {
        fulfillment_status: status,
      });

      if (!res.order) {
        notification(
          t('details-error', 'Error'),
          t('details-fulfillment-status-not-changed', (res.message as string) || 'Fulfillment status not changed'),
          'error',
        );
      }

      notification(
        t('details-success', 'Success'),
        t('details-fulfillment-status-changed', (res.message as string) || 'Fulfillment status changed'),
        'success',
      );
    } catch (error) {
      console.log('error', error);

      notification(t('details-error', 'Error'), getErrorMessage(error), 'error');
    }
  };

  return { changeFulfillmentStatus };
};

export default useChangeFulfillmentStatus;
