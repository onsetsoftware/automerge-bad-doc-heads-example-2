import * as Automerge from "@automerge/automerge";
import { change } from "@automerge/automerge";
import { DocContainer } from "./DocContainer";
import { MemoryDocContainer } from "./MemoryDocContainer";
import { SavedDocContainer } from "./SavedDocContainer";

type DocStructure = {
  counter: {
    value: number;
    updatedAt: number;
  };
};

const initialState: DocStructure = {
  counter: { updatedAt: 0, value: 0 }
};

const doc = Automerge.init<DocStructure>();

const container1 = new MemoryDocContainer<DocStructure>(change<DocStructure>(doc, (doc) => {
  Object.assign(doc, initialState);
}));

// const container2 = new MemoryDocContainer<DocStructure>();
const container2 = new SavedDocContainer<DocStructure>();

try {
  for (let i = 0; i < 50; i++) {
    container1.change((doc) => {
      doc.counter.value++;
      doc.counter.updatedAt = Date.now();
    });
  
    console.log(container1.getDoc().counter.value);
    
    container1.syncWithContainer(container2);
  }
} catch (e) {
  console.error(e, "when syncing count to", container1.getDoc().counter.value);
}

