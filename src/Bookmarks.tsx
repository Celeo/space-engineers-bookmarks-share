// this component should be split into handling viewing bookmarks and saving new ones

import React, { ClipboardEvent } from "react";
import { toast } from "bulma-toast";
import ReactModal from "react-modal";
import { useHotkeys } from "react-hotkeys-hook";
import { supabase, Bookmark } from "./db";
import { parseGPS, toGPS } from "./utils";

interface Props {
  worldId: string;
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

const bookmarkToClipboard = async (bookmark: Bookmark): Promise<void> => {
  const text = toGPS(bookmark);
  try {
    await navigator.clipboard.writeText(text);
    toast({
      message: "Copied to clipboard",
      type: "is-info",
      position: "top-center",
      duration: 5000,
    });
  } catch (error) {
    console.error(`Error copying to clipboard: ${error}`);
    toast({
      message: `Could not copy to clipboard; text is: ${text}`,
      type: "is-danger",
      position: "top-center",
      duration: 10000,
    });
  }
};

export const BookmarkListing = (props: Props): React.ReactElement => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [newBookmarkValid, setNewBookmarkValid] = React.useState(true);
  const [bookmarks, setBookmarks] = React.useState<Array<Bookmark>>([]);
  const [modalOpen, setModalOpen] = React.useState(false);

  const hasValidSession = supabase().auth.session();

  useHotkeys("n", (): void => {
    if (hasValidSession) {
      setModalOpen(true);
    }
  });

  const loadBookmarks = async (worldId: string): Promise<void> => {
    const { data, error: err } = await supabase()
      .from("bookmarks")
      .select("*")
      .eq("world_id", worldId);
    if (err) {
      setError(err.message);
    } else {
      setError(null);
    }
    if (data) {
      setBookmarks(data);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    (async () => {
      await loadBookmarks(props.worldId);
    })();
  }, [props.worldId]);

  const onPaste = async (
    event: ClipboardEvent<HTMLTextAreaElement>
  ): Promise<void> => {
    event.preventDefault();
    const text = event.clipboardData.getData("text");
    const parsed = parseGPS(text);

    if (parsed !== null) {
      if (
        bookmarks.filter((bookmark) => bookmark.name === parsed.name).length > 0
      ) {
        toast({
          message: "A bookmark with that name already exists",
          type: "is-warning",
          position: "top-center",
          duration: 5000,
        });
        return;
      }

      const { error } = await supabase()
        .from("bookmarks")
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

      if (error === null) {
        toast({
          message: "Bookmark created!",
          type: "is-info",
          position: "top-center",
          duration: 5000,
        });
        setNewBookmarkValid(true);
        setModalOpen(false);
        await loadBookmarks(props.worldId);
      } else {
        console.error(`Error storing bookmark: ${error.message}`);
        toast({
          message: "Could not store that bookmark",
          type: "is-danger",
          position: "top-center",
          duration: 10000,
        });
      }
    } else {
      setNewBookmarkValid(false);
    }
  };

  const bookmarkCard = (bookmark: Bookmark, index: number) => {
    return (
      <div className="card" key={`bookmark-card-${index}`}>
        <div className="card-content">
          <div className="content">
            <div className="columns">
              <div className="column is-11">
                <p key={`bookmark-${index}`} className="m-text has-text-light">
                  {bookmark.name}
                </p>
              </div>
              <div className="column">
                <p className="buttons">
                  <button
                    className="button is-primary is-outlined"
                    title="Copy to clipboard"
                    onClick={() => bookmarkToClipboard(bookmark)}
                  >
                    <span className="icon">
                      <i className="fas fa-copy"></i>
                    </span>
                    <span>Copy</span>
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="columns">
        <div className="column is-10">
          <h4 className="title is-4">Bookmarks</h4>
        </div>
        <div className="column">
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
        </div>
      </div>
      {loading && (
        <p className="m-text has-text-light">Loading bookmarks ...</p>
      )}
      {error && (
        <p className="m-text has-text-danger">Error loading data: {error}</p>
      )}
      {bookmarks.map(bookmarkCard)}
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
            <p className="m-text has-text-success">Paste your bookmark here</p>
            <textarea className="textarea" onPaste={onPaste} />
            {!newBookmarkValid && (
              <p className="m-text has-text-danger">
                That text doesn't match a valid bookmark copied from the game
              </p>
            )}
          </section>
        </div>
      </ReactModal>
    </div>
  );
};
