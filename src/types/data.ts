'use strict';

export interface Data {
    type?: string;
    visible?: boolean | 'legendonly';
    name?: string;
    uid?: string;
    // full trace attribute schema is defined per-module in src/traces/*
    // and is not exhaustively typed here
    [key: string]: any;
}
