import { useEffect, useState } from "react";
import { useAppContext } from "../App";
import { useDataProvider } from "react-admin";
import { Box, Chip } from "@mui/material";

// every 10 seconds
const SERVER_CURRENT_PROCCESS_INTERVAL_TIME = 1 * 1000;

const useCurrentServerProcess = () => {
  const [serverCommand, setServerCommand] = useState("");
  const [serverLockedAt, setServerLockedAt] = useState("");
  const { etkeccAdmin } = useAppContext();
  const dataProvider = useDataProvider();

  useEffect(() => {
    let serverCheckInterval: NodeJS.Timeout;
    if (etkeccAdmin) {
      serverCheckInterval = setInterval(async () => {
        const serverStatus = await dataProvider.getServerRunningProcess(etkeccAdmin);
        if (serverStatus.command) {
          setServerCommand(serverStatus.command);
        }
        if (serverStatus.locked_at) {
          setServerLockedAt(new Date(serverStatus.locked_at).toLocaleString());
        }
      }, SERVER_CURRENT_PROCCESS_INTERVAL_TIME);
    }

    return () => {
      if (serverCheckInterval) {
        clearInterval(serverCheckInterval);
      }
    }
  }, [etkeccAdmin]);

  return { serverCommand, serverLockedAt };
};

const ServerRunningProcess = () => {
  const { serverCommand, serverLockedAt } = useCurrentServerProcess();

  return <Box>
    {serverCommand && serverLockedAt && <Chip label={`${serverCommand} - ${serverLockedAt}`} />}
  </Box>
};

export default ServerRunningProcess;