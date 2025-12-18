/* This is implementation of BreadCrumbs, this is for secondary navigation and it shows the path of the current page.
  Author : Shweta Vyas    
*/

import { Link as RouterLink, useLocation } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import '../styles/Breadcrumbs.css'
import { useContext } from 'react';
import { ProjectContext } from '../ProjectContext';


function Breadcrumb() {
  const { projectSiteName } = useContext(ProjectContext);
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Breadcrumbs aria-label="breadcrumb" separator={
      <NavigateNextIcon
        fontSize="small"
      />} className="breadcrumb">
      {pathnames.map((value, index) => {
        //to decode the URL component
        const formattedValue = decodeURIComponent(value);

        // Determine if this is the last breadcrumb
        const last = index === pathnames.length - 1;

        // Construct the URL for the breadcrumb link
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        // Check if the current or previous path segment is 'gateways' or 'project-sites'
        const isGateway = pathnames[index - 1] === 'gateways';
        const isProjectSite = pathnames[index - 1] === 'project-sites';
        // Determine the link destination based on the path segment
        const linkTo = isGateway ? `/project-sites/${projectSiteName}/gateways` : isProjectSite ? `/project-sites/${projectSiteName}/schematic-status` : to;

        // Format breadcrumb text ( replaces hyphens with spaces and capitalizes the first letter of each word.)
        const breadcrumbText = (value === projectSiteName)
          ? formattedValue
          : formattedValue.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        // Return the breadcrumb link or text    
        return last ? (
          <Typography color="textSecondary" key={to} className="active-link">
            {breadcrumbText}
          </Typography>
        ) : (
          <Link color="inherit" component={RouterLink} to={linkTo} key={to}>
            {breadcrumbText}
          </Link>
        );
      })}
    </Breadcrumbs>

  );
}

export default Breadcrumb;