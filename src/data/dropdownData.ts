export interface DropdownOption {
  description: string;
  value: string;
  expectedText: string;
}

export const dropdownOptions: DropdownOption[] = [
  { description: 'Option 1', value: '1', expectedText: 'Option 1' },
  { description: 'Option 2', value: '2', expectedText: 'Option 2' },
];