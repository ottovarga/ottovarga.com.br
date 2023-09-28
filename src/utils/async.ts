export const asyncFilter = async (
  arr: any[],
  predicate: (value: any, index?: number, array?: any[]) => unknown
) =>
  arr.reduce(
    async (memo, e) => ((await predicate(e)) ? [...(await memo), e] : memo),
    []
  )

export const sleep = (delay: number) =>
  new Promise(resolve => setTimeout(resolve, delay))
