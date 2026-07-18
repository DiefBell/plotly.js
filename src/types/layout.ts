'use strict';

export interface Layout {
    title?: any;
    width?: number;
    height?: number;
    autosize?: boolean;
    template?: any;
    // full layout attribute schema is defined across src/plots/*
    // and is not exhaustively typed here
    [key: string]: any;
}
