import React from "react";
import { supabase, World } from "./db";

export const WorldListing = (): React.ReactElement => {
  const [worlds, setWorlds] = React.useState<Array<World>>([]);

  React.useEffect(() => {
    (async () => {
      const { data: worlds, error } = await supabase.from("worlds").select("*");
      if (error) {
        console.log(error);
      } else {
        setWorlds(worlds || []);
      }
    })();
  }, []);

  return (
    <div>
      <h2 className="underline">Space Engineers Bookmark Sharing</h2>
      <div className="spacer"></div>
      <h4>Worlds</h4>
      <ul>
        {worlds.map((world) => (
          <li id={`world-${world.id}`} key={world.id}>
            <span>{world.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
