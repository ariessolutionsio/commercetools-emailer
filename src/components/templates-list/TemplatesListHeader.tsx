import Text from '@commercetools-uikit/text';
import FlatButton from '@commercetools-uikit/flat-button';
import styles from './TemplatesList.module.css';
import { useHistory } from 'react-router';
import useBasePath from '../../hooks/useBasePath';
import messages from './messages';

export const TemplatesListHeader = () => {
  const { push } = useHistory();
  const basePath = useBasePath();

  return (
    <div className={styles['template-list-header']}>
      <Text.Headline as="h2" intlMessage={messages.title} />
      <FlatButton
        as="button"
        label="Create New Template"
        onClick={() => push(`${basePath}/creator`)}
      />
    </div>
  );
};
