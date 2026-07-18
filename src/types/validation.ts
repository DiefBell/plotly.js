'use strict';

export interface ValidationError {
    code: string;
    container: string;
    trace?: number | null;
    path: (string | number)[] | string;
    astr?: string;
    msg: string;
}
