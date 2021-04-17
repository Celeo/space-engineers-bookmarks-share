import React, { ClipboardEvent } from "react";
import { toast } from "bulma-toast";
import ReactModal from "react-modal";
import { useHotkeys } from "react-hotkeys-hook";
import { supabase, Coordinate } from "./db";
import { parseGPS } from "./utils";

interface Props {
  worldId: string;
  coordinates: Array<Coordinate>;
  onCoordinateAdded: () => Promise<void>;
}

const modalStyle = {
  content: {
    top: "20%",
    left: "20%",
    right: "20%",
    bottom: "20%",
    backgroundColor: "rgba(25, 25, 25, 0.8)",
    fontSize: "120%",
  },
};

export const CoordinateAdd = (props: Props): React.ReactElement => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const hasValidSession = supabase().auth.session();

  useHotkeys("n", (): void => {
    if (hasValidSession) {
      setModalOpen(true);
    }
  });

  const onPaste = async (
    event: ClipboardEvent<HTMLTextAreaElement>
  ): Promise<void> => {
    event.preventDefault();
    const text = event.clipboardData.getData("text");
    const parsed = parseGPS(text);

    if (parsed === null) {
      setError("That is not a valid GPS coordinate ");
      return;
    }
    if (
      props.coordinates.filter((coordinate) => coordinate.name === parsed.name)
        .length > 0
    ) {
      setError("A coordinate with that name already exists");
      return;
    }

    const { error: err } = await supabase()
      .from("coordinates")
      .insert([
        {
          name: parsed.name,
          x: parsed.x,
          y: parsed.y,
          z: parsed.z,
          color: parsed.color,
          world_id: props.worldId,
        },
      ]);

    if (err === null) {
      toast({
        message: "Coordinate saved!",
        type: "is-info",
        position: "top-center",
        duration: 5000,
      });
      setError(null);
      setModalOpen(false);
      await props.onCoordinateAdded();
    } else {
      console.log(`Error storing coordinate: ${err.message}`);
      setError("Could not store that coordinate");
    }
  };

  return (
    <div>
      {hasValidSession && (
        <button
          className="button is-light is-outlined"
          onClick={() => setModalOpen(true)}
          title="Or use the N key"
        >
          <span className="icon">
            <i className="fas fa-plus-square"></i>
          </span>
          <span>Add new</span>
        </button>
      )}
      <ReactModal
        isOpen={modalOpen}
        contentLabel="label"
        ariaHideApp={false}
        onRequestClose={() => setModalOpen(false)}
        style={modalStyle}
      >
        <div>
          <h3 className="title is-3" style={{ textAlign: "center" }}>
            Paste new
          </h3>
          <section className="section">
            <p className="m-text has-text-success">
              Paste your GPS coordinate here
            </p>
            <textarea className="textarea" onPaste={onPaste} />
            {error && <p className="m-text has-text-danger">{error}</p>}
          </section>
        </div>
      </ReactModal>
    </div>
  );
};
