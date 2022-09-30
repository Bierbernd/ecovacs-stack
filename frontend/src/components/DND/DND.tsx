import { DarkMode } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import dayjs from 'dayjs';

import { getDoNotDisturb } from '../../store/vacuum/stateSlice';
import theme from '../../theme';

const DND = () => {
  const { enable, start, end } = getDoNotDisturb();
  const now = dayjs();

  return (
    <>
      {!!enable && !!dayjs(start).isBefore(now) && !!dayjs(end).isAfter(now) && (
        <Avatar sx={{ marginRight: theme.typography.pxToRem(15) }}>
          <DarkMode color="warning" />
        </Avatar>
      )}
    </>
  );
};

export default DND;
