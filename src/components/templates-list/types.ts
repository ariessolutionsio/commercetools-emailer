export type RowData = {
  id: string;
  type: string;
  subject: string;
  body: string;
  version: number;
};

export type SortState = {
  key: string;
  dir?: 'desc' | 'asc';
};
