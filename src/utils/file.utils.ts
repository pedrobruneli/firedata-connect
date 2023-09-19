export const isJson = (path: string) => {
  return path.split(".").pop() === "json";
};
