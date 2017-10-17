export const getMock = <T>(fn: (...args: any[]) => T) => fn as jest.Mock<T>;
