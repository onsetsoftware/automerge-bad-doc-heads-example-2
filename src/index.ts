import * as Automerge from "@automerge/automerge";
import { change } from "@automerge/automerge";
import { DocContainer } from "./DocContainer";
import { MemoryDocContainer } from "./MemoryDocContainer";
import { SavedDocContainer } from "./SavedDocContainer";

type DocStructure = {
  counter: {
    value: number;
    updatedAt: number;
    name: string;
  };
};

const initialState: DocStructure = {
  counter: { updatedAt: 0, value: 0, name: "a" }
};

const shallowCompare = (obj1: Record<string, any>, obj2: Record<string, any>) =>
    Object.keys(obj1).length === Object.keys(obj2).length &&
    Object.keys(obj1).every(key =>
        obj2.hasOwnProperty(key) && obj1[key] === obj2[key]
    );

const doc = Automerge.init<DocStructure>();

const container1 = new MemoryDocContainer<DocStructure>(change<DocStructure>(doc, (doc) => {
  Object.assign(doc, initialState);
}));

// const container2 = new MemoryDocContainer<DocStructure>();
const container2 = new SavedDocContainer<DocStructure>();

try {
  for (let i = 0; i < 100; i++) {
    container1.change((doc) => {
      doc.counter.value++;
      doc.counter.name += "a";
      doc.counter.updatedAt = Date.now();
    });
    
    container1.syncWithContainer(container2);

    console.log("at count", container1.getDoc().counter.value, "the document values are", shallowCompare({...
      container1
      .getDoc().counter
    }, {...container2.getDoc().counter}) ? 'equal' : 'not equal (' + JSON.stringify(container1.getDoc()) + ' vs ' + JSON.stringify(container2.getDoc()) + ")");
  }
} catch (e) {
  console.error(e, "when syncing count to", container1.getDoc().counter.value);
}

