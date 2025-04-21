export type RowData = {
  id: string;
  type: string;
  subject: string;
  version: number;
};

export type SortState = {
  key: string;
  dir?: 'desc' | 'asc';
};
