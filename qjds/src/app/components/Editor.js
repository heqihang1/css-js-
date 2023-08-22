import React, { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";

export const Editor = ({
  name,
  editor,
  initContent,
  placeholder,
  onChange = (a1, a2, a3) => {},
}) => {
  const [content, setContent] = useState(initContent);
  useEffect(() => {
    setContent(initContent);
  }, [initContent]);
  const config = {
    readonly: false,
    placeholder: placeholder,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: "insert_clear_html"
  };

  return (
    <JoditEditor
      name={name}
      id={name}
      ref={editor}
      value={content}
      config={config}
      tabIndex={1} // tabIndex of textarea
      onBlur={(newContent) => {
        setContent(newContent);
        onChange(name, newContent, true);
      }} // preferred to use only this option to update the content for performance reasons
      // onChange={newContent => {}}
    />
  );
};
