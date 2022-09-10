export class Upload {
  file: ProFile;
  progress: number;
  buffer: number;
  started: boolean;
  transferred: number;
  extensionAllowed = true;
  fileSizeAllowed: boolean;
  fileZeroBytes: boolean = false;
  virus: string;
}

export class ProFile extends File {
  fullPath: string = "";
}