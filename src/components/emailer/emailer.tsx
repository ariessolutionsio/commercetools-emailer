import { useIntl } from 'react-intl';
import { useHistory, useRouteMatch } from 'react-router-dom';
// import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import Constraints from '@commercetools-uikit/constraints';
import FlatButton from '@commercetools-uikit/flat-button';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import SelectField from '@commercetools-uikit/select-field';
import TextInput from '@commercetools-uikit/text-input';
import TextField from '@commercetools-uikit/text-field';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { BackIcon } from '@commercetools-uikit/icons';
import { useState } from 'react';

const emailTypes = [
  { value: 'create-account-confirmation', label: 'Create Account Confirmation' },
  { value: 'create-account-verification', label: 'Create Account Verification' },
  { value: 'forgot-password', label: 'Forgot Password' },
  { value: 'order-confirmation', label: 'Order Confirmation' },
  { value: 'shipping-confirmation', label: 'Shipping Confirmation' },
];

const EmailTemplateCreator = (props: { linkToDashboard?: string; }) => {
  const intl = useIntl();
  const { push } = useHistory();
  const match = useRouteMatch();
//   const { dataLocale } = useApplicationContext((context) => ({
//     dataLocale: context.dataLocale,
//   }));

  const [emailType, setEmailType] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Here would go the logic to save the template (simulated for now)
    setTimeout(() => {
      setIsSaving(false);
      push(`${match.url}`);
    }, 1000);
  };

  return (
    <Spacings.Stack scale="xl">
      <Spacings.Stack scale="xs">
        <FlatButton
          as="button"
          onClick={() => push(props.linkToDashboard || '')}
          label={intl.formatMessage({ id: 'back', defaultMessage: 'Back to Dashboard' })}
          icon={<BackIcon />}
        />
        <Text.Headline as="h2" intlMessage={{ id: 'title', defaultMessage: 'Create Email Template' }} />
      </Spacings.Stack>

      <Constraints.Horizontal max={13}>
        <Spacings.Stack scale="m">
          <SelectField
            title="Email Type"
            value={emailType}
            options={emailTypes}
            onChange={(event) => setEmailType(event.target.value as string)}
            placeholder="Select an email type"
            isRequired
          />

          <TextInput
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Enter email subject"
          />

          <TextField
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Enter email content here (e.g., Dear {customer}, your order #{orderNumber} is confirmed...)"
            title="Content"
            isRequired
          />

          <PrimaryButton
            label="Save Template"
            onClick={handleSave}
            isDisabled={!emailType || !subject || !content || isSaving}
          />

          {isSaving && <LoadingSpinner />}
        </Spacings.Stack>
      </Constraints.Horizontal>
    </Spacings.Stack>
  );
};

EmailTemplateCreator.displayName = 'EmailTemplateCreator';

export default EmailTemplateCreator;