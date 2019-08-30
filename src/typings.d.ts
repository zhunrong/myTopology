interface NodeModule {
  hot: any
}

declare module '*.scss' {
  interface IStyle {
    [key: string]: string
  }
  const style: IStyle
  export default style
}