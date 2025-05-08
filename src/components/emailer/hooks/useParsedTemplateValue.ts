import { Maybe } from 'graphql/jsutils/Maybe';
import { EmailTemplateValue } from '../types';
import { TCustomObject } from '../../../types/generated/ctp';

export const useParsedTemplateValue = (
  templateData: Maybe<TCustomObject>
): EmailTemplateValue | null => {
  if (!templateData) return null;

  try {
    const value = templateData.value as unknown as EmailTemplateValue;

    return {
      type: value.type,
      subject: value.subject,
      body: JSON.parse(value.body),
    };
  } catch (err) {
    console.error('Error parsing template body:', err);
    return null;
  }
};
