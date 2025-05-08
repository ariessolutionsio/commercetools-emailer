import { useState } from 'react';
import SelectField from '@commercetools-uikit/select-field';
import { emailTypes } from './constants';
import { filterEmailTypesWithCustomObjects } from '../../helpers';
import { useCustomObjectsFetcher } from '../../hooks/use-custom-objects-connector/use-custom-object-connector';
import { CONTAINER } from '../../constants';
import type { EmailType } from './types';

interface EmailerTypeSelectorProps {
  emailType: string;
  setEmailType: (emailType: string) => void;
}

export const EmailerTypeSelector = ({
  emailType,
  setEmailType,
}: EmailerTypeSelectorProps) => {
  const { customObjectsPaginatedResult } = useCustomObjectsFetcher({
    limit: 500,
    offset: 0,
    container: CONTAINER,
  });

  const filteredEmailTypes = filterEmailTypesWithCustomObjects(
    customObjectsPaginatedResult,
    emailTypes
  );

  return (
    <SelectField
      title="Email Type"
      value={emailType}
      options={filteredEmailTypes}
      onChange={(event) => setEmailType(event.target.value as string)}
      placeholder="Select an email type"
      isRequired
      isOptionDisabled={(opt) => {
        const option = opt as EmailType;
        return option.isUsed;
      }}
    />
  );
};
