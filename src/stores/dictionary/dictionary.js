import { derived } from 'svelte/store';

import { LangCode } from './langCode.js';

import { AllDict } from './dictionaryAll.js';

export const Dict = derived(
    [LangCode, AllDict],
    ([$langCode, $allDict]) => $allDict[$langCode]
);

