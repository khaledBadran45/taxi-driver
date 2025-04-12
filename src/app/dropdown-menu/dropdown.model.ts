export interface Option {
  id: string|number;
  title: string;
}
export interface Dropdown {
  options: Option[];
  id: string;
  title?: string;
}
