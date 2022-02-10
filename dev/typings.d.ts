interface NodeModule {
  hot: any
}

declare module '*.less' {
  interface IStyle {
    [key: string]: string
  }
  const style: IStyle;
  export default style;
}

declare module '*.scss' {
  interface IStyle {
    [key: string]: string
  }
  const style: IStyle;
  export default style;
}

declare module 'resize-observer-polyfill' {
  class ResizeObserver {
    constructor(callback: (entries: any, ob: ResizeObserver) => void)
    observe(el: HTMLElement): void
    unobserve(el: HTMLElement): void
    disconnect(): void
  }
  export default ResizeObserver;
}
