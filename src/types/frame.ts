'use strict';

import {Data} from './data';
import {Layout} from './layout';

export interface Frame {
    name?: string;
    data?: Partial<Data>[];
    layout?: Partial<Layout>;
    traces?: number[];
    baseframe?: string;
    [key: string]: any;
}
