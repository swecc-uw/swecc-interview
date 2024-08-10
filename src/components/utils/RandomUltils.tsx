export const devPrint = (...data: any[]): void => {
    if (import.meta.env.VITE_ENV === 'development') {
      console.log(...data);
    }
  };
  