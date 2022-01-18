import { FormControlLabel, FormGroup, Grid, Link as MUILink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Switch from '@mui/material/Switch';

export function Header({ toggleTheme }: { toggleTheme: () => void }) {
    return (
        <Grid container item alignItems="center" justifyContent="space-between" mb={4}>
            <Grid item>
                <MUILink variant="h2" underline="none" sx={{ color: 'text.primary' }} component={RouterLink} to={'/'}>
                    GitHub Scanner
                </MUILink>
            </Grid>
            <Grid item>
                <FormGroup>
                    <FormControlLabel control={<Switch onChange={toggleTheme} />} label="Theme" />
                </FormGroup>
            </Grid>
        </Grid>
    );
}
