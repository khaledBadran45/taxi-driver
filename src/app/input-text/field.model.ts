import { FormControl } from '@angular/forms';
export interface field {
  label: string;
  control: any;
  type?: string;
  isReadOnly?: boolean;
  placeholder: string | number;
}
