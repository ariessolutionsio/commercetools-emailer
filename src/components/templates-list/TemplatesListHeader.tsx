import { useIntl } from 'react-intl';
import Text from '@commercetools-uikit/text';
import FlatButton from '@commercetools-uikit/flat-button';
import styles from './TemplatesList.module.css';
import { useHistory } from 'react-router';
import useBasePath from '../../hooks/useBasePath';

export const TemplatesListHeader = () => {
  const intl = useIntl();
  const { push } = useHistory();
  const basePath = useBasePath();

  const TEXT = {
    title: intl.formatMessage({ id: 'title', defaultMessage: 'Templates' }),
  };

  return (
    <div className={styles['template-list-header']}>
      <Text.Headline
        as="h2"
        intlMessage={{ id: 'title', defaultMessage: TEXT.title }}
      />
      <FlatButton
        as="button"
        label="Create New Template"
        onClick={() => push(`${basePath}/creator`)}
      />
    </div>
  );
};
