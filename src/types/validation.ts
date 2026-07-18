'use strict';

export interface ValidationError {
    code: string;
    container: string;
    trace?: number;
    path: (string | number)[];
    astr?: string;
    msg: string;
}
