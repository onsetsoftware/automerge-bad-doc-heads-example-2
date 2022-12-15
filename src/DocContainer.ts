import {
  type Doc,
  init,
  type SyncState,
  initSyncState,
  generateSyncMessage,
  receiveSyncMessage,
  change,
  getHeads, load, save
} from "@automerge/automerge";

export abstract class DocContainer<T> {
  peerState: SyncState;
  
  protected constructor(doc?: Doc<any>) {
    this.peerState = initSyncState();
    this.setDoc(doc || init());
  }
  
  abstract setDoc(doc: Doc<T>): void;
  abstract getDoc(): Doc<T>;
  
  change(fn: (doc: any) => void) {
    this.setDoc(change(this.getDoc(), fn));
  }
  
  syncWithContainer(container: DocContainer<T>) {
    let messageForContainer = this.getSyncMessage(),
      messageForThis;
    
    while (messageForContainer) {
      messageForThis = container.receiveSyncMessage(messageForContainer);
      messageForContainer = messageForThis ? this.receiveSyncMessage(messageForThis) : null;
    }
  }
  
  getSyncMessage() {
    const [nextPeerState, syncMessage] = generateSyncMessage(
      this.getDoc(),
      this.peerState
    );
    
    this.peerState = nextPeerState;
    
    return syncMessage;
  }
  
  receiveSyncMessage(syncMessage: Uint8Array) {
    const [nextDoc, nextPeerState] = receiveSyncMessage(
      this.getDoc(),
      this.peerState,
      syncMessage
    );
    
    this.peerState = nextPeerState;
    
    this.setDoc(nextDoc);
    
    return this.getSyncMessage();
  }
}
