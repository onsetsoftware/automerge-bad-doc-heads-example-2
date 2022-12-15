# Automerge mismatching heads example 2

To reproduce the issue, clone the repo then run `npm install` and `npm run dev` (or yarn equivalents).

This example sets up 2 document containers, one which maintains its document in its raw format and then other which saves and loads the document to/from its binary form. A change is made to `container1` and then it is synced to `container2`.

If both document containers keep the doc in its raw format, no error occurs. If the document is saved and loaded from its binary form, the error occurs when the count value in the document is set to 33.
