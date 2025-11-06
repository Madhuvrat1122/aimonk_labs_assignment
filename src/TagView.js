import React, { useState } from "react";

export default function TagView({ node, onMutate }) {
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(node.name);

  function findById(tree, id) {
    if (tree.__id === id) return tree;
    if (tree.children) {
      for (const c of tree.children) {
        const res = findById(c, id);
        if (res) return res;
      }
    }
    return null;
  }

  const collapsed = node.__collapsed;

  const toggle = () =>
    onMutate((t) => {
      const n = findById(t, node.__id);
      n.__collapsed = !n.__collapsed;
    });

  const updateData = (val) =>
    onMutate((t) => {
      const n = findById(t, node.__id);
      n.data = val;
    });

  const addChild = () =>
    onMutate((t) => {
      const n = findById(t, node.__id);
      if (typeof n.data === "string") {
        delete n.data;
        n.children = [{ name: "New Child", data: "Data" }];
      } else {
        n.children = n.children || [];
        n.children.push({ name: "New Child", data: "Data" });
      }
    });

  const commitName = () => {
    const newName = nameInput.trim();
    if (!newName) return setEditing(false);
    onMutate((t) => {
      const n = findById(t, node.__id);
      n.name = newName;
    });
    setEditing(false);
  };

  return (
    <div className="tag">
      <div className="tag-header">
        <button className="collapse-btn" onClick={toggle}>
          {collapsed ? ">" : "v"}
        </button>

        {editing ? (
          <input
            className="name-input"
            value={nameInput}
            autoFocus
            onChange={(e) => setNameInput(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => e.key === "Enter" && commitName()}
          />
        ) : (
          <div className="tag-name" onClick={() => setEditing(true)}>
            {node.name}
          </div>
        )}

        <button className="control-btn" onClick={addChild}>
          Add Child
        </button>
      </div>

      {!collapsed && (
        <div className="tag-body">
          {node.children ? (
            <div className="children">
              {node.children.map((child) => (
                <TagView key={child.__id} node={child} onMutate={onMutate} />
              ))}
            </div>
          ) : (
            <input
              className="data-input"
              value={node.data || ""}
              onChange={(e) => updateData(e.target.value)}
            />
          )}
        </div>
      )}
    </div>
  );
}