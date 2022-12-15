import { DocContainer } from "./DocContainer";
import { type Doc, init, load, save } from "@automerge/automerge";

export class SavedDocContainer<T> extends DocContainer<T> {
  doc: Uint8Array;

  constructor(doc?: Doc<any>) {
    super();
    this.doc = save<T>(doc || init());
  }
  
  getDoc(): Doc<T> {
    return load<T>(this.doc);
  }

  setDoc(doc: Doc<T>): void {
    this.doc = save<T>(doc);
  }
  
}
