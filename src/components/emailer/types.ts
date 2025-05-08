export interface EmailTemplateValue {
  type: string;
  subject: string;
  body: string;
}

export type EmailType = {
  value: string;
  label: string;
  isUsed: boolean;
};
