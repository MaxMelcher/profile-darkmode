import { Directive, Output, HostBinding, HostListener, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective {

  @Output() FileDropped = new EventEmitter<any>();

  @HostBinding('style.background-color') private background = '#f5fcff';
  @HostBinding('style.opacity') private opacity = '1';

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#9ecbec';
    this.opacity = '0.8';
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#f5fcff';
    this.opacity = '1';
  }

  // Drop listener
  @HostListener('drop', ['$event']) public async ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#f5fcff';
    this.opacity = '1';
    let f = await this.getAllFileEntries(evt.dataTransfer.items);
    if (f.length > 0) {

      //emit in chunks
      for (var i = 0; i < f.length;) {
        var chunk = f.slice(i, i + 100);
        setTimeout(() => {
          this.FileDropped.emit(chunk);
        }, 250);
        i = i + 100;
      }
    }
  }

  //https://stackoverflow.com/questions/3590058/does-html5-allow-drag-drop-upload-of-folders-or-a-folder-tree
  // Drop handler function to get all files
  async getAllFileEntries(dataTransferItemList) {
    let fileEntries = [];
    // Use BFS to traverse entire directory/file structure
    let queue = [];
    // Unfortunately dataTransferItemList is not iterable i.e. no forEach
    for (let i = 0; i < dataTransferItemList.length; i++) {
      queue.push(dataTransferItemList[i].webkitGetAsEntry());
    }


    while (queue.length > 0) {
      let entry = queue.shift();

      if (entry.isFile) {

        //convert the fileentry to file
        let file = await DragDropDirective.getFile(entry);
        entry.size = file.size;

        fileEntries.push(entry);
      } else if (entry.isDirectory) {
        queue.push(...await this.readAllDirectoryEntries(entry.createReader()));
      }
    }
    return fileEntries;
  }

  // Get all the entries (files or sub-directories) in a directory 
  // by calling readEntries until it returns empty array
  async readAllDirectoryEntries(directoryReader) {
    let entries = [];
    let readEntries = await this.readEntriesPromise(directoryReader);
    while (readEntries.length > 0) {
      entries.push(...readEntries);
      readEntries = await this.readEntriesPromise(directoryReader);
    }
    return entries;
  }

  static async getFile(file): Promise<any> {
    return await new Promise((resolve, reject) => {
      file.file(resolve, reject);
    });
  }

  // Wrap readEntries in a promise to make working with readEntries easier
  // readEntries will return only some of the entries in a directory
  // e.g. Chrome returns at most 100 entries at a time
  async readEntriesPromise(directoryReader): Promise<any[]> {
    try {
      return await new Promise((resolve, reject) => {
        directoryReader.readEntries(resolve, reject);
      });
    } catch (err) {
    }
  }
}
