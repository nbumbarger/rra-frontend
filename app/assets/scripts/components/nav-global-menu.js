'use strict';
import React from 'react';
import { Link } from 'react-router';

import { t, getLanguage } from '../utils/i18n';

const NavGlobalMenu = React.createClass({

  propTypes: {},

  render: function () {
    return (
      <ul className='nav-global-menu'>
        <li><Link to={`/${getLanguage()}/projects`} title='Visit projects page'><span>{t('Projects')}</span></Link></li>
        <li><Link to={`/${getLanguage()}/about`} title='Visit about page'><span>{t('About')}</span></Link></li>
        <li><Link to={`/${getLanguage()}/help`} title='Visit help page'><span>{t('Help')}</span></Link></li>
      </ul>
    );
  }
});

export default NavGlobalMenu;