import { DocContainer } from "./DocContainer";
import { type Doc, init, initSyncState } from "@automerge/automerge";

export class MemoryDocContainer<T> extends DocContainer<T> {
  doc: Doc<T>;

  constructor(doc?: Doc<any>) {
    super();
    this.doc = doc || init();
  }
  
  getDoc(): Doc<T> {
    return this.doc;
  }

  setDoc(doc: Doc<T>): void {
    this.doc = doc;
  }
  
}
