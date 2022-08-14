import { useState, useEffect } from 'react';


const useNavigatorPermissions = (
  /** The name of the API you'd like to query. */
  name,
  /** Reference: https://developer.mozilla.org/en-US/docs/Web/API/Permissions/query */
  configuration
) => {
  const [error, setError] = useState(null);
  const [permitted, setPermitted] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        if (navigator && navigator.permissions) {
          const status = await navigator.permissions
            .query({ name, ...configuration })
          setPermitted(status.state);
          status.addEventListener('change', () => {
            setPermitted(status.state);
          });
        } else {
          throw new Error('Navigator permissions are not available.');
        }
      } catch (err) {
        setError(err);
      }
    })()
  }, [name, configuration]);

  return { status: permitted, error };
};

export default useNavigatorPermissions;