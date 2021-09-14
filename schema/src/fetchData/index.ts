export interface FetchDataFn {
  (src: string): Promise<Uint8Array>;
}
