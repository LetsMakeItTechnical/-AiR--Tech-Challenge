/**
 * Function that will generate a Invoice's file name.
 * This is currently done for persistence on a S3 Bucket
 * @param refNo
 * @param vendorId
 * @param pageNumber
 */
// eslint-disable-next-line func-style
export function generateInvoiceFileName(
  refNo: string,
  vendorId: string,
  pageNumber: number | null = null
): string {
  const paddedVendorId = `${vendorId}`.padStart(5, '0');
  const basePath = `${process.env.NODE_ENV}/${paddedVendorId}/`;

  return pageNumber ? `${basePath}${refNo}-${pageNumber}` : `${basePath}${refNo}`;
}
