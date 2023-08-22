import React from "react";
export function ResetButton({
  btnResRef,
  resetForm,
  initProduct,
  resetEditor = null,
}) {
  return (
    <button
      style={{
        display: "none",
      }}
      ref={btnResRef}
      type="button"
      onClick={() => {
        resetForm({
          values: initProduct,
        });
        resetEditor && resetEditor();
      }}
    ></button>
  );
}
