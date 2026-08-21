export class PdfMetadataService {
  static extractBasicMetadata(fileName: string, fileSize: number) {
    const sanitizedTitle = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const sizeKB = Math.round(fileSize / 1024);
    return {
      title: sanitizedTitle,
      fileSizeKB: sizeKB,
      isLargeDocument: sizeKB > 10240, // > 10MB
    };
  }
}
