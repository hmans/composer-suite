export const chain =
  <A extends any[]>(
    firstFun: (...args: A) => void,
    ...functions: ((...args: any[]) => void)[]
  ) =>
  (...args: A) =>
    functions.reduce((_, next) => next(...args), firstFun(...args))
