export interface EmailTemplateValue {
  type: string;
  subject: string;
  body: string;
}

export interface EmailTemplateCreatorProps {
  linkToDashboard: string;
} 