import React from "react";
import { toast } from "bulma-toast";
import ReactModal from "react-modal";
import { useHotkeys } from "react-hotkeys-hook";
import { v4 as uuidv4 } from "uuid";
import { supabase, WorldInfoBasic } from "./db";

interface Props {
  worlds: Array<WorldInfoBasic>;
  onWorldAdded: () => Promise<void>;
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

export const WorldAdd = (props: Props): React.ReactElement => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const hasValidSession = supabase().auth.session();

  useHotkeys("n", () => {
    if (hasValidSession) {
      setModalOpen(true);
    }
  });

  const submit = async () => {
    if (props.worlds.filter((world) => world.name === name).length > 0) {
      setError("A world with that name already exists");
      return;
    }
    const { error: err } = await supabase()
      .from("worlds")
      .insert([{ id: uuidv4(), name }]);
    if (err === null) {
      toast({
        message: "World saved!",
        type: "is-info",
        position: "top-center",
        duration: 5000,
      });
      setError(null);
      setModalOpen(false);
      await props.onWorldAdded();
    } else {
      console.log(`Error storing world: ${err.message}`);
      setError("Could not store that world");
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
            Add new world
          </h3>
          <section className="section">
            <div className="field">
              <label className="label">Name of the world</label>
              <input
                className="input"
                type="text"
                id="world-add"
                placeholder="..."
                required={true}
                maxLength={30}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="control">
              <button
                className="button is-link is-primary"
                onClick={submit}
                disabled={name.length === 0}
              >
                Submit
              </button>
            </div>
            {error && <p className="m-text has-text-danger">{error}</p>}
          </section>
        </div>
      </ReactModal>
    </div>
  );
};
