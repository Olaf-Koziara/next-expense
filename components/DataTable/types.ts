export type SchemaField = {
  type: "text" | "number" | "date" | "select" | "currency";
  label: string;
  options?: string[];
  editable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  filterVariant?: "text" | "range" | "dateRange" | "select";
};

export type Schema = {
  [key: string]: SchemaField;
};
