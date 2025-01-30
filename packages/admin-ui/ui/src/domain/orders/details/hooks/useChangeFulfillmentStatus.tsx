import { useTranslation } from 'react-i18next';
import useNotification from '../../../../hooks/use-notification';
import { getErrorMessage } from '../../../../utils/error-messages';

const useChangeFulfillmentStatus = (orderId: string) => {
  const notification = useNotification();
  const { t } = useTranslation();

  const changeFulfillmentStatus = async (status: string) => {
    try {
      const url = process.env.BE_URL ?? 'http://localhost:9000';
      const res = await fetch(`${url}/admin/change-fulfillment-status/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ fulfillment_status: status }),
      });
      const data = await res.json();

      if (!data.order) {
        notification(
          t('details-error', 'Error'),
          t('details-fulfillment-status-not-changed', (data.message as string) || 'Fulfillment status not changed'),
          'error',
        );
      }

      notification(
        t('details-success', 'Success'),
        t('details-fulfillment-status-changed', (data.message as string) || 'Fulfillment status changed'),
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
