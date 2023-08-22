// drag drop file component
import React from "react";
import "./DragAndDrop.css";
export function DragDropFile({
  utils: {
    handleChange,
    inputRef,
    dragActive,
    onButtonClick,
    handleDrag,
    handleDrop,
    files = [],
    removeFile,
  },
}) {
  return (
    <div id="form-file-upload">
      <input
        ref={inputRef}
        type="file"
        id="input-file-upload"
        onChange={handleChange}
      />
      <div id="label-file-upload">
        {files.length > 0 && (
          <div className="w-75">
            {files.map((file, index) => (
              <div
                key={index}
                className="d-flex align-items-center justify-content-between w-100 px-4 py-3 bg-secondary text-align-left rounded border mb-1"
              >
                <div>
                  <span className="mr-4">{index + 1}</span>
                  <span style={{ overflowWrap: 'anywhere'}}>{file.filename}</span> - {file.size} mb
                </div>
                <span
                  onClick={(e) => removeFile(index)}
                  className="bg-danger cursor-pointer text-white py-2 px-3 small d-block rounded"
                >
                  X
                </span>
              </div>
            ))}
          </div>
        )}
        <label
          htmlFor="input-file-upload"
          className={dragActive ? "drag-active" : ""}
        >
          <div>
            <p>Drag and drop your file here or</p>
            <button
              className="upload-button"
              type="button"
              onClick={onButtonClick}
            >
              Upload a file
            </button>
          </div>
        </label>
      </div>

      {dragActive && (
        <div
          id="drag-file-element"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
    </div>
  );
}
