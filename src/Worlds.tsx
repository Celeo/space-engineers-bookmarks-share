import React from "react";
import { Link, useParams } from "react-router-dom";
import { supabase, WorldInfoBasic } from "./db";
import { CoordinateListing } from "./Coordinates";
import { WorldAdd } from "./WorldAdd";

export const WorldListing = (): React.ReactElement => {
  const [worlds, setWorlds] = React.useState<Array<WorldInfoBasic>>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadWorlds = async (): Promise<void> => {
    const { data, error: err } = await supabase()
      .from("worlds")
      .select("id, name");
    if (err) {
      setError(err.message);
    } else {
      setError(null);
    }
    if (data) {
      setWorlds(data);
    }
    setLoading(false);
  };

  const onWorldAdded = async () => {
    await loadWorlds();
  };

  React.useEffect(() => {
    (async () => {
      await loadWorlds();
    })();
  }, []);

  return (
    <div>
      <div className="columns">
        <div className="column is-10">
          <h4 className="title is-4">Worlds</h4>
        </div>
        <div className="column">
          <WorldAdd worlds={worlds} onWorldAdded={onWorldAdded} />
        </div>
      </div>
      {loading && <p className="m-text has-text-light">Loading worlds ...</p>}
      {error && (
        <p className="m-text has-text-danger">Error loading data: {error}</p>
      )}
      <ul>
        {worlds.map((world) => (
          <li id={`world-${world.id}`} key={world.id} className="m-text">
            <Link
              to={`/worlds/${world.id}`}
              className="has-text-success has-underline"
            >
              {world.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const WorldInfo = (): React.ReactElement => {
  const { id: worldId } = useParams<Record<string, string | undefined>>();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [worldInfo, setWorldInfo] = React.useState<Record<
    string,
    unknown
  > | null>(null);

  React.useEffect(() => {
    (async () => {
      const { data, error: err } = await supabase()
        .from("worlds")
        .select("*")
        .eq("id", worldId);
      if (err) {
        setError(err.message);
      } else {
        setError(null);
      }
      if (!err && (data === null || data.length === 0)) {
        setError("No data found");
      }
      if (data !== null) {
        setWorldInfo(data[0]);
      }
      setLoading(false);
    })();
  }, [worldId]);

  return (
    <div>
      {loading && (
        <p className="m-text has-text-light">Loading world info ...</p>
      )}
      {error && (
        <p className="m-text has-text-danger">Error loading data: {error}</p>
      )}
      {!loading && !error && worldInfo && (
        <h2 className="title is-2">{worldInfo.name as string}</h2>
      )}
      <section className="section">
        {!error && worldId && <CoordinateListing worldId={worldId} />}
      </section>
    </div>
  );
};
