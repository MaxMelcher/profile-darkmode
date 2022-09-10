import { Directive, ElementRef, Input, OnInit } from "@angular/core";

@Directive({
  selector: "[appFileIcon]"
})
export class FileIconDirective implements OnInit {
  @Input() file: string;
  icon_classes = new Map<string, string>();

  ngOnInit(): void {
    if (!this.file) {
      return;
    }
    let extension = this.file.substr(this.file.lastIndexOf(".") + 1);
    extension = extension.toLowerCase().trim();
    this.el.nativeElement.src = this.map(extension);
  }



  constructor(private el: ElementRef) {

    // word
    this.icon_classes.set("doc", "file-word.svg");
    this.icon_classes.set("docx", "file-word.svg");
    this.icon_classes.set("odt", "file-word.svg");
    this.icon_classes.set("rtf", "file-word.svg");
    this.icon_classes.set("wps", "file-word.svg");
    this.icon_classes.set("wpd", "file-word.svg");

    // spreadsheet
    this.icon_classes.set("xls", "file-excel.svg");
    this.icon_classes.set("xlsx", "file-excel.svg");
    this.icon_classes.set("wks", "file-excel.svg");
    this.icon_classes.set("ods", "file-excel.svg");
    this.icon_classes.set("xlr", "file-excel.svg");

    // system files
    this.icon_classes.set("bak", "file-system.svg");
    this.icon_classes.set("cab", "file-system.svg");
    this.icon_classes.set("cfg", "file-system.svg");
    this.icon_classes.set("cpl", "file-system.svg");
    this.icon_classes.set("cur", "file-system.svg");
    this.icon_classes.set("dll", "file-system.svg");
    this.icon_classes.set("dmp", "file-system.svg");
    this.icon_classes.set("drv", "file-system.svg");
    this.icon_classes.set("icns", "file-system.svg");
    this.icon_classes.set("ico", "file-system.svg");
    this.icon_classes.set("ini", "file-system.svg");
    this.icon_classes.set("lnk", "file-system.svg");
    this.icon_classes.set("msi", "file-system.svg");
    this.icon_classes.set("sys", "file-system.svg");
    this.icon_classes.set("tmp", "file-system.svg");


    // presentation
    this.icon_classes.set("ppt", "file-powerpoint.svg");
    this.icon_classes.set("pptx", "file-powerpoint.svg");
    this.icon_classes.set("key", "file-powerpoint.svg");
    this.icon_classes.set("odp", "file-powerpoint.svg");
    this.icon_classes.set("pps", "file-powerpoint.svg");

    // text
    this.icon_classes.set("txt", "file-text.svg");

    // csv
    this.icon_classes.set("csv", "file-delimited.svg");

    // pdf
    this.icon_classes.set("pdf", "file-pdf.svg");

    // certificates
    this.icon_classes.set("crt", "file-certificate.svg");
    this.icon_classes.set("pfx", "file-certificate.svg");

    // zip
    this.icon_classes.set("zip", "file-zip.svg");
    this.icon_classes.set("7z", "file-zip.svg");
    this.icon_classes.set("arj", "file-zip.svg");
    this.icon_classes.set("deb", "file-zip.svg");
    this.icon_classes.set("pkg", "file-zip.svg");
    this.icon_classes.set("rar", "file-zip.svg");
    this.icon_classes.set("rpm", "file-zip.svg");
    this.icon_classes.set("gz", "file-zip.svg");
    this.icon_classes.set("z", "file-zip.svg");

    // cad
    this.icon_classes.set("cad", "file-cad.svg");

    // code
    this.icon_classes.set("asp", "file-code.svg");
    this.icon_classes.set("cs", "file-code.svg");
    this.icon_classes.set("aspx", "file-code.svg");
    this.icon_classes.set("cfm", "file-code.svg");
    this.icon_classes.set("cgi", "file-code.svg");
    this.icon_classes.set("css", "file-code.svg");
    this.icon_classes.set("htm", "file-code.svg");
    this.icon_classes.set("html", "file-code.svg");
    this.icon_classes.set("js", "file-code.svg");
    this.icon_classes.set("jsp", "file-code.svg");
    this.icon_classes.set("part", "file-code.svg");
    this.icon_classes.set("php", "file-code.svg");
    this.icon_classes.set("rss", "file-code.svg");
    this.icon_classes.set("xhtml", "file-code.svg");
    this.icon_classes.set("py", "file-code.svg");
    this.icon_classes.set("c", "file-code.svg");
    this.icon_classes.set("class", "file-code.svg");
    this.icon_classes.set("h", "file-code.svg");
    this.icon_classes.set("java", "file-code.svg");
    this.icon_classes.set("sh", "file-code.svg");
    this.icon_classes.set("swift", "file-code.svg");
    this.icon_classes.set("vb", "file-code.svg");


    // images
    this.icon_classes.set("ai", "file-image.svg");
    this.icon_classes.set("bmp", "file-image.svg");
    this.icon_classes.set("gif", "file-image.svg");
    this.icon_classes.set("ico", "file-image.svg");
    this.icon_classes.set("jpeg", "file-image.svg");
    this.icon_classes.set("jpg", "file-image.svg");
    this.icon_classes.set("png", "file-image.svg");
    this.icon_classes.set("psd", "file-image.svg");
    this.icon_classes.set("svg", "file-image.svg");
    this.icon_classes.set("tif", "file-image.svg");
    this.icon_classes.set("tiff", "file-image.svg");

    // audio
    this.icon_classes.set("aif", "file-music.svg");
    this.icon_classes.set("cda", "file-music.svg");
    this.icon_classes.set("mid", "file-music.svg");
    this.icon_classes.set("midi", "file-music.svg");
    this.icon_classes.set("mp3", "file-music.svg");
    this.icon_classes.set("mpa", "file-music.svg");
    this.icon_classes.set("ogg", "file-music.svg");
    this.icon_classes.set("wav", "file-music.svg");
    this.icon_classes.set("wma", "file-music.svg");
    this.icon_classes.set("wpl", "file-music.svg");

    // iso
    this.icon_classes.set("bin", "file-disc.svg");
    this.icon_classes.set("dmg", "file-disc.svg");
    this.icon_classes.set("iso", "file-disc.svg");
    this.icon_classes.set("toast", "file-disc.svg");
    this.icon_classes.set("vcd", "file-disc.svg");

    // db
    this.icon_classes.set("dat", "file-database.svg");
    this.icon_classes.set("db", "file-database.svg");
    this.icon_classes.set("dbf", "file-database.svg");
    this.icon_classes.set("log", "file-database.svg");
    this.icon_classes.set("mdb", "file-database.svg");
    this.icon_classes.set("sav", "file-database.svg");
    this.icon_classes.set("sql", "file-database.svg");

    // xml
    this.icon_classes.set("xml", "file-xml.svg");

    // exe
    this.icon_classes.set("apk", "file-alert.svg");
    this.icon_classes.set("bat", "file-alert.svg");
    this.icon_classes.set("bin", "file-alert.svg");
    this.icon_classes.set("cgi", "file-alert.svg");
    this.icon_classes.set("pl", "file-alert.svg");
    this.icon_classes.set("com", "file-alert.svg");
    this.icon_classes.set("exe", "file-alert.svg");
    this.icon_classes.set("gadget", "file-alert.svg");
    this.icon_classes.set("jar", "file-alert.svg");
    this.icon_classes.set("wsf", "file-alert.svg");

    // font
    this.icon_classes.set("fnt", "file-font.svg");
    this.icon_classes.set("fon", "file-font.svg");
    this.icon_classes.set("otf", "file-font.svg");
    this.icon_classes.set("ttf", "file-font.svg");

    // video
    this.icon_classes.set("3g2", "file-video.svg");
    this.icon_classes.set("3gp", "file-video.svg");
    this.icon_classes.set("avi", "file-video.svg");
    this.icon_classes.set("flv", "file-video.svg");
    this.icon_classes.set("h264", "file-video.svg");
    this.icon_classes.set("m4v", "file-video.svg");
    this.icon_classes.set("mkv", "file-video.svg");
    this.icon_classes.set("mov", "file-video.svg");
    this.icon_classes.set("mp4", "file-video.svg");
    this.icon_classes.set("mpg", "file-video.svg");
    this.icon_classes.set("mpeg", "file-video.svg");
    this.icon_classes.set("rm", "file-video.svg");
    this.icon_classes.set("swf", "file-video.svg");
    this.icon_classes.set("vob", "file-video.svg");
    this.icon_classes.set("wmv", "file-video.svg");
  }

  public map(extension: string): string {
    let result = "/assets/icons/file-document.svg";
    if (this.icon_classes.has(extension)) {
      const icon = this.icon_classes.get(extension);
      result = `/assets/icons/${icon}`;
    }

    return result;
  }
}
