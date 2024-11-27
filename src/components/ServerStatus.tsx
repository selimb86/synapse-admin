import { Avatar, Box, Badge, Theme, Tooltip } from "@mui/material";
import { useState, useEffect } from "react";
import { useAppContext } from "../App";
import { useDataProvider } from "react-admin";
import { styled } from '@mui/material/styles';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { BadgeProps } from "@mui/material/Badge";
import { useNavigate } from "react-router";

interface StyledBadgeProps extends BadgeProps {
  isOkay: boolean;
  theme?: Theme;
}

const StyledBadge = styled(Badge, { shouldForwardProp: (prop) => prop !== 'isOkay' })<StyledBadgeProps>(({ theme, isOkay }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: isOkay ? theme.palette.success.main : theme.palette.error.main,
      color: isOkay ? theme.palette.success.main : theme.palette.error.main,
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
}));

// every 5 minutes
const SERVER_STATUS_INTERVAL_TIME = 5 * 1000;

const useServerStatus = () => {
  const [isOkay, setIsOkay] = useState(false);
  const [successCheck, setSuccessCheck] = useState(false);
  const { etkeccAdmin } = useAppContext();
  const dataProvider = useDataProvider();

  useEffect(() => {
    let serverStatusInterval: NodeJS.Timeout;
    if (etkeccAdmin) {
        serverStatusInterval = setInterval(async () => {
        const serverStatus = await dataProvider.getServerStatus(etkeccAdmin);
        console.log("serverStatus@", serverStatus);
        setIsOkay(serverStatus.ok);
        setSuccessCheck(serverStatus.success);
      }, SERVER_STATUS_INTERVAL_TIME);
    }

    return () => {
      if (serverStatusInterval) {
        clearInterval(serverStatusInterval);
      }
    }
  }, [etkeccAdmin]);

  return { isOkay, successCheck };
};

const ServerStatus = () => {
    const { isOkay, successCheck } = useServerStatus();
    const navigate = useNavigate();

    if (!successCheck) {
      return null;
    }

    const handleServerStatusClick = () => {
      navigate("/server_status");
    };

    return <Box onClick={handleServerStatusClick}>
      <Tooltip title="Server Status">
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
        isOkay={isOkay}
      >
        <Avatar sx={{ height: 24, width: 24 }}>
          <MonitorHeartIcon sx={{ height: 16, width: 16 }} />
        </Avatar>
      </StyledBadge>
      </Tooltip>
    </Box>
};

export default ServerStatus;