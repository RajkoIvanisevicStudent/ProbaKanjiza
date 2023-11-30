import {
    writable
} from 'svelte/store';

export const WaitingLoadingGlobalVisible = writable(false);
export const LoggedInUser = writable({ userId: 1, firstName: "Haralempije", lastName: "Radosavljević", tkn: "654sdf65498d12!651sdf", role: '' });
export const PageTitle = writable('');
export const IsBodyOverflowHidden = writable('false');
export const NumberFormatSettings = writable({ decimalSeparator: ',', thousandsSeparator: '.' });
export const PlanTablePrecision = writable(2);