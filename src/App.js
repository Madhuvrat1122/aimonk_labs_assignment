import React, { useState } from "react";
import TagView from "./TagView";

const initialTree = {
  name: "root",
  children: [
    {
      name: "child1",
      children: [
        { name: "child1-child1", data: "c1-c1 Hello" },
        { name: "child1-child2", data: "c1-c2 JS" }
      ]
    },
    {
      name: "child2",
      data: "c2 World"
    }
  ]
};

let id = 1;
function attachMeta(node) {
  if (!node.__id) node.__id = id++;
  if (typeof node.__collapsed === "undefined") node.__collapsed = false;
  if (node.children) node.children.forEach(attachMeta);
}
attachMeta(initialTree);

export default function App() {
  const [tree, setTree] = useState(initialTree);
  const [exportJson, setExportJson] = useState("");

  function withTreeMutate(mutator) {
    const newTree = structuredClone(tree);
    mutator(newTree);
    attachMeta(newTree);
    setTree(newTree);
  }

  function exportTree() {
    function strip(node) {
      const clean = { name: node.name };
      if (node.children) clean.children = node.children.map(strip);
      else if (node.data) clean.data = node.data;
      return clean;
    }
    setExportJson(JSON.stringify(strip(tree), null, 2));
  }

  return (
    <div className="app">
      <header>
        <h1>Nested Tags Tree</h1>
        <button className="export-btn" onClick={exportTree}>
          Export
        </button>
      </header>

      <TagView node={tree} onMutate={withTreeMutate} />

      <section className="export-section">
        <h3>Exported JSON</h3>
        <textarea readOnly rows={10} value={exportJson}></textarea>
      </section>
    </div>
  );
}
