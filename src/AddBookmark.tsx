import React, { ClipboardEvent } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import ReactModal from "react-modal";

const modalStyle = {
  content: {
    top: "20%",
    left: "20%",
    right: "20%",
    bottom: "20%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    fontSize: "120%",
  },
};

export const AddBookmark = (): React.ReactElement => {
  const [modalOpen, setModalOpen] = React.useState(false);

  useHotkeys("n", (): void => {
    setModalOpen(true);
  });

  const onPaste = (event: ClipboardEvent<HTMLTextAreaElement>): void => {
    const text = event.clipboardData.getData("text");
    setModalOpen(false);
  };

  return (
    <ReactModal
      isOpen={modalOpen}
      contentLabel="label"
      ariaHideApp={false}
      onRequestClose={() => setModalOpen(false)}
      style={modalStyle}
    >
      <div>
        <h2 style={{ textAlign: "center" }}>Paste new</h2>
        <p>Paste your bookmark here</p>
        <textarea onPaste={onPaste} />
      </div>
    </ReactModal>
  );
};
