import Label from '@commercetools-uikit/label';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import SubjectWithMergeTags from './SubjectWithMergeTags';
import { processSubjectMergeTags } from './utils/subjectMergeTagProcessor';
import styles from './Emailer.module.css';

interface EmailSubjectEditorProps {
  subject: string;
  setSubject: (subject: string) => void;
}

export const EmailSubjectEditor = ({
  subject,
  setSubject,
}: EmailSubjectEditorProps) => {
  return (
    <div>
      <Label>Subject</Label>
      <SubjectWithMergeTags
        value={subject}
        onChange={setSubject}
        placeholder="Enter email subject"
      />
      {subject && (
        <div className={styles['subject-preview-container']}>
          <Spacings.Stack scale="xs">
            <Label>Subject Preview</Label>
            <div className={styles['subject-preview-box']}>
              <Text.Body>{processSubjectMergeTags(subject)}</Text.Body>
            </div>
          </Spacings.Stack>
        </div>
      )}
    </div>
  );
};
