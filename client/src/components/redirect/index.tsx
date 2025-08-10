import { route } from "preact-router";
import { useEffect } from "preact/hooks";

import useAppState from "../../hooks/useappstate";

const Redirect = () => {
  const { appState } = useAppState();

  useEffect(() => {
    const path = window.location.pathname;
    // Only redirect if we're not already on a server route and not on the root or unauthorized page
    if (!path.startsWith('/server/') && path !== '/' && path !== '/unauthorized') {
      const newPath = `/server/${appState.homeServerId}${path}`;
      if (newPath !== window.location.pathname) {
        route(newPath);
      }
    }
  }, [appState.homeServerId]);

  return null;
};

export default Redirect;
