export interface OrderBookInterface {
    pair: Pair
    event: string,
    channel: string,
    prec: Precision,
    len: LengthOptions,
    freq: FreqOptiom,

}


export type Pair = 'BTCUSD'
type LengthOptions = 1 | 25 | 100 | 250
type Precision = 'P0' | 'P1' | 'P2' | 'P3' | 'P4'
type FreqOptiom = 'F0' | 'F1'