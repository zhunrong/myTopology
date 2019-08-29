interface NodeModule {
  hot: any
}

declare module '*.less' {
  interface IStyle {
    [key: string]: string
  }
  const style: IStyle
  export default style
}