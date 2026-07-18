'use strict';

import {Data} from './data';
import {Layout} from './layout';
import {Config} from './config';
import {Frame} from './frame';

// the `gd` parameter every plot_api public function normalizes via
// Lib.getGraphDiv before use - a real DOM element carrying plotly's
// internal state as extra properties
export interface GraphDiv extends HTMLDivElement {
    data?: Data[];
    layout?: Partial<Layout>;
    frames?: Partial<Frame>[];
    config?: Partial<Config>;
    _fullData?: Data[];
    _fullLayout?: Layout & Record<string, any>;
    // _context is the runtime-normalized config (e.g. `setBackground` is
    // coerced from a string setting into an actual callback), not raw Config
    _context?: Record<string, any>;
    _promises?: Promise<any>[];
    _transitioning?: boolean;
    _transitionData?: Record<string, any>;
    calcdata?: any[];
    // remaining internal (mostly `_`-prefixed) state attached at runtime
    [key: string]: any;
}
