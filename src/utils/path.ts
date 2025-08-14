export const normalizePath = (path: string | undefined | null): string => {
  if (!path) return "/";
  let p = path;
  // Remove query/hash
  const hashIndex = p.indexOf("#");
  if (hashIndex !== -1) p = p.slice(0, hashIndex);
  const queryIndex = p.indexOf("?");
  if (queryIndex !== -1) p = p.slice(0, queryIndex);
  // Trim trailing slashes except for root
  if (p.length > 1) p = p.replace(/\/+$/, "");
  return p || "/";
};

export const isActivePath = (
  currentPath: string,
  targetPath: string,
  exact: boolean = false,
): boolean => {
  const current = normalizePath(currentPath);
  const target = normalizePath(targetPath);
  if (exact) {
    return current === target;
  }
  return current === target || current.startsWith(target + "/");
};
