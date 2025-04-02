import { useState } from 'react';
import { DOMAINS } from '@commercetools-frontend/constants';
import { useCustomObjectDeleter } from './use-custom-objects-connector/use-custom-object-connector';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { RowData } from '../components/templates-list/types';

const useDeleteTemplate = (handleCompleted: () => void) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const customObjectDeleter = useCustomObjectDeleter();
  const showNotification = useShowNotification();

  const handleDelete = async (templateData: RowData) => {
    if (!templateData.id) {
      showNotification({
        kind: 'error',
        domain: DOMAINS.SIDE,
        text: 'Please enter a template ID',
      });
      return;
    }

    if (!templateData) {
      showNotification({
        kind: 'error',
        domain: DOMAINS.SIDE,
        text: 'Template not found',
      });
      return;
    }

    setIsDeleting(true);
    try {
      await customObjectDeleter.execute({
        id: templateData.id,
        version: templateData.version,
        onCompleted() {
          showNotification({
            kind: 'success',
            domain: DOMAINS.SIDE,
            text: 'Template deleted successfully!',
          });
          handleCompleted()
        },
        onError() {
          showNotification({
            kind: 'error',
            domain: DOMAINS.SIDE,
            text: 'Error deleting template',
          });
        },
      });
    } catch (error) {
      showNotification({
        kind: 'error',
        domain: DOMAINS.SIDE,
        text: 'Error deleting template',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return { handleDelete, isDeleting };
};

export default useDeleteTemplate;
