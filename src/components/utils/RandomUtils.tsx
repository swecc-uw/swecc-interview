export const devPrint = (...data: any[]): void => {
  if (import.meta.env.DEV) {
    console.log(...data);
  }
};
