import React from "react";
import { toast } from "bulma-toast";
import { CoordinateAdd } from "./CoordinateAdd";
import { supabase, Coordinate } from "./db";
import { toGPS } from "./utils";

interface Props {
  worldId: string;
}

const coordinateToClipboard = async (coordinate: Coordinate): Promise<void> => {
  const text = toGPS(coordinate);
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
      message: `Could not copy coordinate to clipboard; text is: ${text}`,
      type: "is-danger",
      position: "top-center",
      duration: 10000,
    });
  }
};

export const CoordinateListing = (props: Props): React.ReactElement => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [coordinates, setCoordinates] = React.useState<Array<Coordinate>>([]);

  const loadCoordinates = async (worldId: string): Promise<void> => {
    const { data, error: err } = await supabase()
      .from("coordinates")
      .select("*")
      .eq("world_id", worldId);
    if (err) {
      setError(err.message);
    } else {
      setError(null);
    }
    if (data) {
      setCoordinates(data);
    }
    setLoading(false);
  };

  const onCoordinateAdded = async () => {
    await loadCoordinates(props.worldId);
  };

  React.useEffect(() => {
    (async () => {
      await loadCoordinates(props.worldId);
    })();
  }, [props.worldId]);

  const coordinateCard = (coordinate: Coordinate, index: number) => {
    return (
      <div className="card" key={`coordinate-card-${index}`}>
        <div className="card-content">
          <div className="content">
            <div className="columns">
              <div className="column is-11">
                <p
                  key={`coordinate-${index}`}
                  className="m-text has-text-light"
                >
                  {coordinate.name}
                </p>
              </div>
              <div className="column">
                <p className="buttons">
                  <button
                    className="button is-primary is-outlined"
                    title="Copy to clipboard"
                    onClick={() => coordinateToClipboard(coordinate)}
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
          <h4 className="title is-4">GPS Coordinates</h4>
        </div>
        <div className="column">
          <CoordinateAdd
            worldId={props.worldId}
            coordinates={coordinates}
            onCoordinateAdded={onCoordinateAdded}
          />
        </div>
      </div>
      {loading && (
        <p className="m-text has-text-light">Loading coordinates ...</p>
      )}
      {error && (
        <p className="m-text has-text-danger">Error loading data: {error}</p>
      )}
      {coordinates.map(coordinateCard)}
    </div>
  );
};
