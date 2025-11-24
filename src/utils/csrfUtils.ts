// Utility function to get CSRF token
export const getCSRFToken = (): string => {
  const metaTag = document.querySelector(
    'meta[name="csrf-token"]'
  ) as HTMLMetaElement;
  return metaTag?.content || "";
};
